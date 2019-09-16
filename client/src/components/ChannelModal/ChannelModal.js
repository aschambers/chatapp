import React, { useRef } from 'react';
import { toast } from 'react-toastify';
import useOnClickOutside from '../../utils/useOnClickOutside';
import './ChannelModal.css';

const ChannelModal = (props) => {
  const ref = useRef();
  useOnClickOutside(ref, () => props.setShowChannelModal(false));

  const channelModelCreate = () => {
    if (props.newChannel !== "" && props.newChannel.length > 2 && props.newChannel.length < 21) {
      props.createNewChannel();
    } else {
      toast.dismiss();
      toast.error('Error, the name of the channel does not meet the requirements.', { position: 'bottom-center' });
    }
  }

  return (
    <div ref={ref} className="categorymodal-container">
      <p className="categorymodal-container-title">Create Channel</p>
      <p className="categorymodal-container-name">Channel Name</p>
      <input onChange={(event) => { props.setNewChannel(event); }} /><br />
      <button className="categorymodal-container-cancel" onClick={() => { props.setShowChannelModal(false); }}>Cancel</button>
      <button className="categorymodal-container-create" onClick={channelModelCreate}>Create</button>
    </div>
  );
}

export default ChannelModal;