import React from 'react';
import Dialog from '../dialogs/AddMediaDialog';
import PropTypes from 'prop-types';
import 'reactjs-popup/dist/index.css';

class AddMedia extends React.Component {

  handleItemAdd = (event) => {
    this.props.onChange(event);
  }

  render() {
    return <Dialog onChange={this.handleItemAdd}></Dialog>;
  }
}

AddMedia.propTypes = {
  children: PropTypes.any,
  onChange: PropTypes.func,
};

export default AddMedia;
