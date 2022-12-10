import React from 'react';
import Dialog from '../dialogs/AddMediaDialog';
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

export default AddMedia;
