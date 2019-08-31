import React, { useEffect, useState, useRef } from 'react';
import settings from '../../assets/images/settings.png';
import instant from '../../assets/images/instant.png';
import './InviteModal.css';

const InviteModal = (props) => {
  const [inviteExpiresModal, setInviteExpiresModal] = useState(false);
  const [instantFormat, setInstantFormat] = useState(true);
  const ref = useRef();
  useOnClickOutside(ref, () => props.setShowInviteModal(false));

  return (
    <div ref={ref} className="invitemodal-container">
      {inviteExpiresModal ?
        <div>
          <p className="title">Settings</p>
          <div className="changeinvite">
            <span>Change invite type</span>
            <label className="switch">
              <input type="checkbox" onChange={() => { setInstantFormat(!instantFormat); }} checked={instantFormat} />
              <span className="slider round"></span>
            </label>
          </div>
          <div className="switchexpires">
            <span>Change when invite expires.</span>
            <select
              onChange={event => { props.setTimeExpires(event.target.value); }}
              value={props.expires}
            >
              <option value='24'>24 Hours</option>
              <option value='12'>12 Hours</option>
              <option value='6'>6 Hours</option>
              <option value='3'>3 Hours</option>
              <option value='2'>2 Hours</option>
              <option value='1'>1 Hour</option>
            </select>
          </div>
          <button className="invite-changesettings-save" onClick={() => { setInviteExpiresModal(false); }}>Save</button>
        </div> :
        <div>
          <img className="invite-settings" src={settings} alt="settings-icon" onClick={() => { setInviteExpiresModal(true); }} />
          <p className="invitemodal-container-title">{instantFormat ? "Create Instant Invite" : "Send Personal Invite"}</p>
          {instantFormat && props.inviteLink ? <span className="invite-link">{props.inviteLink}</span> : null}
          {instantFormat && !props.inviteLink ? <img src={instant} alt="instant-invite" className="instant-invite" /> : null}
          {!instantFormat ? <div className="personal-invite">
            <span>Email Address: </span>
            <input value={props.inviteEmail} onChange={(event) => { props.setCurrentInviteEmail(event.target.value); }} />
          </div> : null}
          <button className="invitemodal-container-cancel" onClick={() => { props.setShowInviteModal(false); }}>Cancel</button>
          {instantFormat ? <button className="invitemodal-container-create" onClick={() => { props.createNewInstantInvite() }}>Create</button> : <button className="invitemodal-container-create" onClick={() => { props.createNewInvite(); }}>Create</button>}
        </div>
      }
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

export default InviteModal;