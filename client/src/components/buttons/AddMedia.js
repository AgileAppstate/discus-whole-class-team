import React from 'react';
import Dialog from '../dialogs/AddMediaDialog';
import PropTypes from 'prop-types';
import 'reactjs-popup/dist/index.css';

class AddMedia extends React.Component {

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

AddMedia.propTypes = {
  children: PropTypes.any,
  onChange: PropTypes.func,
};

export default AddMedia;
