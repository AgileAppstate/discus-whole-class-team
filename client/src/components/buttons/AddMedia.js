import React from 'react';
import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css';

class AddMedia extends React.Component {
  render() {
    return (
      <Popup trigger={<button> Add Media</button>} position="right center">
        <div>Popup content here !!</div>
      </Popup>
    );
  }
}

export default AddMedia;
