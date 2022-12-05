import React, { Component } from 'react';
//import axios from 'axios';
import tempPlaylists from './tempPlaylists';
import { DataGrid } from '@mui/x-data-grid';
import IconButton from '@mui/material/IconButton';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import TextField from '@mui/material/TextField';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import styled from '@emotion/styled';
dayjs.extend(duration);

class PlaylistList extends Component {
  state = {
    playlists: [],
    columns: [],
    selectionModel: []
  };

  /**
   * Loads the playlist locally
   */
  loadPlaylists = () => {
    // Implement after we have the MangoDB API endpoint
    // axios.get('./tempMedia.json')
    //   .then(res => {
    //     const media = res.data;
    //     this.setState({ media });
    //   })
    // Dummy data
    console.log(tempPlaylists);
    const playlists = tempPlaylists;
    this.setState({ playlists });
  };

  /**
   * Handles sending off an edited entry to the API
   * @param {*} params
   */
     handleEditCommit = (params) => {
      console.log(params);
      var { id, field, value } = params;

      // Will need to be replaced with sending an UPDATE to the API
      console.log({ id, [field]: value });
    };

  /**
   * Handles deleting any selected items
   */
  deleteSelectedFile = () => {
    const playlist = this.state.playlists.filter((item) => {
      // Removes the media from the local list
      !this.state.selectionModel.includes(item.id);
      // Will need to send the ID to the API to delete
      console.log(item.id);
    });
    this.setState({ playlist });
  };

  componentDidMount() {
    this.loadPlaylists();
    
    // Sets the columns for the DataGrid
    const columns = [
      { field: 'name', headerName: 'Name', width: 200 },
      { field: 'items', headerName: 'Items', width: 200 },
      { field: 'shuffle', headerName: 'Shuffle', type: 'boolean', width: 200, editable: true},
      { field: 'date_created', headerName: 'Date Created', width: 200 },
    ];

    this.setState({ columns });
  }

  render() {
    return (
      <div style={{ height: 400, width: '100%' }}>
        <IconButton variant="contained" onClick={this.deleteSelectedFile} color="primary">
          <DeleteOutlinedIcon></DeleteOutlinedIcon>
        </IconButton>
        <DataGrid
          rows={this.state.playlists}
          columns={this.state.columns}
          pageSize={5}
          checkboxSelection
          disableSelectionOnClick
          onCellEditCommit={this.handleEditCommit}
          onSelectionModelChange={(newSelection) => {
            this.setState({ selectionModel: newSelection.selectionModel });
          }}
          selectionModel={this.state.selectionModel}
        />
      </div>
    );
  }
}

export default PlaylistList;
