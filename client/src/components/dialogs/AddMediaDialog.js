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
  const [end_date, setEnd_Date] = React.useState(dayjs());
  const [images, setImages] = React.useState([]);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    handleStartChange();
    handleEndChange();
  };

  const handleStartChange = (newDate) => {
    setStart_Date(newDate);
  };

  const handleEndChange = (newDate) => {
    setEnd_Date(newDate);
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
          <TextField 
            id="name" 
            label="Name" 
            variant="outlined" 
            margin="normal"
            required
            fullWidth
            float
            />
          <br/>
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
              disabled={start_date === "" ? true: false}
              onChange={handleEndChange}
              renderInput={(params) => <TextField {...params} />}
              disablePast
            />
          </LocalizationProvider>
          <br/>
          <TextField
            id="description"  
            label="Description"
            minRows={4}
            variant='outlined'
            margin="normal"
            multiline
            fullWidth
            required
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleClose}>Save</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
