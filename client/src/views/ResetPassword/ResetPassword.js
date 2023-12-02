import React, { useState, useEffect } from 'react';
import queryString from 'query-string';
import Loading from '../../components/Loading/Loading';
import ToastMessage from '../../components/ToastMessage/ToastMessage';
import { toast } from 'react-toastify';
import { Navigate } from 'react-router';
import { connect } from 'react-redux';
import * as actions from '../../redux/store';
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
      toast.dismiss();
      toast.success("Password was reset successfully!", {
        position: toast.POSITION.BOTTOM_CENTER
      });
      setTimeout(() => {
        setIsRedirect(true);
      }, 3000);
    }

    if (props.resetPassError) {
      setIsLoading(false);
      toast.dismiss();
      toast.error("Password was unable to be reset.", {
        position: toast.POSITION.BOTTOM_CENTER
      });
    }

    // props.resetUserValues();
  }, [props, email, token]);

  if (isRedirect) {
    return <Navigate to="/Login" />;
  }

  if (isLoading) {
    return (
      <Loading />
    );
  }

  const resetPassword = () => {
    if (password !== confirmPassword) {
      toast.dismiss();
      toast.error("Password and Confirm Password do not match.", {
        position: toast.POSITION.BOTTOM_CENTER
      });
    }
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

function mapStateToProps({ user }) {
  return {
    resetPassLoading: user.isLoading,
    resetPassSuccess: user.resetPassSuccess,
    resetPassError: user.resetPassError
  };
}

export default connect(mapStateToProps, actions)(ResetPassword);