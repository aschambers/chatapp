import React, { useState, useEffect, useRef } from 'react';
import { connect } from 'react-redux';
import * as actions from '../../redux';
import './JoinServer.css';

const JoinServer = (props) => {
  const [inviteCode, setInviteCode] = useState("");
  const ref = useRef();
  useOnClickOutside(ref, () => props.setModalOpen(false));

  return (
    <div ref={ref} className="serverjoin">
      <h1 className="serverjoin-title">Join a server</h1>
      <p className="serverjoin-info">Enter an invite code below to join an existing server.</p>
      <input placeholder="Enter an invite code" value={inviteCode} onChange={(event) => { setInviteCode(event.target.value); }} />
      <div className="serverjoin-actions">
        <p onClick={props.setModalOpen}>&larr; Back</p>
        <button onClick={() => { props.joinServer(inviteCode)}}>Join</button>
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

export default connect(mapStateToProps, actions)(JoinServer);