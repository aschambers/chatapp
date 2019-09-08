import React, { useEffect, useRef } from 'react';
import './ForgotPassword.css';

const ForgotPassword = (props) => {
  const ref = useRef();
  useOnClickOutside(ref, () => props.setModalOpen(false));

  return (
    <div ref={ref} className="forgotpassword">
      <h1 className="forgotpassword-title">Reset Password</h1>
      <input placeholder="Email" value={props.resetEmail} onChange={(event) => { props.setResetEmail(event.target.value); }} />
      <div className="forgotpassword-actions">
        <p onClick={props.setModalOpen}>&larr; Back</p>
        <button onClick={() => { props.forgotPassword(); }}>Submit</button>
      </div>
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

export default ForgotPassword;