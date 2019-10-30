import React, { useRef } from 'react';
import useOnClickOutside from '../../utils/useOnClickOutside';
import './ServerEditModal.css';

const ServerEditModal = (props) => {
  const ref = useRef();
  useOnClickOutside(ref, () => props.setModalOpen(false));

  return (
    <div ref={ref} className="servereditmodal">
      <h1 className="servereditmodal-title">{props.serverActive ? 'Hide Server?' : 'Show Server?'}</h1>
      <div className="servereditmodal-actions">
        <p onClick={props.setModalOpen}>&larr; Cancel</p>
        <button onClick={() => { props.toggleServer(!props.serverActive)}}>{props.serverActive ? 'Hide' : 'Show'}</button>
      </div>
    </div>
  );
}

export default ServerEditModal;