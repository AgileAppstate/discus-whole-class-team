import React, { Component } from 'react';
//import axios from 'axios';
import tempMedia from './tempMedia'

class MediaList extends Component {
  
  state = {
    media: []
  }

  componentDidMount() {
    // Implement after we have the MangoDB API endpoint
    // axios.get('./tempMedia.json')
    //   .then(res => {
    //     const media = res.data;
    //     this.setState({ media });
    //   })
    // Dummy data
    console.log(tempMedia);
    const media = tempMedia;
    this.setState({ media })
  }

  render() {
    return (
      <ul>
        {
          this.state.media
            .map(media =>
              <li key={media.id}>Name: {media.name} <br/> Start Date: {media.start_date} <br/> End Date: {media.end_date} <br/><br/></li>
            )
        }
      </ul>
    )
  }
}

export default MediaList;