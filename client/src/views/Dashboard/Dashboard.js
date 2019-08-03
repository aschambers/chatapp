import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import * as actions from '../../redux';
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

  useEffect(() => {
    if(!props.user) {
      props.currentUser();
    } else if(props.user) {
      const { username, imageUrl, active } = props.user;
      setUsername(username);
      setImageUrl(imageUrl);
      setActive(active);
    }
  }, [props]);

  return (
    <div className="chatroom">
      <div className="sidebar">
        <div className="sidebar-container">
          <span className="sidebar-select"></span>
          <img className="sidebar-logo" src={chatot} alt="chatter-icon-logo" onClick={() => { setChatroom("") }} />
        </div>
        <div className="sidebar-border" />
        <div className="sidebar-container">
          <img className="sidebar-logo" src={chatot} alt="chatter-icon" onClick={() => { setChatroom(username) }} />
        </div>
      </div>
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
          <img className="settings-image" src={settings} alt="settings-icon" />
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
    </div>
  );
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