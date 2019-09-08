import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import * as actions from '../../redux';
import { toast } from 'react-toastify';
import { Redirect } from 'react-router';
import ToastMessage from '../../components/ToastMessage/ToastMessage'
import { Link } from 'react-router-dom';
import './Signup.css';

const Signup = (props) => {
  const [showSuccess, setShowSuccess] = useState(false);
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    if(props.success) {
      toast.dismiss();
      toast.success('You signed up successfully, please check for an email to verify your account!', {
        position: toast.POSITION.BOTTOM_CENTER,
      });
      setTimeout(() => {
        setShowSuccess(true);
      }, 3000);
    } else if(props.error) {
      toast.dismiss();
      toast.error('Email address or username is already in use', { position: 'bottom-center' });
    }
    props.resetUserValues();
  }, [props, props.success, props.error]);

  if(showSuccess) {
    return <Redirect push to="/Login" />;
  }

  const userSignup = () => {
    const params = {
      email: email,
      username: username,
      password: password,
      active: false,
      type: 'user'
    }
    if(!email && !username && !password) {
      toast.dismiss();
      toast.error('All fields are required to signup.', { position: 'bottom-center' });
    } else {
      props.userSignup(params);
    }
  }

  return (
    <div className="authcontainersignup">
      <ToastMessage />
      <span>Create an account!</span>
      <div className="authcontainersignup__section">
        <span>Email</span>
        <input onChange={event => setEmail(event.target.value)} value={email} />
        <span>Username</span>
        <input onChange={event => setUsername(event.target.value)} value={username}/>
        <span>Password</span>
        <input type="password" onChange={event => setPassword(event.target.value)} />
        <button onClick={userSignup}>Sign-up</button>
        <Link to="/Login"><p className="login">Already have an account? Login.</p></Link>
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

export default connect(mapStateToProps, actions)(Signup);