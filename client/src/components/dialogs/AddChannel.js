import * as React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import { DataGrid } from '@mui/x-data-grid';
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Checkbox from "@mui/material/Checkbox";
import Select from '@mui/material/Select'
import Slide from '@mui/material/Slide';
import dayjs from 'dayjs';
import axios from 'axios';
import { CircularProgress, Fade, FormControl, InputLabel, MenuItem } from '@mui/material';
import cuid from 'cuid';
//import tempMedia from '../mediaList/tempMedia';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function FormDialog(props) {
  const [open, setOpen] = React.useState(false);
  const [name, setName] = React.useState('');
  //const [selectedPlaylist, setSelectedPlaylist] = React.useState("");
  const [mode, setMode] = React.useState("");
  const [recurring_info, setRecurringInfo] = React.useState([]);
  const [start_date, setStartDate] = React.useState(dayjs());
  const [end_date, setEndDate] = React.useState(dayjs());
  const [time_occurances, setTimeOccurances] = React.useState([]);
  const [date_created, setDateCreated] = React.useState(dayjs());
  const [loading, setLoading] = React.useState(false);
  const [selectionModel, setSelectionModel] = React.useState([]);
  const [playlists, setPlaylists] = React.useState([]);
  const options = [
    "Sun",
    "Mon",
    "Tue",
    "Wed",
    "Thu",
    "Fri",
    "Sat"
  ];
  const columns = [
    { field: 'name', headerName: 'Name', width: 250 },
    {
      field: 'items',
      headerName: 'Items',
      width: 250,
      renderCell: (params) => params.row.items.length + " Items"
    },
    { field: 'shuffle', headerName: 'Shuffle', type: 'boolean', width: 200 },
    {
      field: 'date_created',
      headerName: 'Date Created',
      width: 200,
      valueFormatter: (params) => dayjs(params?.value).format('MM/DD/YYYY')
    }
  ];

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

  const handleLoading = () => {
    setLoading((prevLoading) => !prevLoading);
  };

  const handleModeChange = (event) => {
    setMode(event.target.value);
  };

  const loadPlaylists = () => {
    try {
      axios.get('http://localhost:8000/get_collection_playlists').then((res) => {
        const raw = res.data;
        const m = [];
        raw.forEach(async (item) => {
          const item_json = {
            id: item._id.$oid,
            name: item.name,
            items: item.items.map((i) => (i?.objectID ? { id: i.objectID.$oid, type: i.type } : '')),
            shuffle: item.shuffle,
            date_created: item.date_created.$date
          };
          m.push(item_json);
        });
        setPlaylists(m);
      });
    } catch (error) {
      props.onError(error);
      if (error.response) {
        console.log(error.response.status);
      } else {
        console.log(error.message);
      }
    }
  };

  const handleClickOpen = () => {
    loadPlaylists();
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    // Sets values back to default
    setName('');
    setDateCreated(dayjs());
    setEndDate(dayjs());
    setTimeOccurances([]);
    setStartDate(dayjs());
    setRecurringInfo([]);
    setPlaylists([]);
    setSelectionModel([]);
    setMode("");
    //setSelectedPlaylist("");
    setDateCreated(dayjs());
  };

  const handleNameChange = (event) => {
    setName(event.target.value);
  };

  const handleRecurringChange = (event) => {
    const value = event.target.value;
    if (value[value.length - 1] === "all") {
      setRecurringInfo(recurring_info.length === options.length ? [] : options);
      return;
    }
    setRecurringInfo(value);
  };

  const handleSave = async () => {
    event.preventDefault();
    handleLoading();

    const channel = {
      ['name']: name,
      ['playlist']: selectionModel[0],
      ['mode']: mode,
      ['date_created']: date_created.toDate(),
      ['start_date']: start_date.toDate(),
      ['end_date']: end_date.toDate(),
      ['recurring_info']: recurring_info,
      ['time_occurances']: time_occurances,
    };
    // For testing purposes
    console.log(channel);
    try {
      const res = await axios.post('http://localhost:8000/api/insert_channel', channel, {
        headers: {
          'content-type': '*/json'
        }
      });

      channel['id'] = cuid();
      //const ids = [];
      // // Terrible, terrible way to do this, but god do I not have time to fix it much further.
      // // TODO: Get CLI team to return IDs better
      // res.data.ids.split("'").forEach((val) => {
      //   if (val != '[ObjectId(' && val != ')' && val != '), ObjectId(' && val != ')]') {
      //     ids.push(val);
      //   }
      // });

      // // Adds each ID to its item
      // for (let i = 0; i < channel.length; i++) {
      //   channel['id'] = ids[i];
      // }

      console.log(res);
      props.onChange(channel);
    } catch (error) {
      props.onError(error);
      if (error.response) {
        console.log(error.reponse.status);
      } else {
        console.log(error.message);
      }
    }
    handleLoading();
    handleClose();
  };

  return (
    <div>
      <Button variant="contained" onClick={handleClickOpen} color="primary">
        Create Channel
      </Button>
      <Dialog
        open={open}
        onClose={handleClose}
        TransitionComponent={Transition}
        maxWidth={'lg'}
        fullWidth={true}
      >
        <DialogTitle>Create Channel</DialogTitle>
        <DialogContent>
          <DialogContentText>Customize playlist display parameters. </DialogContentText>
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
              //disabled={checked}
            />
          </LocalizationProvider>
          {/* <br /> */}
          <FormControl float sx={{ marginLeft: 1, marginRight: 1, marginBottom: 1, minWidth: 250 }}>
          <InputLabel id="mode-label">Mode</InputLabel>
          <Select labelId="mode" id="mode" value={mode} label="Mode" onChange={handleModeChange}>
          <MenuItem value={"Daily"}>Daily</MenuItem>
            <MenuItem value={"Weekly"}>Weekly</MenuItem>
            <MenuItem value={"Monthly"}>Monthly</MenuItem>
          </Select>
          </FormControl>
          <FormControl float sx={{ marginLeft: 0, marginRight: 1, marginBottom: 1, minWidth: 250 }}>
          <InputLabel id="recurring-info-label">Recurring Info</InputLabel>
          <Select labelId="recurring" id="recurring" multiple value={recurring_info} label="Recurring Info" onChange={handleRecurringChange} renderValue={(selected) => selected.join(", ")}>
        {options.map((option) => (
          <MenuItem key={option} value={option}>
            <ListItemIcon>
              <Checkbox checked={recurring_info.indexOf(option) > -1} />
            </ListItemIcon>
            <ListItemText primary={option} />
          </MenuItem>
        ))}
          </Select>
          </FormControl>
          <DataGrid
            autoHeight
            {...playlists}
            rows={playlists}
            columns={columns}
            pageSize={5}
            rowsPerPageOptions={[5]}
            getRowHeight={() => 'auto'}
            checkboxSelection
            disableSelectionOnClick
            onSelectionModelChange={(selectionModel) => {
              setSelectionModel(selectionModel);
            }}
            selectionModel={selectionModel}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSave}>Save</Button>
          <Fade
            in={loading}
            style={{
              transitionDelay: loading ? '800ms' : '0ms'
            }}
            unmountOnExit
          >
            <CircularProgress color="primary" />
          </Fade>
        </DialogActions>
      </Dialog>
    </div>
  );
}
