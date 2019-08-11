import React, { useEffect, useRef } from 'react';
import { connect } from 'react-redux';
import * as actions from '../../redux';
import './CreateServer.css';

const CreateServer = (props) => {
  const ref = useRef();
  useOnClickOutside(ref, () => props.setModalOpen(false));

  return (
    <div ref={ref} className="servermodal">
      <h1 className="servermodal-title">Create your server</h1>
      <p className="servermodal-info">By creating your server you will have access to free voice and text-chat to use amongst your friends.</p>
      <p className="servermodal-name">Server Name</p>
      <input placeholder="Enter a server name" />
      <p className="servermodal-region">Server Region</p>
      <p className="servermodal-rules">By creating a server, you agree to meet our community guidelines.</p>
      <div className="servermodal-actions">
        <p onClick={props.setModalOpen}>&larr; Back</p>
        <button>Create</button>
      </div>
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

function mapStateToProps({ usersReducer }) {
  return {
    error: usersReducer.error,
    isLoading: usersReducer.isLoading,
    success: usersReducer.success
  };
}

export default connect(mapStateToProps, actions)(CreateServer);