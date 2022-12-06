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
import { useTheme } from '@mui/material/styles';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

const names = [
  'Oliver Hansen',
  'Van Henry',
  'April Tucker',
  'Ralph Hubbard',
  'Omar Alexander',
  'Carlos Abbott',
  'Miriam Wagner',
  'Bradley Wilkerson',
  'Virginia Andrews',
  'Kelly Snyder',
];

function getStyles(name, personName, theme) {
  return {
    fontWeight:
      personName.indexOf(name) === -1
        ? theme.typography.fontWeightRegular
        : theme.typography.fontWeightMedium,
  };
}

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function FormDialog() {
  const theme = useTheme();
  const [personName, setPersonName] = React.useState([]);

  const handleChange = (event) => {
    const {
      target: { value },
    } = event;
    setPersonName(
      // On autofill we get a stringified value.
      typeof value === 'string' ? value.split(',') : value,
    );
  };

  const [open, setOpen] = React.useState(false);
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
        ['end_date']: end_date.isValid() ? end_date.toDate() : '',
        ['image']: {
          src: '/home/discus/default.png',
          filename: 'default.png'
        }
      });
    }
    // For testing purposes
    console.log(items);
    // Will return an empty array, but needs to be here to compile
    console.log(newMedia);
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
        Add Channels
      </Button>
      <Dialog open={open} onClose={handleClose} TransitionComponent={Transition}>
        <DialogTitle>Create a Channels</DialogTitle>
        <DialogContent>
          <Dropzone onDrop={onDrop} accept={'image/*'} required />
          <ImageGrid images={images} />
          <TextField
            id="name"
            label="Channel Name"
            variant="outlined"
            margin="normal"
            required
            fullWidth
            float
            value={name}
            onChange={handleNameChange}
          />
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
          <FormControl sx={{ m: 1, width: 300 }}>
        <InputLabel id="demo-multiple-name-label">Playlist</InputLabel>
        <Select
          labelId="demo-multiple-name-label"
          id="demo-multiple-name"
          multiple
          value={personName}
          onChange={handleChange}
          input={<OutlinedInput label="Name" />}
          MenuProps={MenuProps}
        >
          {names.map((name) => (
            <MenuItem
              key={name}
              value={name}
              style={getStyles(name, personName, theme)}
            >
              {name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
        </DialogContent>

        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSave}>Save</Button>
        </DialogActions>
        
      </Dialog>
      
    </div>
  );
}
