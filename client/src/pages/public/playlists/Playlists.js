import React, { Component } from 'react';
import PlaylistList from '../../../components/playlistList/PlaylistList';
import PlaylistButton from '../../../components/buttons/CreatePlaylist';

class Playlists extends Component {
  render() {
    return (
      <div>
        <PlaylistList />
        <PlaylistButton />
      </div>
    );
  }
}

export default Playlists;
