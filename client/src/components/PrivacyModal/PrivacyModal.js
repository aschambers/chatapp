import React, { useEffect, useRef } from 'react';
import './PrivacyModal.css';

const PrivacyModal = (props) => {
  const ref = useRef();
  useOnClickOutside(ref, () => props.setShowPrivacyModal(false));

  return (
    <div ref={ref} className="categorymodal-container">
      <p className="categorymodal-container-title">Privacy Settings - {props.server}</p>
      <p className="categorymodal-container-name">Direct Messages</p>
      <div><span>Allow direct messages from server members.</span></div>
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

export default PrivacyModal;