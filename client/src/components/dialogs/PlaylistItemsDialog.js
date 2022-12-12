import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import { DataGrid } from '@mui/x-data-grid';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Slide from '@mui/material/Slide';
import dayjs from 'dayjs';
//import tempMedia from '../mediaList/tempMedia';
import { List } from '@mui/material';
import axios from 'axios';
import { Container, Draggable } from 'react-smooth-dnd';
import {arrayMoveImmutable} from 'array-move';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemSecondaryAction from '@mui/material/ListItemSecondaryAction';
import DragHandleIcon from '@mui/icons-material/DragHandle';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function PlaylistItemsDialog(props) {
  const [parentPlaylist] = React.useState(props.parentPlaylist);
  const [open, setOpen] = React.useState(false);
  const [selectionModel, setSelectionModel] = React.useState(parentPlaylist.items.map((item) => item.id));
  const [selectedMedia, setSelectedMedia] = React.useState([])
  const [media, setMedia] = React.useState([]);
  const columns = [{
    field: 'image',
    headerName: 'Thumbnail',
    width: 300,
    renderCell: (params) => (
      <img style={{ height: '100%', width: '50%', objectFit: 'contain'}} className="my-2 mx-16" src={params.value} />
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
    valueFormatter: (params) =>
    dayjs(params?.value).format("MM/DD/YYYY")
  },
  {
    field: 'end_date',
    headerName: 'End Date',
    width: 180,
    valueFormatter: (params) =>
    dayjs(params?.value).format("MM/DD/YYYY")
  }
]

  const loadMedia = () => {
    try {
      axios.get('http://localhost:8000/get_collection_images').then((res) => {
        const raw = res.data;
        const media = [];
        raw.forEach(async (item) => {
          const item_json = {
            id: item._id.$oid,
            name: item.display_name,
            description: item.description,
            duration: item.duration,
            date_added: item.date_added.$date,
            start_date: item.start_date.$date,
            end_date: item.end_date.$data,
            image_id: item.file_id.$oid,
            filename: item.filename
          };
          media.push(item_json);
        });
        media.forEach(async (item) => {
          const res = await axios.post('http://localhost:8000/api/get_image_file', [{'id': item.id}], {
            headers: {
              'content-type': '*/json'
            }
          });
          // Adds the encoded image to the media
          item['image'] = "data:image/png;base64," + res.data.img_dat[0];
        });
        setMedia({ media });
      });
    } catch (error) {
      this.handleSubmitError(error);
      if (error.response) {
        console.log(error.response.status);
      } else {
        console.log(error.message);
      }
      return []
    }
  };

  const handleClickOpen = () => {
    loadMedia();
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSave = () => {
    event.preventDefault();
    console.log(selectionModel);
    // TODO: Update media with new list
    // TODO: Update selected media with new IDs
    handleClose();
  };

    const onDrop = ({ removedIndex, addedIndex }) => {
      console.log({ removedIndex, addedIndex });
      setSelectedMedia(selectedMedia => arrayMoveImmutable(selectedMedia, removedIndex, addedIndex));
    };
  
  return (
    <div>
      <Button variant="outlined" onClick={handleClickOpen} color="primary">
        Open Items
      </Button>
      <Dialog open={open} onClose={handleClose} TransitionComponent={Transition} maxWidth={'lg'} fullWidth={true}>
        <DialogTitle>All Media</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Select any media that you want to be in the playlist.
          </DialogContentText>
          <DataGrid
              autoHeight {...media}
              rows={media}
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
        <DialogTitle>Current Media</DialogTitle>
          <DialogContentText>
            Drag and drop to reorder the media in the playlist.
          </DialogContentText>
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
        </DialogActions>
        </Dialog>
    </div>
  );
            }
