import React, { useState, useEffect } from 'react';
import queryString from 'query-string';
import Loading from '../../components/Loading/Loading';
import ToastMessage from '../../components/ToastMessage/ToastMessage';
import { toast } from 'react-toastify';
import { Navigate, useLocation } from 'react-router';
import { connect } from 'react-redux';
import * as actions from '../../redux/store';
import Navigation from '../../components/Navigation/Navigation';
import chatterapp from '../../assets/images/chatterapp.png';
import './Verification.css';

const Verification = (props) => {
  const location = useLocation();
  const [emailAddress, setEmailAddress] = useState("");
  const [isVerified, setIsVerified] = useState(false);
  const [alreadyVerified, setAlreadyVerified] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isRedirect, setIsRedirect] = useState(false);
  const params = queryString.parse(location.search);
  const email = params.email;
  const token = params.token;

  const verificationCalled = React.useRef(false);

  useEffect(() => {
    if (email && token && !verificationCalled.current) {
      verificationCalled.current = true;
      setIsLoading(true);
      props.userVerification({ email, token });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [email, token]);

  useEffect(() => {
    if (props.resultEmail) {
      toast.success("Please check your email for a verification link!", {
        position: toast.POSITION.BOTTOM_CENTER
      });
      setTimeout(() => setIsRedirect(true), 3000);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.resultEmail]);

  useEffect(() => {
    if (props.noEmail) {
      toast.error("Email Address does not exist.", {
        position: toast.POSITION.BOTTOM_CENTER
      });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.noEmail]);

  useEffect(() => {
    if (props.success) {
      toast.success("Your account has been verified!", {
        position: toast.POSITION.BOTTOM_CENTER
      });
      setIsVerified(true);
      setIsLoading(false);
      setTimeout(() => setIsRedirect(true), 3000);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.success]);

  useEffect(() => {
    if (props.already) {
      toast.success("Your account has already been verified!", {
        position: toast.POSITION.BOTTOM_CENTER
      });
      setAlreadyVerified(true);
      setIsLoading(false);
      setTimeout(() => setIsRedirect(true), 3000);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.already]);

  useEffect(() => {
    if (props.error) {
      setIsLoading(false);
      if (email) setEmailAddress(email);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.error]);

  const sendEmail = () => {
    if (!emailAddress) {
      toast.error("Email Address is required to send a verification email", {
        position: toast.POSITION.BOTTOM_CENTER
      });
    } else {
      props.sendEmail({ email: emailAddress });
    }
  }

  if ((isVerified || alreadyVerified) && !isRedirect) {
    return (
      <div className="verification-success">
        <img src={chatterapp} alt="chatter-logo" className="verification-success-logo" />
        <ToastMessage />
      </div>
    );
  }

  if (isRedirect) {
    return <Navigate to="/Login" />;
  }

  if (isLoading) {
    return (
      <div>
        <Loading />
        <ToastMessage />
      </div>
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