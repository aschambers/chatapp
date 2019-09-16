import React, { useRef } from 'react';
import useOnClickOutside from '../../utils/useOnClickOutside';
import './UserBans.css';

const UserBans = (props) => {
  const ref = useRef();
  useOnClickOutside(ref, () => props.setShowUserManagementBan(false));

  return (
    <div ref={ref} className="userbans">
      <h1>Remove user ban</h1>
      <span className="userbans-activity">
        <button className="userbans-cancel" onClick={() => { props.setShowUserManagementBan(false); }}>Cancel</button>
        <button className="userbans-save" onClick={() => { props.setRemoveUserBan(); }}>Unban</button>
      </span>
    </div>
  );
}

export default UserBans;