import React, { Component } from 'react';
import ChannelList from '../../../components/channelList/ChannelList';
import ChannelButton from '../../../components/buttons/CreateChannel';

class Channels extends Component {
  render() {
    return (
      <div>
        <ChannelList />
        <ChannelButton />
      </div>
    );
  }
}

export default Channels;
