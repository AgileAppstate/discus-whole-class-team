import React from 'react';
import Dialog from '../dialogs/AddMediaDialog';
import 'reactjs-popup/dist/index.css';

class AddMedia extends React.Component {
  handleItemAdd = (event) => {
    this.props.onChange(event);
  }

  render() {
    return <Dialog onChange={this.handleItemAdd}></Dialog>;
  }
}

export default AddMedia;
