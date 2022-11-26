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

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function FormDialog() {
  const [open, setOpen] = React.useState(false);
  const [date, setDate] = React.useState(dayjs());

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    handleChange();
  };

  const handleChange = (newDate) => {
    setDate(newDate);
  };

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
          <Dropzone></Dropzone>
          <TextField id="name" label="Name" variant="outlined" margin="normal" />
          <TextareaAutosize
            id="description"
            minRows={4}
            placeholder="Description"
            style={{ width: 200 }}
            margin="normal"
          />
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DesktopDatePicker
              id="start_date"
              label="Start Date"
              inputFormat="MM/DD/YYYY"
              margin="normal"
              value={date}
              onChange={handleChange}
              renderInput={(params) => <TextField {...params} />}
            />
            <DesktopDatePicker
              id="end_date"
              label="End Date"
              inputFormat="MM/DD/YYYY"
              margin="normal"
              value={date}
              onChange={handleChange}
              renderInput={(params) => <TextField {...params} />}
            />
          </LocalizationProvider>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleClose}>Save</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
