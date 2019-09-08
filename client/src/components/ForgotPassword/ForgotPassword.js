import React, { useRef } from 'react';
import useOnClickOutside from '../../utils/useOnClickOutside';
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

export default ForgotPassword;