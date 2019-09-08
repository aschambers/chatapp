import React, { useRef } from 'react';
import useOnClickOutside from '../../utils/useOnClickOutside';
import './ChannelModal.css';

const ChannelModal = (props) => {
  const ref = useRef();
  useOnClickOutside(ref, () => props.setShowChannelModal(false));

  return (
    <div ref={ref} className="categorymodal-container">
      <p className="categorymodal-container-title">Create Channel</p>
      <p className="categorymodal-container-name">Channel Name</p>
      <input onChange={(event) => { props.setNewChannel(event); }} /><br />
      <button className="categorymodal-container-cancel" onClick={() => { props.setShowChannelModal(false); }}>Cancel</button>
      <button className="categorymodal-container-create" onClick={() => { props.createNewChannel(); }}>Create</button>
    </div>
  );
}

export default ChannelModal;