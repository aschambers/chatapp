import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import * as actions from '../../redux';
import { toast } from 'react-toastify';
import { Redirect } from 'react-router';
import ToastMessage from '../../components/ToastMessage/ToastMessage';
import './Login.css';

const Login = (props) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    if(props.error) {
      toast.dismiss();
      toast.error('Please check your email and password, and try again!', { position: 'bottom-center' });
    }
    props.resetUserValues();
  });

  if(props.success) {
    return <Redirect push to="/Dashboard" />;
  }

  const userLogin = () => {
    const params = {
      email: email,
      password: password
    }
    if(!email && !password) {
      toast.error('Email and password are required.', { position: 'bottom-center' });
    } else {
      props.userLogin(params);
    }
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
        <p>Forgot your password?</p>
        <button onClick={userLogin}>Login</button>
        <Link to="/Signup"><p className="register">Need an account? Register.</p></Link>
      </div>
    </div>
  );
};

function mapStateToProps({ usersReducer }) {
  return {
    error: usersReducer.error,
    isLoading: usersReducer.isLoading,
    success: usersReducer.success
  }
}

export default connect(mapStateToProps, actions)(Login);