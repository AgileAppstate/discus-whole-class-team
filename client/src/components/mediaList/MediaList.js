import React, { Component } from 'react';
//import axios from 'axios';
import tempMedia from './tempMedia';
import { DataGrid } from '@mui/x-data-grid';
import IconButton from '@mui/material/IconButton';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import TextField from '@mui/material/TextField';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
dayjs.extend(duration);

class MediaList extends Component {
  state = {
    media: [],
    columns: [],
    selectionModel: []
  };

  /**
   * Loads the media locally
   */
  loadMedia = () => {
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
  }

  /**
   * Handles sending off an edited entry to the API
   * @param {*} params 
   */
  handleEditCommit = (params) => {
    console.log(params)
    var { id, field, value } = params;
    // Converts date to JS date if necessary
    if (dayjs.isDayjs(value)) {
      value = value.toDate()
    }
    // Will need to be replaced with sending an UPDATE to the API
    console.log( {id, [field]: value} )
  }

  /**
   * Handles deleting any selected items
   */
  deleteSelectedFile = () => {
    const media = this.state.media.filter((item) => {
      // Removes the media from the local list
      !this.state.selectionModel.includes(item.id);
      // Will need to send the ID to the API to delete
      console.log(item.id)
    });
    this.setState({ media });
  };

  componentDidMount() {

    this.loadMedia();
    // Generates the columns for the list
    const columns = [
      {
        field: 'image',
        headerName: 'Thumbnail',
        width: 300,
        renderCell: (params) => (
          <img style={{ height: 300, width: '50%' }} className="mt-7" src={params.value} />
        ) // renderCell will render the component
      },
      {
        field: 'duration',
        headerName: 'Duration',
        width: 80,
        editable: true,
        valueFormatter: (params) =>
          params?.value < 60
            ? dayjs.duration({ seconds: params?.value }).asSeconds() + ' secs'
            : dayjs.duration({ seconds: params?.value }).asMinutes() + ' mins'
      },
      { field: 'name', headerName: 'Name', width: 250, editable: true },
      { field: 'description', headerName: 'Description', width: 400, editable: true },
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
              renderInput={(params) => <TextField sx={{ m: -1.4, width: '25ch' }} {...params} />}
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
              renderInput={(params) => <TextField sx={{ m: -1.4, width: '25ch' }} {...params} />}
            />
            </LocalizationProvider>
        ) // renderCell will render the component
      },
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
          rows={this.state.media}
          columns={this.state.columns}
          pageSize={5}
          rowsPerPageOptions={[5]}
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

export default MediaList;
