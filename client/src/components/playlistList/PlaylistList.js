import React, { Component } from 'react';
//import axios from 'axios';
import tempPlaylists from './tempPlaylists';

class PlaylistList extends Component {
  state = {
    playlists: []
  };

  componentDidMount() {
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
  }

  render() {
    return (
      <ul>
        {this.state.playlists.map((playlist) => (
          <li key={playlist.id}>
            Name: {playlist.name} <br /> Start Date: {playlist.start_date} <br /> End Date:{' '}
            {playlist.end_date} <br />
            <br />
          </li>
        ))}
      </ul>
    );
  }
}

export default PlaylistList;
