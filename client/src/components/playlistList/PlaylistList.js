import React, { Component } from 'react';
import axios from 'axios';
//import tempPlaylists from './tempPlaylists';
import { DataGrid } from '@mui/x-data-grid';
import IconButton from '@mui/material/IconButton';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import CloseIcon from '@mui/icons-material/Close';
import ItemsDialog from '../dialogs/PlaylistItemsDialog';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import { Alert, AlertTitle, Collapse } from '@mui/material';
import PlaylistButton from '../buttons/CreatePlaylist';
dayjs.extend(duration);

class PlaylistList extends Component {
  state = {
    playlists: [],
    columns: [],
    selectionModel: [],
    openItems: false,
    loading: true,
    alert: false,
    alertSeverity: 'error',
    alertTitle: 'Error',
    alertMessage: 'An error has occurred. Please try again.'
  };

  /**
   * Loads the playlist locally
   */
  loadPlaylists = () => {
    // Implement after we have the MangoDB API endpoint
    axios.get('http://152.10.212.58:8000/get_collection_playlists').then((res) => {
      const raw = res.data;
      const playlists = [];
      raw.forEach((item) => {
        const item_json = {
          id: item._id.$oid,
          name: item.name,
          items: item.items.map((i) => (i?.objectID ? { id: i.objectID.$oid, type: i.type } : '')),
          shuffle: item.shuffle,
          date_created: item.date_created.$date
        };
        playlists.push(item_json);
      });
      //console.log(playlists);
      this.setState({ playlists });
      const loading = false;
      this.setState({ loading });
    });
    // Dummy data
    // console.log(tempPlaylists);
    // const playlists = tempPlaylists;
    // this.setState({ playlists });
  };

  /**
   * Handles sending off an edited entry to the API
   * @param {*} params
   */
  handleEditCommit = (params) => {
    console.log(params);
    var { id, field, value } = params;

    const body = { id, [field]: value };

    try {
      axios.post('http://152.10.212.58:8000/api/edit_playlist', body, {
        headers: {
          'content-type': '*/json'
        }
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

  /**
   * Changes the selection of items on the playlist locally.
   * 
   * @param {*} params 
   */
  handleItemChange = (params) => {
    const playlists = this.state.playlists.filter((playlist) => playlist.id !== params.id);
    playlists.push(params)
    this.setState({ playlists });
  }

  /**
   * Handles double-clicking a cell so we can popup the media dialog for the items list
   * @param {*} params
   */
  handleDoubleClick = (params) => {
    if (params.field === 'items') {
      console.log(params);
    }
  };

  /**
   * Adds added media to the local media array
   * @param {*} params
   */
  handlePlaylistChange = (items) => {
    this.handleSetAlertSuccess();
    this.setState({ alert: true });
    const playlists = this.state.playlists.concat(items);
    this.setState({ playlists });
  };

  /**
   * Handles changing the alert variable
   * @param {*} alert
   */
  handleAlert = (alert) => {
    this.setState({ alert });
  };

  /**
   * Sets alert information to be an error
   */
  handleSetAlertError = (error) => {
    const alertSeverity = 'error';
    const alertTitle = 'Error: ' + (error.code ? error.code : 'GENERIC_ERROR');
    const alertMessage = error.message
      ? error.message
      : 'An error has occurred. Please try again later.';
    this.setState({ alertSeverity, alertTitle, alertMessage });
  };

  /**
   * Sets alert information to be a success
   */
  handleSetAlertSuccess = () => {
    const alertSeverity = 'success';
    const alertTitle = 'Success';
    const alertMessage = 'Item has been submitted!';
    this.setState({ alertSeverity, alertTitle, alertMessage });
  };

  /**
   * Causes error to popup on page
   * @param {*} error
   */
  handleSubmitError = (error) => {
    this.handleSetAlertError(error);
    console.log(error);
    this.setState({ alert: true });
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
    const body = { ids: this.state.selectionModel };
    //console.log(body);
    try {
      axios.post('http://152.10.212.58:8000/api/delete_playlist', body, {
        headers: {
          'content-type': '*/json'
        }
      });
      this.setState({ playlists });
    } catch (error) {
      this.handleSubmitError(error);
      if (error.response) {
        console.log(error.response.status);
      } else {
        console.log(error.message);
      }
    }
    this.setState({ playlists });
  };

  componentDidMount() {
    this.loadPlaylists();

    // Sets the columns for the DataGrid
    const columns = [
      { field: 'name', headerName: 'Name', width: 250, editable: true },
      {
        field: 'items',
        headerName: 'Items',
        width: 250,
        renderCell: (params) => <ItemsDialog parentPlaylist={params.row} onItemsChange={this.handleItemChange} onError={this.handleSubmitError}/>
      },
      { field: 'shuffle', headerName: 'Shuffle', type: 'boolean', width: 200, editable: true },
      {
        field: 'date_created',
        headerName: 'Date Created',
        width: 200,
        valueFormatter: (params) => dayjs(params?.value).format('MM/DD/YYYY')
      }
    ];

    this.setState({ columns });
  }

  render() {
    return (
      <div style={{ height: 400, width: '100%' }}>
        <Collapse
          in={this.state.alert}
          style={{
            transitionDelay: this.state.alert ? '800ms' : '0ms'
          }}
          unmountOnExit
        >
          <Alert
            severity={this.state.alertSeverity}
            action={
              <IconButton
                aria-label="close"
                color="inherit"
                size="small"
                onClick={() => {
                  this.handleAlert(false);
                }}
              >
                <CloseIcon fontSize="inherit"></CloseIcon>
              </IconButton>
            }
          >
            <AlertTitle>{this.state.alertTitle}</AlertTitle>
            {this.state.alertMessage}
          </Alert>
        </Collapse>
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
          loading={this.state.loading}
        />
        <PlaylistButton onChange={this.handlePlaylistChange} onError={this.handleSubmitError} />
      </div>
    );
  }
}

export default PlaylistList;
