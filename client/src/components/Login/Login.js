import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { connect, useDispatch } from 'react-redux';
import * as actions from '../../redux/store';
import { Navigate } from 'react-router';
import { toast } from 'react-toastify';
import ToastMessage from '../../components/ToastMessage/ToastMessage';
import ForgotPassword from '../../components/ForgotPassword/ForgotPassword';
import './Login.css';
import { resetUserValues } from '../../redux/modules/users/users';

const Login = (props) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [notVerified, setNotVerified] = useState(false);
  const [isRedirect, setIsRedirect] = useState(false);
  const [resetModal, setResetModal] = useState(false);
  const [resetEmail, setResetEmail] = useState('');

  const dispatch = useDispatch();

  useEffect(() => {
    if (props.error) {
      toast.dismiss();
      toast.error('Please check your username and password, and try again!', { position: 'bottom-center' });
    }

    if (props.forgotPassError) {
      toast.dismiss();
      toast.error('Error Requesting Password!', { position: toast.POSITION.BOTTOM_CENTER });
    }

    if (props.forgotPassSuccess) {
      setResetModal(false);
      setResetEmail('');
      toast.dismiss();
      toast.success('Success, please check your email for instructions!', { position: toast.POSITION.BOTTOM_CENTER });
    }

    if (props.notVerified && !notVerified) {
      setNotVerified(true);
    }

    dispatch(resetUserValues());
  }, [props, notVerified, dispatch]);

  const closeToast = () => {
    setIsRedirect(true);
  }

  if (notVerified && !isRedirect) {
    toast.error('Your account has not been verified!', {
      position: 'bottom-center'
    });

    setTimeout(() => {
      closeToast();
    }, 3000);
  }

  if (isRedirect) {
    return <Navigate to="/Verification" />;
  }

  if (props.success) {
    return <Navigate to="/Dashboard" />;
  }

  const userLogin = async() => {
    const params = {
      email: email,
      password: password
    }
    if (!email && !password) {
      toast.error('Email and password are required.', { position: 'bottom-center' });
    } else {
      props.userLogin(params);
    }
  }

  const showForgotPassword = () => {
    setResetModal(true);
  }

  const resetModalDefault = () => {
    setResetModal(false);
    setResetEmail('');
  }

  const forgotPassword = () => {
    props.forgotPassword({
      email: resetEmail
    });
  }

  return (
    <div className="authcontainerlogin">
      <ToastMessage />
      <span>Login to chatter!</span>
      <div className="authcontainerlogin__section">
        <span>Email</span>
        <input onChange={event => setEmail(event.target.value)} value={email} />
        <span>Password</span>
        <input onChange={event => setPassword(event.target.value)} value={password} type="password" />
        <p onClick={showForgotPassword}>Forgot your password?</p>
        <button onClick={userLogin}>Login</button>
        <Link to="/Signup"><p className="register">Need an account? Register.</p></Link>
      </div>

      {resetModal ?
        <ForgotPassword
          resetEmail={resetEmail}
          setResetEmail={(value) => { setResetEmail(value); }}
          setModalOpen={() => { resetModalDefault(); }}
          forgotPassword={() => { forgotPassword(); }}
        />
      : null}
    </div>
  );
};

function mapStateToProps({ user }) {
  return {
    error: user.error,
    isLoading: user.isLoading,
    success: user.success,
    notVerified: user.notVerified,
    forgotPassError: user.forgotPassError,
    forgotPassSuccess: user.forgotPassSuccess,
  }
}

export default connect(mapStateToProps, actions)(Login);