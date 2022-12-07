import React, { Component } from 'react';
//import axios from 'axios';
import tempPlaylists from './tempPlaylists';
import { DataGrid } from '@mui/x-data-grid';
import IconButton from '@mui/material/IconButton';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import ItemDialog from '../dialogs/PlaylistItemsDialog'
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
dayjs.extend(duration);

class PlaylistList extends Component {
  state = {
    playlists: [],
    columns: [],
    selectionModel: [],
    openItems: false,
  };

  /**
   * Loads the playlist locally
   */
  loadPlaylists = () => {
    // Implement after we have the MangoDB API endpoint
    // axios.get('./tempPlaylist.json')
    //   .then(res => {
    //     const playlist = res.data;
    //     this.setState({ playlist });
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
     * Handles double-clicking a cell so we can popup the media dialog for the items list
     * @param {*} params 
     */
    handleDoubleClick = (params) => {
      if (params.field === "items")
      {
        console.log(params)
      }
    };

  /**
   * Handles deleting any selected items
   */
  deleteSelectedFile = () => {
    const playlists = this.state.playlists.filter((item) => {
      // Removes the playlist from the local list
      return !this.state.selectionModel.includes(item.id);
      // Will need to send the ID to the API to delete
      //console.log(item.id);
    });
    this.setState({ playlists });
  };

  componentDidMount() {
    this.loadPlaylists();
    
    // Sets the columns for the DataGrid
    const columns = [
      { field: 'name', headerName: 'Name', width: 200, editable: true },
      { field: 'items', headerName: 'Items', width: 250, renderCell: () => <ItemDialog /> },
      { field: 'shuffle', headerName: 'Shuffle', type: 'boolean', width: 200, editable: true},
      { field: 'date_created', headerName: 'Date Created', width: 200, valueFormatter: (params) =>
      dayjs(params?.value).format("MM/DD/YYYY")
    },
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
          onSelectionModelChange={(selectionModel) => {
            this.setState({ selectionModel });
          }}
          selectionModel={this.state.selectionModel}
          onCellDoubleClick={this.handleDoubleClick}
        />
      </div>
    );
  }
}

export default PlaylistList;
