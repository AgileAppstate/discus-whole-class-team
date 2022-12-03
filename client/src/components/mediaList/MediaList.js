import React, { Component } from 'react';
//import axios from 'axios';
import tempMedia from './tempMedia';
import { DataGrid } from '@mui/x-data-grid';
//import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';

class MediaList extends Component {
  state = {
    media: [],
    columns: [],
    selectionModel: [],
  };

  componentDidMount() {
    // Implement after we have the MangoDB API endpoint
    // axios.get('./tempMedia.json')
    //   .then(res => {
    //     const media = res.data;
    //     this.setState({ media });
    //   })
    // Dummy data
    //console.log(tempMedia);
    const media = tempMedia;
    this.setState({ media });
    const columns = [
      {
        field: 'image',
        headerName: 'Thumbnail',
        width: 300,
        editable: true,
        renderCell: (params) => <img style={{ height: 300, width: '50%' }} className="mt-7" src={params.value} />, // renderCell will render the component
      },
      { field: 'duration', headerName: 'Duration', width: 70 },
      { field: 'name', headerName: 'Name', width: 250 },
      { field: 'description', headerName: 'Description', width: 500 },
      { field: 'start_date', headerName: 'Start Date', width: 130 },
      { field: 'end_date', headerName: 'End Date', width: 130 }
    ];
    this.setState({ columns });
  }

  deleteSelectedFile = () => {
    const media = this.state.media.filter(
      (item) => !this.state.selectionModel.includes(item.id) 
    );
    this.setState({ media });
  };

  render() {
    return (
      <div style={{ height: 600, width: '100%' }}>
        <IconButton variant="contained" onClick={this.deleteSelectedFile} color="primary">
        <DeleteOutlinedIcon></DeleteOutlinedIcon>
        </IconButton>
        <DataGrid
          rows={this.state.media}
          columns={this.state.columns}
          pageSize={5}
          rowsPerPageOptions={[5]}
          checkboxSelection
          disableSelectionOnClick
          onSelectionModelChange={(selectionModel) => {
            this.setState({ selectionModel });
          }}
          selectionModel={this.state.selectionModel}
        />
      </div>
    );
  }
}

export default MediaList;
