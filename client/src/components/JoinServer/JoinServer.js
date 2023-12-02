import React, { useState, useRef } from 'react';
import useOnClickOutside from '../../utils/useOnClickOutside';
import { connect } from 'react-redux';
import * as actions from '../../redux/store';
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

function mapStateToProps({ user }) {
  return {
    error: user.error,
    isLoading: user.isLoading,
    success: user.success
  };
}

export default connect(mapStateToProps, actions)(JoinServer);