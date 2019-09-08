import React, { useRef } from 'react';
import useOnClickOutside from '../../utils/useOnClickOutside';
import './NotificationSettingsModal.css';

const NotificationSettingsModal = (props) => {
  const ref = useRef();
  useOnClickOutside(ref, () => props.setShowNotificationSettingsModal(false));

  return (
    <div ref={ref} className="notificationsmodal-container">
      <p className="notificationsmodal-container-title">Notification Settings</p>
      <p className="notificationsmodal-container-name">Alerts</p>
      <div className="notificationsmodal-container-allow">
        <span>Allow notifications for activity on chatter</span>
        <label className="switchnotify">
          <input type="checkbox" onChange={() => { props.setAllowPushNotifications(); }} checked={props.setAllowPushNotifications} />
          <span className="slidernotify roundnotify"></span>
        </label>
      </div>
      <button className="notificationsmodal-container-cancel" onClick={() => { props.setShowNotificationSettingsModal(false); }}>Cancel</button>
      <button className="notificationsmodal-container-create" onClick={() => { props.setShowNotificationSettingsModal(false); }}>Save</button>
    </div>
  );
}

export default NotificationSettingsModal;