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

import styled from '@emotion/styled';

class ChannelList extends Component {
  state = {
    channels: [],
    columns: [],
    selectionModel: []
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
          playlist: item.playlist.$oid,
          mode: item.mode,
          date_created: item.date_created.$date,
          start_date: item.start_date.$date,
          end_date: item.end_date.$date,
          recurring_info: item.recurring_info,
          time_occurances: item.time_occurances,
        };
        channels.push(item_json);
      });
      console.log(channels);
      this.setState({ channels });
    });
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
      axios.post('http://localhost:8000/api/edit_channel', body, {
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
   * Handles deleting any selected items
   */
  deleteSelectedFile = () => {
    const channels = this.state.channels.filter((item) => {
      // Removes the channel from the local list
      !this.state.selectionModel.includes(item.id);
      // Will need to send the ID to the API to delete
      console.log(item.id);
    });
    const body = { ids: this.state.selectionModel };
    //console.log(body);
    try {
      axios.post('http://localhost:8000/api/delete_channel', body, {
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
      }
    ];
    this.setState({ columns });
  }

  render() {
    return (
      <div style={{ height: 600, width: '100%' }}>
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
      </div>
    );
  }
}

export default ChannelList;
