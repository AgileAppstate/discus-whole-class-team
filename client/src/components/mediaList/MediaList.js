import React, { Component } from 'react';
//import axios from 'axios';
import tempMedia from './tempMedia';
import { DataGrid } from '@mui/x-data-grid';
//import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import dayjs from 'dayjs';
import duration from "dayjs/plugin/duration";
dayjs.extend(duration)

class MediaList extends Component {
  state = {
    media: [],
    columns: [],
    selectionModel: [],
  };

  handleDateChange() {

  }

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
        renderCell: (params) => <img style={{ height: 300, width: '50%' }} className="mt-7" src={params.value} />, // renderCell will render the component
      },
      { field: 'duration', headerName: 'Duration', width: 80, editable: true, valueFormatter: params => 
      params?.value < 60 ? dayjs.duration({seconds: params?.value}).asSeconds() + " secs" : dayjs.duration({seconds: params?.value}).asMinutes() + " mins",
     },
      { field: 'name', headerName: 'Name', width: 250, editable: true,},
      { field: 'description', headerName: 'Description', width: 500, editable: true, },
      { field: 'start_date', headerName: 'Start Date', width: 130, editable: true, valueFormatter: params => 
      dayjs(params?.value).format("MM/DD/YYYY"),},
      { field: 'end_date', headerName: 'End Date', width: 130, editable: true, valueFormatter: params => 
      dayjs(params?.value).format("MM/DD/YYYY"),}
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
