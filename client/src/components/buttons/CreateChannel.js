import React from 'react';
import Dialog from '../dialogs/AddChannel';
import PropTypes from 'prop-types';
import 'reactjs-popup/dist/index.css';

class CreateChannel extends React.Component {
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

CreateChannel.propTypes = {
  children: PropTypes.any,
  onChange: PropTypes.func,
  onError: PropTypes.func
};

export default CreateChannel;
