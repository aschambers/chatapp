import React, { useRef } from 'react';
import useOnClickOutside from '../../utils/useOnClickOutside';
import chatot from '../../assets/images/chatot.png';
import upload from '../../assets/images/upload.png';
import './EditAccount.css';

const EditAccount = (props) => {
  const ref = useRef();
  useOnClickOutside(ref, () => props.setAccountModalOpen(false));

  const mainSubmit = React.createRef();
  const mainFile = React.createRef();

  const clickMainFile = () => {
    mainFile.current.click();
  }

  return (
    <div ref={ref} className="editaccount">
      <h1 className="editaccount-title">My Account</h1>
      <input id="file" type="file" style={{ display: 'none' }} ref={mainFile} onChange={(event) => { props.showMainFile(event) }} />
      <div className="editaccount-image" ref={mainSubmit} onClick={clickMainFile}>
        <img src={props.editImageUrl ? props.editImageUrl : chatot} alt="username-icon" />
        <div>
          <span>Select profile image</span>
          <img src={upload} width={15} height={15} alt="upload" />
        </div>
      </div>
      <div className="editaccount-info">
        <div className="editaccount-info-profile">
          <span className="editaccount-info-profile-email">Email</span>
          <input className="editaccount-info-profile-emailinput" onChange={(event) => { props.setEditEmail(event.target.value); }} value={props.editEmail} />
        </div>
        <div className="editaccount-info-profile">
          <span className="editaccount-info-profile-username">Username</span>
          <input className="editaccount-info-profile-usernameinput" onChange={(event) => { props.setEditUsername(event.target.value); }} value={props.editUsername} />
        </div>
      </div>
      <div className="editaccount-actions">
        <p onClick={props.setAccountModalOpen}>&larr; Back</p>
        <button onClick={() => { props.saveAccountInfo(); }}>Save</button>
      </div>
    </div>
  );
}

export default EditAccount;