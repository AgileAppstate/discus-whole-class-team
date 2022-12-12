import React from 'react';
import Dialog from '../dialogs/CreatePlaylistDialog';
import PropTypes from 'prop-types';
import 'reactjs-popup/dist/index.css';

class CreatePlaylist extends React.Component {
  handleItemAdd = (event) => {
    this.props.onChange(event);
  };

  handleError = (error) => {
    this.props.onError(error);
  };

  render() {
    return <Dialog onChange={this.handleItemAdd} onError={this.handleError}></Dialog>;
  }
}

CreatePlaylist.propTypes = {
  children: PropTypes.any,
  onChange: PropTypes.func,
  onError: PropTypes.func
};

export default CreatePlaylist;
