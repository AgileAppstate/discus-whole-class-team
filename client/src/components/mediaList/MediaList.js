import React, { Component } from 'react';
//import axios from 'axios';
import tempMedia from './tempMedia';
import { DataGrid } from '@mui/x-data-grid';



class MediaList extends Component {
  state = {
    media: [],
    columns:[]
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
      { field: 'id', headerName: 'ID', width: 70 },
      { field: 'name', headerName: 'Title', width: 130 },
      { field: 'start_date', headerName: 'Start Date', width: 130 },
      { field: 'end_date', headerName: 'End Date', width: 130 },
    ];
    this.setState({columns});
  }

  render() {
    return (
      // <ul>
      //   {this.state.media.map((media) => (
      //     <li key={media.id}>
      //       Name: {media.name} <br /> Start Date: {media.start_date} <br /> End Date:{' '}
      //       {media.end_date} <br />
      //       <br />
      //     </li>
      //   ))}
      // </ul>
      <div style={{ height: 400, width: '100%' }}>
        <DataGrid
        rows={this.state.media}
        columns={this.state.columns}
        pageSize={5}
        rowsPerPageOptions={[5]}
        checkboxSelection
        />
      </div>
    );
  }
}

export default MediaList;
