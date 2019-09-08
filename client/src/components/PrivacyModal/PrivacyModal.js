import React, { useRef } from 'react';
import useOnClickOutside from '../../utils/useOnClickOutside';
import './PrivacyModal.css';

const PrivacyModal = (props) => {
  const ref = useRef();
  useOnClickOutside(ref, () => props.setShowPrivacyModal(false));

  return (
    <div ref={ref} className="privacymodal-container">
      <p className="privacymodal-container-title">Privacy Settings</p>
      <p className="privacymodal-container-name">Direct Messages</p>
      <div className="privacymodal-container-allow">
        <span>Allow direct messages from server members</span>
        <label className="switchallow">
          <input type="checkbox" onChange={() => { props.setAllowDirectMessages(); }} checked={props.allowDirectMessages} />
          <span className="sliderallow roundallow"></span>
        </label>
      </div>
      <button className="privacymodal-container-cancel" onClick={() => { props.setShowPrivacyModal(false); }}>Cancel</button>
      <button className="privacymodal-container-create" onClick={() => { props.setShowPrivacyModal(false); }}>Save</button>
    </div>
  );
}

export default PrivacyModal;