import React, { useEffect, useRef } from 'react';
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

const useOnClickOutside = (ref, handler) => {
  useEffect(() => {
    const listener = event => {
      // Do nothing if clicking ref's element or descendent elements
      if (!ref.current || ref.current.contains(event.target)) {
        return;
      }

      handler(event);
    };

    document.addEventListener('mousedown', listener);
    document.addEventListener('touchstart', listener);

    return () => {
      document.removeEventListener('mousedown', listener);
      document.removeEventListener('touchstart', listener);
    };
  }, [ref, handler]);
}

export default ChannelModal;