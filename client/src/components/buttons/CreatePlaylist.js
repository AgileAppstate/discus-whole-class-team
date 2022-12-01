import React from 'react';
import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css';

class CreatePlaylist extends React.Component {
  render() {
    return (
      <Popup
        trigger={
          <button className="inline-flex text-white bg-black border-0 py-2 px-6 focus:outline-none hover:bg-slate-600 rounded text-lg">
            {' '}
            Create Playlist
          </button>
        }
        position="right center"
      >
        <div>Popup content here !!</div>
      </Popup>
    );
  }
}

export default CreatePlaylist;