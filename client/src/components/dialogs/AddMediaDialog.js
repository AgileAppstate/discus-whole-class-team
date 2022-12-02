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
import Dropzone from '../dropzone/ImageDrop';
import ImageGrid from '../dropzone/ImageGrid';
import cuid from 'cuid';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function FormDialog() {
  const [open, setOpen] = React.useState(false);
  const [start_date, setStart_Date] = React.useState(dayjs());
  const [end_date, setEnd_Date] = React.useState(dayjs(''));
  const [images, setImages] = React.useState([]);
  const [name, setName] = React.useState('');
  const [description, setDescription] = React.useState('');
  const [start_date, setStartDate] = React.useState(dayjs());
  const [end_date, setEndDate] = React.useState(dayjs(''));
  const [newMedia, setNewMedia] = React.useState([]);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    // Sets values back to default
    setName('');
    setDescription('');
    setStartDate(dayjs());
    setEndDate(dayjs(''));
    setImages([]);
  };

  const handleStartChange = (newDate) => {
    if (newDate > end_date && end_date != '') {
      setStartDate(newDate);
      setEndDate(newDate);
    } else {
      setStartDate(newDate);
    }
  };

  const handleEndChange = (newDate) => {
    if (start_date > newDate) {
<<<<<<< HEAD
        setEnd_Date(start_date);
    } else {
        setEnd_Date(newDate);
    }
  };

=======
      setEndDate(start_date);
    } else {
      setEndDate(newDate);
    }
  };

  const handleSave = () => {
    event.preventDefault();
    const items = [];
    images.map((image) => {
      setNewMedia((prevState) => [
        ...prevState,
        {
          ['name']: name,
          ['description']: description,
          ['start_date']: start_date.toDate(),
          ['end_date']: end_date.isValid() ? end_date.toDate() : '',
          ['image']: {
            src: image.src,
            filename: image.path
          }
        }
      ]);
      items.push({
        ['name']: name,
        ['description']: description,
        ['start_date']: start_date.toDate(),
        ['end_date']: end_date.isValid() ? end_date.toDate() : '',
        // ['image']: {
        //   src: image.src,
        //   filename: image.path
        // }
      });
    });
    // For testing purposes
    console.log(items);
    // Will return an empty array, but needs to be here to compile
    console.log(newMedia);
    handleClose();
  };

>>>>>>> e0fcbe9 (Linted current changes)
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
          <Dropzone onDrop={onDrop} accept={'image/*'} />
          <ImageGrid images={images} />
          <TextField
            id="name"
            label="Name"
            variant="outlined"
            margin="normal"
            required
            fullWidth
            float
<<<<<<< HEAD
            />
          <br/>
=======
            value={name}
            onChange={handleNameChange}
          />
          <br />
>>>>>>> e0fcbe9 (Linted current changes)
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DesktopDatePicker
              id="start_date"
              label="Start Date"
              inputFormat="MM/DD/YYYY"
              margin="normal"
              value={start_date}
              onChange={handleStartChange}
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
              disabled={start_date === "" ? true: false}
              onChange={handleEndChange}
              renderInput={(params) => <TextField {...params} />}
              disablePast
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
