import React, { useRef } from 'react';
import useOnClickOutside from '../../utils/useOnClickOutside';
import './UserManagement.css';

const UserManagement = (props) => {
  const ref = useRef();
  useOnClickOutside(ref, () => props.setShowUserManagement(false));

  return (
    <div ref={ref} className="usermanagementroles">
      <h1>User Management</h1>
      <p>Change user type:</p>
      <select
        onChange={event => { props.setServerUserRole(event.target.value); }}
        value={props.serverUserRole}
      >
        <option value='admin'>Administrator</option>
        <option value='moderator'>Moderator</option>
        <option value='voice'>Voice</option>
        <option value='user'>User</option>
      </select>
      <span className="usermanagementroles-activity">
        <button className="usermanagementroles-cancel" onClick={() => { props.setShowUserManagement(false); }}>Cancel</button>
        <button className="usermanagementroles-save" onClick={() => { props.setSaveServerUser(); }}>Save</button>
      </span>
    </div>
  );
}

export default UserManagement;