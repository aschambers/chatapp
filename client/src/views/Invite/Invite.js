import React, { useState, useEffect } from 'react';
import queryString from 'query-string';
import Loading from '../../components/Loading/Loading';
import ToastMessage from '../../components/ToastMessage/ToastMessage';
import { toast } from 'react-toastify';
import { Redirect } from 'react-router';
import { connect } from 'react-redux';
import * as actions from '../../redux';
import Navigation from '../../components/Navigation/Navigation';
import './Invite.css';

const Invite = (props) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isRedirectSuccess, setIsRedirectSuccess] = useState(false);
  const [isRedirectFail, setIsRedirectFail] = useState(false);
  const [emailAddress, setEmailAddress] = useState("");
  const params = queryString.parse(props.location.search);
  const email = params.email;
  const token = params.token;

  useEffect(() => {
    if ((!email && !token) && !isRedirectFail) {
      setIsLoading(false);
    }

    if (email && token && !isLoading) {
      setIsLoading(true);
      props.inviteVerification({
        email: email,
        token: token
      });
    }

    if (props.verifySuccess && !isRedirectSuccess) {
      toast.success("You have been added to the server successfully, please login!", {
        position: toast.POSITION.BOTTOM_CENTER
      });
      setIsLoading(false);
      setTimeout(() => {
        setIsRedirectSuccess(true);
      }, 3000);
    }

    if (props.verifyError && !isRedirectFail) {
      toast.error("Invite has expired or is no longer valid!", {
        position: toast.POSITION.BOTTOM_CENTER
      });
      setIsLoading(false);
      setTimeout(() => {
        setIsRedirectFail(true);
      }, 3000);
    }
    props.resetInviteValues();
  }, [props, email, token, isLoading, isRedirectSuccess, isRedirectFail]);

  if (isRedirectSuccess || isRedirectFail) {
    return <Redirect push to="/Login" />;
  }

  if (isLoading) {
    return (
      <Loading />
    );
  }

  const acceptInvite = () => {
    props.inviteVerification({
      email: emailAddress,
      token: token
    });
  }

  return (
    <div className="invitepage">
      <Navigation />
      <ToastMessage />
      <p>Please enter your email address to accept the invitation.</p>
      <input value={emailAddress} onChange={(event) => { setEmailAddress(event.target.value); }} />
      <button onClick={() => { acceptInvite(); }}>Accept Invite</button>
    </div>
  );
};

function mapStateToProps({ invitesReducer }) {
  return {
    error: invitesReducer.error,
    isLoading: invitesReducer.isLoading,
    success: invitesReducer.success,
    verifyError: invitesReducer.verifyError,
    verifySuccess: invitesReducer.verifySuccess
  };
}

export default connect(mapStateToProps, actions)(Invite);