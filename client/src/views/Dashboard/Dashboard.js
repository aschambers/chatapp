import React, { useState, useEffect, useRef } from 'react';
import { connect } from 'react-redux';
import * as actions from '../../redux';
import ReactTooltip from 'react-tooltip';
import Chatroom from '../../components/Chatroom/Chatroom';
import './Dashboard.css';
import chatot from '../../assets/images/chatot.png';
import friends from '../../assets/images/friends.png';
import settings from '../../assets/images/settings.png';

const Dashboard = (props) => {
  const [username, setUsername] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [active, setActive] = useState(false);
  const [chatroom, setChatroom] = useState('');
  const [hover, setHover] = useState('');
  const [isModalOpen, setModalOpen] = useState(false);

  const ref = useRef();
  const settingsRef = useRef("settings");
  useOnClickOutside(ref, () => setModalOpen(false));

  useEffect(() => {
    if(!props.user) {
      props.currentUser();
      window.addEventListener('keydown', detectEscape);
    } else if(props.user) {
      const { username, imageUrl, active } = props.user;
      setUsername(username);
      setImageUrl(imageUrl);
      setActive(active);
    }
  }, [props]);

  const detectEscape = (event) => {
    if (event.keyCode === 27) {
      setModalOpen(false);
    }
  }

  return (
    <div className="chatroom">
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
          <img className="settings-image" src={settings} alt="settings-icon" ref={settingsRef} onClick={() => { setModalOpen(!isModalOpen); }} />
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
              <button>Create a server</button>
            </div>
            <div className="mainarea-container-joinserver">
              <h1>Join</h1>
              <p>Enter an secret invite code to join an existing server!</p>
              <button>Join a server</button>
            </div>
          </div>
        </div>
      }
      {isModalOpen ?
        <div className="modal-settings" ref={ref}>
          Hey, I'm a modal. Click anywhere outside of me to close.
        </div>
      : null}
    </div>
  );
}

const useOnClickOutside = (ref, handler) => {
  useEffect(() => {
    const listener = event => {
      // Do nothing if clicking ref's element, descendent elements or settings icon
      if (!ref.current || ref.current.contains(event.target) || event.target.className === "settings-image") {
        return;
      }

      handler(event);
    };

    document.addEventListener('mousedown', listener);
    document.addEventListener('touchstart', listener);

    return () => {
      document.removeEventListener('mousedown', listener);
      document.removeEventListener('touchstart', listener);
    };
  }, [ref, handler]);
}

function mapStateToProps({ usersReducer }) {
  return {
    error: usersReducer.error,
    isLoading: usersReducer.isLoading,
    success: usersReducer.success,
    user: usersReducer.user,
    users: usersReducer.users
  };
}

export default connect(mapStateToProps, actions)(Dashboard);