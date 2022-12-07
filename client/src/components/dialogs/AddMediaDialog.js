import * as React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Slide from '@mui/material/Slide';
import dayjs from 'dayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import Checkbox from '@mui/material/Checkbox';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Dropzone from '../dropzone/ImageDrop';
import ImageGrid from '../dropzone/ImageGrid';
import cuid from 'cuid';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function FormDialog(props) {
  const [open, setOpen] = React.useState(false);
  const [images, setImages] = React.useState([]);
  const [name, setName] = React.useState('');
  const [description, setDescription] = React.useState('');
  const [start_date, setStartDate] = React.useState(dayjs());
  const [end_date, setEndDate] = React.useState(dayjs(null));
  const [checked, setChecked] = React.useState(true);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    // Sets values back to default
    setName('');
    setDescription('');
    setStartDate(dayjs());
    setEndDate(dayjs(null));
    setImages([]);
    setChecked(true);
  };

  const handleChecked = (event) => {
    setChecked(event.target.checked);
  }

  const handleNameChange = (event) => {
    setName(event.target.value);
  };

  const handleDescChange = (event) => {
    setDescription(event.target.value);
  };

  const handleStartDate = (newDate) => {
    if (newDate > end_date && end_date != '') {
      setStartDate(newDate);
      setEndDate(newDate);
    } else {
      setStartDate(newDate);
    }
  };

  const handleEndDate = (newDate) => {
    if (start_date > newDate) {
      setEndDate(start_date);
    } else {
      setEndDate(newDate);
    }
  };

  const handleSave = () => {
    event.preventDefault();
    const items = [];

    // If the user somehow submits media without an image, it will add the backup image
    if (images.length) {
      images.map((image) => {
        items.push({
          ['name']: name,
          ['description']: description,
          ['start_date']: start_date.toDate(),
          ['end_date']: end_date.isValid() ? end_date.toDate() : checked ? dayjs("12/31/2099").toDate() : '',
          ['image']: {
            src: image.src,
            filename: image.path
          }
        });
      });
    } else {
      items.push({
        ['name']: name,
        ['description']: description,
        ['start_date']: start_date.toDate(),
        ['end_date']: end_date.isValid() ? end_date.toDate() : checked ? dayjs("12/31/2099").toDate() : '',
        ['image']: {
          src: '/home/discus/default.png',
          filename: 'default.png'
        }
      });
    }
    // For testing purposes
    console.log(items);
    // Adds ID to item, which will eventually be replaced with ID received from API
    items.map((item) => {
      item['id'] = cuid();
      item['image'] = item['image'].src
    });
    props.onChange(items);
    handleClose();
  };

  const onDrop = React.useCallback((acceptedFiles) => {
    acceptedFiles.map((file) => {
      const reader = new FileReader();

      reader.onload = function (e) {
        setImages((prevState) => [
          ...prevState,
          { id: cuid(), src: e.target.result, path: file.path }
        ]);
      };

      reader.readAsDataURL(file);

      return file;
    });
  }, []);

  return (
    <div>
      <Button variant="contained" onClick={handleClickOpen} color="primary">
        Add Media
      </Button>
      <Dialog open={open} onClose={handleClose} TransitionComponent={Transition}>
        <DialogTitle>Add Media</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Any information submitted on this screen will apply to all media uploaded.
          </DialogContentText>
          <Dropzone onDrop={onDrop} accept={'image/*'} required />
          <ImageGrid images={images} />
          <TextField
            id="name"
            label="Name"
            variant="outlined"
            margin="normal"
            required
            fullWidth
            float
            value={name}
            onChange={handleNameChange}
          />
          <FormGroup>
            <FormControlLabel control= {
                <Checkbox label="Indefinite End Date" 
                checked={checked} 
                onChange={handleChecked} 
                color="default" 
                />} label="No End Date" />
          </FormGroup>
          <br />
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DesktopDatePicker
              id="start_date"
              label="Start Date"
              inputFormat="MM/DD/YYYY"
              margin="normal"
              value={start_date}
              onChange={handleStartDate}
              renderInput={(params) => <TextField {...params} />}
              disablePast
            />
            <DesktopDatePicker
              id="end_date"
              label="End Date"
              inputFormat="MM/DD/YYYY"
              margin="normal"
              value={end_date}
              onChange={handleEndDate}
              renderInput={(params) => <TextField {...params} />}
              disablePast
              disabled={checked}
            />
          </LocalizationProvider>
          <br />
          <TextField
            id="description"
            label="Description"
            minRows={4}
            variant="outlined"
            margin="normal"
            multiline
            fullWidth
            required
            value={description}
            onChange={handleDescChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSave}>Save</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
