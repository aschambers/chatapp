import React, { useState, useEffect } from 'react';
import queryString from 'query-string';
import Loading from '../../components/Loading/Loading';
import { toast } from 'react-toastify';
import { Redirect } from 'react-router';
import { connect } from 'react-redux';
import * as actions from '../../redux';
import Navigation from '../../components/Navigation/Navigation';
import './Verification.css';

const Verification = (props) => {
  const [emailAddress, setEmailAddress] = useState("");
  const [isVerified, setIsVerified] = useState(false);
  const [notVerified, setNotVerified] = useState(false);
  const [alreadyVerified, setAlreadyVerified] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isRedirect, setIsRedirect] = useState(false);
  const params = queryString.parse(props.location.search);
  const email = params.email;
  const token = params.token;

  useEffect(() => {
    if (email && token && !isLoading && !notVerified) {
      setIsLoading(true);
      props.userVerification({
        email: email,
        token: token
      });
    }

    if (props.success && !notVerified) {
      setIsVerified(true);
      setIsLoading(false);
    }

    if (props.already && !notVerified) {
      setAlreadyVerified(true);
      setIsLoading(false);
    }
    if (props.error && !notVerified) {
      setIsLoading(false);
      setNotVerified(true);
      if (email) {
        setEmailAddress(email);
      }
    }
    props.resetUserValues();
  }, [props, email, token, isLoading, notVerified]);

  const closeToast = () => {
    setIsRedirect(true);
  }

  const sendEmail = () => {
    if (!email) {
      toast.error("Email Address is required to send a verification email", {
        position: toast.POSITION.BOTTOM_CENTER
      });
    } else {
      props.sendEmail({ email: emailAddress });
    }
  }

  if (alreadyVerified && !isRedirect) {
    return (
      toast.success("Your account has already been verified!", {
        position: toast.POSITION.BOTTOM_CENTER
      }, {
        onClose: closeToast()
      })
    );
  }

  if (isVerified && !isRedirect) {
    return (
      toast.success("Your account has been verified!", {
        position: toast.POSITION.BOTTOM_CENTER
      }, {
        onClose: closeToast()
      })
    );
  }

  if (isRedirect) {
    return <Redirect push to="/Login" />;
  }

  if (isLoading) {
    return (
      <Loading />
    );
  }

  if (!isLoading && !isVerified) {
    return (
      <div className="verification">
        <Navigation />
        <p>Your account has not been verified. Please send another email to verify your account.</p>
        <input value={emailAddress} onChange={(event) => { setEmailAddress(event.target.value); }} />
        <button onClick={() => { sendEmail(); }}>Send Email</button>
      </div>
    );
  }
};

function mapStateToProps({ usersReducer }) {
  return {
    error: usersReducer.error,
    isLoading: usersReducer.isLoading,
    success: usersReducer.success,
    already: usersReducer.already
  };
}

export default connect(mapStateToProps, actions)(Verification);