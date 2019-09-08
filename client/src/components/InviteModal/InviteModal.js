import React, { useState, useRef } from 'react';
import useOnClickOutside from '../../utils/useOnClickOutside';
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
          <p className="invitemodal-container-title">{instantFormat && !props.inviteCode ? "Create Instant Invite" : instantFormat && props.inviteCode ? "Use Invite Code" : "Send Personal Invite"}</p>
          {instantFormat && props.inviteCode ? <span className="invite-link">{props.inviteCode}</span> : null}
          {instantFormat && !props.inviteCode ? <img src={instant} alt="instant-invite" className="instant-invite" /> : null}
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

export default InviteModal;