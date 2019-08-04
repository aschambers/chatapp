import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actions from '../../redux';
// import { ROOT_URL } from '../../config/networkSettings';
// import io from "socket.io-client";
// import { Link } from 'react-router-dom';
import './Chatroom.css';
import chatot from '../../assets/images/chatot.png';

class Chatroom extends Component {
  constructor(props) {
    super(props);

    this.state = {
      id: "",
      username: "",
      active: false,
      type: "",
      imageUrl: "",
      message: "",
      messages: [],
      users: [],
      clickedUsername: "",
      clickedType: "",
      privateMessages: [],
      personalMessages: [],
      userDetails: false,
      socketId: "",
      currentSocket: ""
    }
  }

  async componentDidMount() {
    this.props.currentUser();
    this.props.getUsers();
  }

  async componentWillReceiveProps(nextProps) {
    if (nextProps.user) {
      const { id, username, active, type } = nextProps.user;
      this.setState({
        id: id,
        username: username,
        active: active,
        type: type
      });
    }

    if (nextProps.users && nextProps.users.length) {
      const userList = [];
      for(let i = 0; i < nextProps.users.length; i++) {
        userList.push(nextProps.users[i]);
      }
      this.setState({ users: userList });
    }
  }

  render() {
    return (
      <div className="chatroom">
        <div className="chatarea">
          <div className="chatarea-container">
            <input placeholder="Send a message!"></input>
          </div>
        </div>
        <div className="sidebarright">
          <div className="sidebarright-container">
            <input placeholder="Filter users in server"></input>
          </div>
          <div className="sidebarright-border" />
          <div className="sidebarright-authority">
            <span>Room Owners</span>
          </div>
          <div className="sidebarright-bordertwo" />
          {this.state.users.length > 0 ? this.state.users.map((user, index)  => {
            return (
              <div key={index} className={user.type === 'owner' ? "sidebarright-usercontainer" : ""}>
                {user.type === 'owner' ? <div className="username">
                  <img className="username-image" src={user.imageUrl ? user.imageUrl : chatot} alt="username-icon" />
                </div> : null}
                {user.type === 'owner' && user.active ? <div className="userinfo-online"></div> : null}
                {user.type === 'owner' && !user.active ? <div className="userinfo-offline"></div> : null}
                {user.type === 'owner' ? <span className="sidebarright-user">{user.username}</span> : null}
              </div>
            )
          }) : null}
          <div className="sidebarright-authority">
            <span>Administrators</span>
          </div>
          <div className="sidebarright-bordertwo" />
          {this.state.users.length > 0 ? this.state.users.map((user, index)  => {
            return (
              <div key={index} className={user.type === 'admin' ? "sidebarright-usercontainer" : ""}>
                {user.type === 'admin' ? <div className="username">
                  <img className="username-image" src={user.imageUrl ? user.imageUrl : chatot} alt="username-icon" />
                </div> : null}
                {user.type === 'admin' && user.active ? <div className="userinfo-online"></div> : null}
                {user.type === 'admin' && !user.active ? <div className="userinfo-offline"></div> : null}
                {user.type === 'admin' ? <span className="sidebarright-user">{user.username}</span> : null}
              </div>
            )
          }) : null}
          <div className="sidebarright-authority">
            <span>Moderators</span>
          </div>
          <div className="sidebarright-bordertwo" />
          {this.state.users.length > 0 ? this.state.users.map((user, index)  => {
            return (
              <div key={index} className={user.type === 'moderator' ? "sidebarright-usercontainer" : ""}>
                {user.type === 'moderator' ? <div className="username">
                  <img className="username-image" src={user.imageUrl ? user.imageUrl : chatot} alt="username-icon" />
                </div> : null}
                {user.type === 'moderator' && user.active ? <div className="userinfo-online"></div> : null}
                {user.type === 'moderator' && !user.active ? <div className="userinfo-offline"></div> : null}
                {user.type === 'moderator' ? <span className="sidebarright-user">{user.username}</span> : null}
              </div>
            )
          }) : null}
          <div className="sidebarright-authority">
            <span>Voice</span>
          </div>
          <div className="sidebarright-bordertwo" />
          {this.state.users.length > 0 ? this.state.users.map((user, index)  => {
            return (
              <div key={index} className={user.type === 'voice' ? "sidebarright-usercontainer" : ""}>
                {user.type === 'voice' ? <div className="username">
                  <img className="username-image" src={user.imageUrl ? user.imageUrl : chatot} alt="username-icon" />
                </div> : null}
                {user.type === 'voice' && user.active ? <div className="userinfo-online"></div> : null}
                {user.type === 'voice' && !user.active ? <div className="userinfo-offline"></div> : null}
                {user.type === 'voice' ? <span className="sidebarright-user">{user.username}</span> : null}
              </div>
            )
          }) : null}
          <div className="sidebarright-authority">
            <span>Users</span>
          </div>
          <div className="sidebarright-bordertwo" />
          {this.state.users.length > 0 ? this.state.users.map((user, index)  => {
            return (
              <div key={index} className="sidebarright-usercontainer">
                {user.type === 'user' ? <div className="username">
                  <img className="username-image" src={user.imageUrl ? user.imageUrl : chatot} alt="username-icon" />
                </div> : null}
                {user.type === 'user' && user.active ? <div className="userinfo-online"></div> : null}
                {user.type === 'user' && !user.active ? <div className="userinfo-offline"></div> : null}
                {user.type === 'user' ? <span className="sidebarright-user">{user.username}</span> : null}
              </div>
            )
          }) : null}
        </div>
      </div>
    );
  }
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

export default connect(mapStateToProps, actions)(Chatroom);