import * as React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import { TextareaAutosize } from '@mui/material';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Slide from '@mui/material/Slide';
import dayjs from 'dayjs';
//import Stack from '@mui/material/Stack';
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
  const [images, setImages] = React.useState([]);
  const [start_date, setStartDate] = React.useState(dayjs());
  const [end_date, setEndDate] = React.useState(dayjs());
  const [newItem, setNewItem] = React.useState({
    name: "",
    description: "",
    start_date: "",
    end_date: "",
    images: [],
  })

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    handleChange();
  };

  const handleChange = (event) => {
    console.log(event)
    setNewItem({ ...newItem, [event.target.id]: event.target.value });
  };

  const handleStartDate = (date) => {
    setStartDate(date);
  };

  const handleEndDate = (date) => {
    setEndDate(date);
  };

  const handleSave = () => {
    event.preventDefault();
    console.log(newItem);
    handleClose();
  };

  const onDrop = React.useCallback((acceptedFiles) => {
    acceptedFiles.map((file) => {
      const reader = new FileReader();

      reader.onload = function (e) {
        setImages((prevState) => [...prevState, { id: cuid(), src: e.target.result }]);
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
          <TextField id="name" label="Name" variant="outlined" margin="normal" value={newItem.name} onChange={handleChange} />
          <TextareaAutosize
            id="description"
            minRows={4}
            placeholder="Description"
            style={{ width: 200 }}
            margin="normal"
            value={newItem.description}
            onChange={handleChange}
          />
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DesktopDatePicker
              id="start_date"
              label="Start Date"
              inputFormat="MM/DD/YYYY"
              margin="normal"
              value={newItem.start_date}
              onChange={handleChange}
              renderInput={(params) => <TextField {...params} />}
            />
            <DesktopDatePicker
              id="end_date"
              label="End Date"
              inputFormat="MM/DD/YYYY"
              margin="normal"
              value={newItem.end_date}
              onChange={handleChange}
              renderInput={(params) => <TextField {...params} />}
            />
          </LocalizationProvider>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSave}>Save</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
