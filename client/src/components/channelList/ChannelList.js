import React, { Component } from 'react';
import axios from 'axios';
//import tempMedia from './tempChannel';
import { DataGrid } from '@mui/x-data-grid';
import IconButton from '@mui/material/IconButton';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import TextField from '@mui/material/TextField';
import dayjs from 'dayjs';
import ChannelButton from '../buttons/CreateChannel';
import CloseIcon from '@mui/icons-material/Close';
import { Alert, AlertTitle, Collapse } from '@mui/material';

import styled from '@emotion/styled';

class ChannelList extends Component {
  state = {
    channels: [],
    columns: [],
    selectionModel: [],
    loading: true,
    alert: false,
    alertSeverity: 'error',
    alertTitle: 'Error',
    alertMessage: 'An error has occurred. Please try again.'
  };

  CssTextField = styled(TextField)({
    '& .MuiOutlinedInput-root': {
      '& fieldset': {
        borderColor: 'white'
      },
      '&:hover fieldset': {
        borderColor: 'white'
      },
      '&.Mui-focused fieldset': {
        borderColor: 'white'
      }
    }
  });

  /**
   * Loads the media locally
   */
  loadChannels = () => {
    // Implement after we have the MangoDB API endpoint
    axios.get('http://152.10.212.58:8000/get_collection_channels')
    .then(res => {
      const raw = res.data;
      const channels = [];
      raw.forEach((item) => {
        const item_json = {
          id: item._id.$oid,
          name: item.name,
          playlist_id: item.playlist ? item.playlist.$oid : "",
          mode: item.mode,
          date_created: item.date_created.$date,
          start_date: item.start_date.$date,
          end_date: item.end_date ? item.end_date.$date : "",
          recurring_info: item.recurring_info,
          time_occurances: item.time_occurances,
        };
        channels.push(item_json);
      });
      channels.forEach(async (item) => {
        const body = { 'id': item.playlist_id };
        const res = await axios.post(
          'http://152.10.212.58:8000/api/get_playlist_name',
          body,
          {
            headers: {
              'content-type': '*/json'
            }
          }
        );
        // Grabs the playlist name
        item['playlist'] = res.data.data;
      });
      console.log(channels);
      this.setState({ channels });
    });
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
   * Handles sending off an edited entry to the API
   * @param {*} params
   */
  handleEditCommit = (params) => {
    console.log(params);
    var { id, field, value } = params;
    // Converts date to JS date if necessary
    if (dayjs.isDayjs(value)) {
      value = value.toDate();
    }
    const body = { id, [field]: value };
    
    try {
      axios.post('http://152.10.212.58:8000/api/edit_channel', body, {
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
   * Adds added media to the local media array
   * @param {*} params
   */
   handleChannelChange = (items) => {
    this.handleSetAlertSuccess();
    this.setState({ alert: true });
    const channels = this.state.channels.concat(items);
    this.setState({ channels });
  };

  /**
   * Handles deleting any selected items
   */
  deleteSelectedFile = () => {
    const channels = this.state.channels.filter((item) => {
      // Removes the channel from the local list
      return !this.state.selectionModel.includes(item.id);
    });
    const body = { ids: this.state.selectionModel };
    //console.log(body);
    try {
      axios.post('http://152.10.212.58:8000/api/delete_channel', body, {
        headers: {
          'content-type': '*/json'
        }
      });
      this.setState({ channels });
    } catch (error) {
      this.handleSubmitError(error);
      if (error.response) {
        console.log(error.response.status);
      } else {
        console.log(error.message);
      }
    }
  };

  componentDidMount() {
    this.loadChannels();
    // Generates the columns for the list
    const columns = [
      { field: 'name', headerName: 'Name', width: 250, editable: true },
      {
        field: 'start_date',
        headerName: 'Start Date',
        width: 180,
        editable: false,
        renderCell: (params) => (
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DesktopDatePicker
              id={params.field}
              inputFormat="MM/DD/YYYY"
              value={dayjs(params?.value)}
              onChange={(newDate) => {
                // Grabs the previous needed fields from the params
                const { id, api, field, row } = params;
                // If the user sets the date to something after the end date, it will use the end date
                if (newDate > dayjs(row.end_date) && row.end_date != '') {
                  newDate = dayjs(row.end_date);
                }
                // Sets the edit value to the new selected date
                params.api.setEditCellValue({ id, api, field, value: newDate });
              }}
              renderInput={(params) => (
                <this.CssTextField sx={{ m: -1.4, width: '25ch' }} {...params} />
              )}
            />
          </LocalizationProvider>
        ) // renderCell will render the component
      },
      {
        field: 'end_date',
        headerName: 'End Date',
        width: 180,
        editable: false,
        renderCell: (params) => (
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DesktopDatePicker
              id={params.field}
              inputFormat="MM/DD/YYYY"
              value={dayjs(params?.value)}
              onChange={(newDate) => {
                // Grabs the previous needed fields from the params
                const { id, api, field, row } = params;
                // If user tries to set the end date to before the start date, it will use the start
                if (dayjs(row.start_date) > newDate) {
                  newDate = dayjs(row.start_date);
                }
                // Sets the edit value to the new selected date
                params.api.setEditCellValue({ id, api, field, value: newDate });
              }}
              renderInput={(params) => (
                <this.CssTextField sx={{ m: -1.4, width: '25ch' }} {...params} />
              )}
            />
          </LocalizationProvider>
        ) // renderCell will render the component
      },
      { field: 'date_created', headerName: 'Date Created', width: 180, editable: false, valueFormatter: (params) => dayjs(params?.value).format('MM/DD/YYYY')},
      { field: 'playlist', headerName: 'Playlist', width: 250, editable: false },
      { field: 'mode', headerName: 'Mode', width: 150, editable: false },
      { field: 'recurring_info', headerName: 'Recurring', width: 150, editable: false },
    ];
    this.setState({ columns });
  }

  render() {
    return (
      <div style={{ height: 600, width: '100%' }}>
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
          rows={this.state.channels}
          columns={this.state.columns}
          pageSize={5}
          rowsPerPageOptions={[5]}
          getRowHeight={() => 'auto'}
          checkboxSelection
          disableSelectionOnClick
          onCellEditCommit={this.handleEditCommit}
          onSelectionModelChange={(selectionModel) => {
            this.setState({ selectionModel });
          }}
          selectionModel={this.state.selectionModel}
        />
        <ChannelButton onChange={this.handleChannelChange} onError={this.handleSubmitError} />
      </div>
    );
  }
}

export default ChannelList;
