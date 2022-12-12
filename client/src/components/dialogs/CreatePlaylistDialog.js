import * as React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { DataGrid } from '@mui/x-data-grid';
import { List } from '@mui/material';
import Slide from '@mui/material/Slide';
import dayjs from 'dayjs';
import Checkbox from '@mui/material/Checkbox';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import axios from 'axios';
import { CircularProgress, Fade } from '@mui/material';
//import tempMedia from '../mediaList/tempMedia';

import { Container, Draggable } from 'react-smooth-dnd';
import { arrayMoveImmutable } from 'array-move';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemSecondaryAction from '@mui/material/ListItemSecondaryAction';
import DragHandleIcon from '@mui/icons-material/DragHandle';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function FormDialog(props) {
  const [open, setOpen] = React.useState(false);
  const [name, setName] = React.useState('');
  const [shuffle, setShuffle] = React.useState(false);
  const [date_created, setDateCreated] = React.useState(dayjs());
  const [loading, setLoading] = React.useState(false);
  const [selectionModel, setSelectionModel] = React.useState([]);
  const [selectedMedia, setSelectedMedia] = React.useState([]);
  const [media, setMedia] = React.useState([]);
  const columns = [
    {
      field: 'image',
      headerName: 'Thumbnail',
      width: 300,
      renderCell: (params) => (
        <img
          style={{ height: '100%', width: '50%', objectFit: 'contain' }}
          className="my-2 mx-16"
          src={params.value}
        />
      ) // renderCell will render the component
    },
    {
      field: 'duration',
      headerName: 'Duration',
      width: 80,
      valueFormatter: (params) =>
        params?.value < 60
          ? dayjs.duration({ seconds: params?.value }).asSeconds() + ' secs'
          : dayjs.duration({ seconds: params?.value }).asMinutes() + ' mins'
    },
    { field: 'name', headerName: 'Name', width: 250 },
    { field: 'description', headerName: 'Description', width: 380 },
    {
      field: 'start_date',
      headerName: 'Start Date',
      width: 180,
      editable: false,
      valueFormatter: (params) => dayjs(params?.value).format('MM/DD/YYYY')
    },
    {
      field: 'end_date',
      headerName: 'End Date',
      width: 180,
      valueFormatter: (params) => dayjs(params?.value).format('MM/DD/YYYY')
    }
  ];

  const loadMedia = () => {
    try {
      axios.get('http://localhost:8000/get_collection_images').then((res) => {
        const raw = res.data;
        const m = [];
        raw.forEach(async (item) => {
          const item_json = {
            id: item._id.$oid,
            name: item.display_name,
            description: item.description,
            duration: item.duration,
            date_added: item.date_added.$date,
            start_date: item.start_date.$date,
            end_date: item.end_date.$date,
            image_id: item.file_id.$oid,
            filename: item.filename
          };
          m.push(item_json);
        });
        m.forEach(async (item) => {
          const res = await axios.post(
            'http://localhost:8000/api/get_image_file',
            [{ id: item.id }],
            {
              headers: {
                'content-type': '*/json'
              }
            }
          );
          // Adds the encoded image to the media
          item['image'] = 'data:image/png;base64,' + res.data.img_dat[0];
        });
        setMedia(m);
        // Sets the currently selected media
        setSelectedMedia(
          m.filter((item) => {
            return selectionModel.includes(item.id);
          })
        );
      });
    } catch (error) {
      this.handleSubmitError(error);
      if (error.response) {
        console.log(error.response.status);
      } else {
        console.log(error.message);
      }
    }
  };

  const handleClickOpen = () => {
    loadMedia();
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    // Sets values back to default
    setName('');
    setSelectionModel([]);
    setSelectedMedia([]);
    setShuffle(false);
    setDateCreated(dayjs());
  };

  // const handleItemsChange = (event) => {
  //   setItems(event.target.value);
  // };

  const handleShuffleChange = () => {
    setShuffle((oldShuffle) => !oldShuffle);
  };

  const handleNameChange = (event) => {
    setName(event.target.value);
  };

  const handleLoading = () => {
    setLoading((prevLoading) => !prevLoading);
  };

  const handleSave = async () => {
    event.preventDefault();
    handleLoading();

    const playlist = {
      ['name']: name,
      ['items']: selectionModel,
      ['shuffle']: shuffle,
      ['date_created']: date_created.toDate()
    };
    // For testing purposes
    console.log(playlist);
    try {
      const res = await axios.post('http://localhost:8000/api/insert_playlist', playlist, {
        headers: {
          'content-type': '*/json'
        }
      });

      const ids = [];
      // Terrible, terrible way to do this, but god do I not have time to fix it much further.
      // TODO: Get CLI team to return IDs better
      res.data.ids.split("'").forEach((val) => {
        if (val != '[ObjectId(' && val != ')' && val != '), ObjectId(' && val != ')]') {
          ids.push(val);
        }
      });

      // Adds each ID to its item
      for (let i = 0; i < playlist.length; i++) {
        playlist[i]['id'] = ids[i];
      }

      console.log(res);
      props.onChange(playlist);
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

  const onDrop = ({ removedIndex, addedIndex }) => {
    //console.log({ removedIndex, addedIndex });
    setSelectedMedia((selectedMedia) => {
      // Creates new array in the new order they should appear
      const newArray = arrayMoveImmutable(selectedMedia, removedIndex, addedIndex);
      // Reorders the ID's in the selection model
      setSelectionModel(newArray.map((item) => item.id));
      // Returns the new array to modify selectionMedia
      return newArray;
    });
  };

  return (
    <div>
      <Button variant="contained" onClick={handleClickOpen} color="primary">
        Create Playlist
      </Button>
      <Dialog
        open={open}
        onClose={handleClose}
        TransitionComponent={Transition}
        maxWidth={'lg'}
        fullWidth={true}
      >
        <DialogTitle>Create Playlist</DialogTitle>
        <DialogContent>
          <DialogContentText>Create a playlist!</DialogContentText>
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
            <FormControlLabel
              control={
                <Checkbox
                  label="Shuffle"
                  checked={shuffle}
                  onChange={handleShuffleChange}
                  color="default"
                />
              }
              label="Shuffle"
            />
          </FormGroup>
          <br />
          <DataGrid
            autoHeight
            {...media}
            rows={media}
            columns={columns}
            pageSize={5}
            rowsPerPageOptions={[5]}
            getRowHeight={() => 'auto'}
            checkboxSelection
            disableSelectionOnClick
            onSelectionModelChange={(selectionModel) => {
              setSelectionModel(selectionModel);
              setSelectedMedia(
                media.filter((item) => {
                  return selectionModel.includes(item.id);
                })
              );
            }}
            selectionModel={selectionModel}
          />
          <DialogTitle>Current Media</DialogTitle>
          <DialogContentText>Drag and drop to reorder the media in the playlist.</DialogContentText>
          <List>
            <Container dragHandleSelector=".drag-handle" lockAxis="y" onDrop={onDrop}>
              {selectedMedia.map(({ index, name }) => (
                <Draggable key={index}>
                  <ListItem>
                    <ListItemText primary={name} />
                    <ListItemSecondaryAction>
                      <ListItemIcon className="drag-handle">
                        <DragHandleIcon />
                      </ListItemIcon>
                    </ListItemSecondaryAction>
                  </ListItem>
                </Draggable>
              ))}
            </Container>
          </List>
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
