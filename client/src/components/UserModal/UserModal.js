import React, { useRef } from 'react';
import useOnClickOutside from '../../utils/useOnClickOutside';
import './UserModal.css';

const UserModal = (props) => {
  const ref = useRef();
  useOnClickOutside(ref, () => props.setUserModalOpen(false));

  return (
    <div ref={ref} className="usermodal">
      <h1 className="usermodal-title">Private Message</h1>
      <p className="usermodal-info">Send <b>{props.username}</b> a private message.</p>
      <div className="usermodal-actions">
        <p onClick={props.setUserModalOpen}>&larr; Exit</p>
        <button onClick={props.setPrivateMessageUser}>Send Message</button>
      </div>
    </div>
  );
}

export default UserModal;