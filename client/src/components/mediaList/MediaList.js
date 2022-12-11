import React, { Component } from 'react';
import axios from 'axios';
//import tempMedia from './tempMedia';
import { DataGrid } from '@mui/x-data-grid';
import IconButton from '@mui/material/IconButton';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import CloseIcon from '@mui/icons-material/Close';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import TextField from '@mui/material/TextField';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import styled from '@emotion/styled';
import MediaButton from '../buttons/AddMedia';
import PropTypes from 'prop-types';
import { Alert, AlertTitle, Collapse } from '@mui/material';

dayjs.extend(duration);

class MediaList extends Component {
  state = {
    media: [],
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
  loadMedia = () => {
    try {
      axios.get('http://152.10.212.58:8000/get_collection_images').then((res) => {
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
          const res = await axios.post('http://152.10.212.58:8000/api/get_image_file', [{'id': item.id}], {
            headers: {
              'content-type': '*/json'
            }
          });
          // Adds the encoded image to the media
          item['image'] = "data:image/png;base64," + res.data.img_dat[0];
        });
        //console.log(media);
        this.setState({ media });
        const loading = false;
        this.setState({ loading });
      });
    } catch (error) {
      this.handleSubmitError(error);
      if (error.response) {
        console.log(error.response.status);
      } else {
        console.log(error.message);
      }
    }
    // Dummy data
    // console.log(tempMedia);
    // const media = tempMedia;
    // this.setState({ media });
  };

  /**
   * Handles sending off an edited entry to the API
   * @param {*} params
   */
  handleEditCommit = async (params) => {
    var { id, field, value } = params;
    // Converts date to JS date if necessary
    if (dayjs.isDayjs(value)) {
      value = value.toDate();
    }
    // Will need to be replaced with sending an UPDATE to the API
    const body = { id, [field]: value };
    //console.log(body);
    try {
      axios.post('http://152.10.212.58:8000/api/edit_image', body, {
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
    //console.log({ id, [field]: value });
  };

  /**
   * Adds added media to the local media array
   * @param {*} params
   */
  handleImageChange = (items) => {
    this.handleSetAlertSuccess();
    this.setState({ alert: true });
    const media = this.state.media.concat(items);
    this.setState({ media });
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
    const alertTitle = "Error: " + (error.code ? error.code : "GENERIC_ERROR");
    const alertMessage = error.message ? error.message : 'An error has occurred. Please try again later.';
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
    const media = this.state.media.filter((item) => {
      // Removes the media from the local list
      return !this.state.selectionModel.includes(item.id);
      //console.log(item.id);
    });
    const body = {'ids': this.state.selectionModel};
    //console.log(body);
    try {
      axios.post('http://152.10.212.58:8000/api/delete_image', body, {
        headers: {
          'content-type': '*/json'
        }
      });
      this.setState({ media });
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
    this.loadMedia();
    // Generates the columns for the list
    const columns = [
      {
        field: 'image',
        headerName: 'Thumbnail',
        width: 300,
        renderCell: (params) => (
          <img
            style={{ height: '100%', width: '50%', objectFit: 'contain' }}
            className="my-2 mx-16"
            src={params.value}
          />
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
      { field: 'description', headerName: 'Description', width: 380, editable: true },
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
          rows={this.state.media}
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
          loading={this.state.loading}
        />
        <MediaButton onChange={this.handleImageChange} onError={this.handleSubmitError} />
      </div>
    );
  }
}

MediaList.propTypes = {
  children: PropTypes.any,
  onError: PropTypes.func,
};

export default MediaList;
