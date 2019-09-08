import React, { useState, useEffect } from 'react';
import queryString from 'query-string';
import Loading from '../../components/Loading/Loading';
import ToastMessage from '../../components/ToastMessage/ToastMessage';
import { toast } from 'react-toastify';
import { Redirect } from 'react-router';
import { connect } from 'react-redux';
import * as actions from '../../redux';
import Navigation from '../../components/Navigation/Navigation';
import './ResetPassword.css';

const ResetPassword = (props) => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isRedirect, setIsRedirect] = useState(false);
  const params = queryString.parse(props.location.search);
  const email = params.email;
  const token = params.token;

  useEffect(() => {
    if (props.resetPassSuccess) {
      setIsLoading(false);
      toast.success("Password was reset successfully!", {
        position: toast.POSITION.BOTTOM_CENTER
      });
      setTimeout(() => {
        setIsRedirect(true);
      }, 3000);
    }

    if (props.resetPassError) {
      setIsLoading(false);
      toast.error("Password was unable to be reset.", {
        position: toast.POSITION.BOTTOM_CENTER
      });
    }

    props.resetUserValues();
  }, [props, email, token]);

  if (isRedirect) {
    return <Redirect push to="/Login" />;
  }

  if (isLoading) {
    return (
      <Loading />
    );
  }

  const resetPassword = () => {
    setIsLoading(true);
    props.resetPassword({
      token: token,
      password: password
    });
  }

  if (!isLoading) {
    return (
      <div className="resetpassword">
        <Navigation />
        <ToastMessage />
        <div className="resetpassword__container">
          <span>Reset Password</span>
          <div className="resetpassword__container__section">
            <span>Password</span>
            <input type="password" onChange={event => setPassword(event.target.value)} value={password}/>
            <span>Confirm Password</span>
            <input type="password" onChange={event => setConfirmPassword(event.target.value)} value={confirmPassword} />
            <button onClick={resetPassword}>Confirm</button>
          </div>
        </div>
      </div>
    );
  }
};

function mapStateToProps({ usersReducer }) {
  return {
    resetPassLoading: usersReducer.isLoading,
    resetPassSuccess: usersReducer.resetPassSuccess,
    resetPassError: usersReducer.resetPassError
  };
}

export default connect(mapStateToProps, actions)(ResetPassword);