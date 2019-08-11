import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import * as actions from '../../redux';
import ReactTooltip from 'react-tooltip';
import { Redirect } from 'react-router';
import Chatroom from '../../components/Chatroom/Chatroom';
import CreateServer from '../../components/CreateServer/CreateServer';
import JoinServer from '../../components/JoinServer/JoinServer';
import './Dashboard.css';
import chatot from '../../assets/images/chatot.png';
import friends from '../../assets/images/friends.png';
import settings from '../../assets/images/settings.png';

const Dashboard = (props) => {
  const [id, setId] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [active, setActive] = useState(false);
  const [chatroom, setChatroom] = useState('');
  const [hover, setHover] = useState('');
  const [isSettingsOpen, setSettingsOpen] = useState(false);
  const [isModalOpen, setModalOpen] = useState(false);
  const [currentModal, setCurrentModal] = useState("");

  useEffect(() => {
    if(!props.user) {
      props.currentUser();
      window.addEventListener('keydown', detectEscape);
    } else if(props.user) {
      const { id, username, email, imageUrl, active } = props.user;
      setId(id);
      setUsername(username);
      setEmail(email);
      setImageUrl(imageUrl);
      setActive(active);
    }
  }, [props]);

  const detectEscape = (event) => {
    if (event.keyCode === 27) {
      setSettingsOpen(false);
    }
  }

  if(props.logout) {
    return <Redirect push to="/" />;
  }

  const userLogout = () => {
    props.userLogout({ id: id });
  }

  const toggleModal = (value) => {
    setModalOpen(true);
    setCurrentModal(value);
  }

  return (
    <div className="chatroom">
      {isModalOpen ? <span className="contentBackground"></span> : null}
      <div className="sidebar">
        <div className="sidebar-container" data-tip="home" data-place="right" onPointerOver={() => { setHover("") }}>
          {hover === "" && chatroom !== "" ? <span className="sidebar-hover"></span> : null}
          {chatroom === "" ? <span className="sidebar-select"></span> : null}
          <img className="sidebar-logo" src={chatot} alt="chatter-icon-logo" onClick={() => { setChatroom("") }} />
        </div>
        <div className="sidebar-border" />
        <div className="sidebar-container" data-tip={username} data-place="right" onPointerOver={() => { setHover(username) }}>
          {hover === username && chatroom !== username ? <span className="sidebar-hover"></span> : null}
          {chatroom === username ? <span className="sidebar-select"></span> : null}
          <img className="sidebar-logo" src={chatot} alt="chatter-icon" onClick={() => { setChatroom(username) }} />
        </div>
      </div>
      <ReactTooltip delayShow={200} />
      <div className="sidebarleft">
        <div className="sidebarleft-container">
          <input placeholder="Find or start a conversation"></input>
        </div>
        <div className="sidebarleft-border" />
        <div className="sidebarleft-friendscontainer">
          <img className="sidebarleft-logo" src={friends} alt="friends-icon" />
          <span className="sidebarleft-friends">Friends</span>
        </div>
        <div className="sidebarleft-border" />
        <div className="sidebarleft-directmessages">
          <span>Private Messages</span>
        </div>
        <div className="sidebarleft-bordertwo" />
        <div className="userinfo">
          <div className="username">
            <img className="username-image" src={imageUrl ? imageUrl : chatot} alt="username-icon" />
          </div>
          {active ? <div className="userinfo-online"></div> : null}
          <span style={{ color: 'white' }}>{username}</span>
          <img className="settings-image" src={settings} alt="settings-icon" onClick={() => { setSettingsOpen(!isSettingsOpen); }} />
        </div>
      </div>
      {chatroom === username ?
        <Chatroom /> :
        <div className="mainarea">
          <div className="mainarea-topnav">
          </div>
          <div className="mainarea-container">
            <div className="mainarea-container-addserver">
              <h1>Create</h1>
              <p>Create a new server and invite other people to join!</p>
              <button onClick={() => { toggleModal("create") }}>Create a server</button>
            </div>
            <div className="mainarea-container-joinserver">
              <h1>Join</h1>
              <p>Enter an secret invite code to join an existing server!</p>
              <button onClick={() => { toggleModal("join") }}>Join a server</button>
            </div>
          </div>
        </div>
      }
      {isSettingsOpen ?
        <div className="usersettings">
          <div className="usersettings-sidebar">
            <h1>User Settings</h1>
            <p>My Account</p>
            <p>Privacy &amp; Safety</p>
            <p>Connections</p>
            <p>Billing</p>
            <h1>App Settings</h1>
            <p>Voice &amp; Video</p>
            <p>Notifications</p>
            <p>Appearance</p>
            <p>Language</p>
            <p onClick={userLogout}>Logout</p>
          </div>
          <div className="usersettings-accountcontainer">
            <div className="usersettings-myaccount">
              <h1>My Account</h1>
              <div className="usersettings-myaccount__container">
                <div className="usersettings-myaccount__container-image">
                  <img src={imageUrl ? imageUrl : chatot} alt="username-icon" />
                </div>
                <div className="usersettings-myaccount__container-info">
                  <div className="usersettings-myaccount__container-info-username">
                    <span>Username</span><br/>
                    <span>{username}</span>
                  </div>
                  <div className="usersettings-myaccount__container-info-email">
                    <span>Email Address</span><br/>
                    <span>{email}</span>
                  </div>
                </div>
                <div className="usersettings-myaccount__container-edit">
                  <span>Edit</span>
                </div>
              </div>
            </div>
            <div className="usersettings-authentication">
              <h1>Two-Factor Authentication</h1>
              <p>Protect your account with an extra layer of security. Once configured you'll be required to enter your password and an authentication code from your mobile device to login.</p>
              <div className="usersettings-authentication-enable">
                <span>Enable</span>
              </div>
            </div>
            <div className="usersettings-escape" onClick={() => { setSettingsOpen(!isSettingsOpen); }}>
              <span>&#215;</span>
              <p>ESC</p>
            </div>
          </div>
        </div>
      : null}
      {isModalOpen && currentModal === "create" ?
        <CreateServer setModalOpen={() => { setModalOpen(!isModalOpen) }}/>
      : null}
      {isModalOpen && currentModal === "join" ?
        <JoinServer setModalOpen={() => { setModalOpen(!isModalOpen) }}/>
      : null}
    </div>
  );
}

function mapStateToProps({ usersReducer }) {
  return {
    error: usersReducer.error,
    isLoading: usersReducer.isLoading,
    success: usersReducer.success,
    logout: usersReducer.logout,
    user: usersReducer.user,
    users: usersReducer.users
  };
}

export default connect(mapStateToProps, actions)(Dashboard);