import React, { useState, useEffect } from 'react';
import queryString from 'query-string';
import Loading from '../../components/Loading/Loading';
import ToastMessage from '../../components/ToastMessage/ToastMessage';
import { toast } from 'react-toastify';
import { Navigate } from 'react-router';
import { connect } from 'react-redux';
import * as actions from '../../redux/store';
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

    if (props.resultEmail) {
      toast.success("Please check your email for a verification link!", {
        position: toast.POSITION.BOTTOM_CENTER
      });
      setTimeout(() => {
        setIsRedirect(true);
      }, 3000);
    }

    if (props.noEmail) {
      toast.error("Email Address does not exist.", {
        position: toast.POSITION.BOTTOM_CENTER
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
    // props.resetUserValues();
  }, [props, email, token, isLoading, notVerified]);

  const closeToast = () => {
    setIsRedirect(true);
  }

  const sendEmail = () => {
    if (!emailAddress) {
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
    return <Navigate to="/Login" />;
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
        <ToastMessage />
        <p>Your account has not been verified. Please send another email to verify your account.</p>
        <input value={emailAddress} onChange={(event) => { setEmailAddress(event.target.value); }} />
        <button onClick={() => { sendEmail(); }}>Send Email</button>
      </div>
    );
  }
};

function mapStateToProps({ user }) {
  return {
    error: user.error,
    isLoading: user.isLoading,
    success: user.success,
    already: user.already,
    resultEmail: user.resultEmail,
    noEmail: user.noEmail
  };
}

export default connect(mapStateToProps, actions)(Verification);