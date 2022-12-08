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
import tempMedia from '../mediaList/tempMedia';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function PlaylistItemsDialog() {
  const [open, setOpen] = React.useState(false);
  const [selectionModel, setSelectionModel] = React.useState("");
  const media = tempMedia;
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

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSave = () => {
    event.preventDefault();
    console.log(selectionModel);
    handleClose();
  };

  return (
    <div>
      <Button variant="outlined" onClick={handleClickOpen} color="primary">
        Open Items
      </Button>
      <Dialog open={open} onClose={handleClose} TransitionComponent={Transition}
        PaperProps={{ sx: { width: "100%", height: "100%" } }}>
        <DialogTitle>Current Media</DialogTitle>
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
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSave}>Save</Button>
        </DialogActions>
        </Dialog>
    </div>
  );
}
