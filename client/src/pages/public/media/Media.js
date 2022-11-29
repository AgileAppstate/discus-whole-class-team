import React, { Component } from 'react';
import MediaList from '../../../components/mediaList/MediaList';
import MediaButton from '../../../components/buttons/AddMedia';

class Media extends Component {
  render() {
    return (
      <div>
        <MediaList />
        <MediaButton />
      </div>
    );
  }
}

export default Media;
