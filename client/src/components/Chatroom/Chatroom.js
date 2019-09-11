import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actions from '../../redux';
import { ROOT_URL } from '../../config/networkSettings';
import io from "socket.io-client";
import Moment from 'react-moment';
import 'moment-timezone';
import UserModal from '../../components/UserModal/UserModal';
import './Chatroom.css';
import chatot from '../../assets/images/chatot.png';
import numbersign from '../../assets/images/numbersign.png';

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
      currentSocket: "",
      rightClickedUser: {},
      userModalOpen: false
    }
  }

  async componentDidMount() {
    this.props.currentUser();
    this.props.getUsers();

    this.socket = io(ROOT_URL);

    this.socket.on('connect', () => {
      this.setState({ socketId: this.socket.id });
    });

    this.socket.emit('GET_CHATROOM_MESSAGES', {
      chatroomId: this.props.activeChatroomId
    });

    this.socket.on('RECEIVE_CHATROOM_MESSAGES', (data) => {
      // scroll to latest message after rendering messages in firefox
      if (navigator.userAgent.search("Firefox") > -1) {
        this.setState({ messages: data.reverse() }, () => {
          if (data && data.length > 0) {
            const element = "message" + (this.state.messages.length - 1);
            if (document.getElementById(element)) {
              document.getElementById(element).scrollIntoView();
            }
          }
        });
      } else if (navigator.userAgent.search("Firefox") < 0) {
        this.setState({ messages: data });
      }
    });
  }

  async componentWillReceiveProps(nextProps) {
    if (nextProps.activeChatroomId) {
      this.socket.emit('GET_CHATROOM_MESSAGES', {
        chatroomId: nextProps.activeChatroomId
      });
    }
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

  sendMessage = (event) => {
    if (event) {
      event.preventDefault();
      this.socket.emit('CHATROOM_MESSAGE', {
        username: this.props.username,
        message: this.state.message,
        userId: this.props.userId,
        chatroomId: this.props.activeChatroomId
      });
      this.setState({ message: "" });
    }
  }

  contextMenu = (event, item) => {
    event.preventDefault();
    this.setState({ rightClickedUser: item, userModalOpen: true });
  }

  privateMessageUser = () => {
    this.setState({ messages: [] });
    this.props.privateMessageUser(this.state.rightClickedUser);
  }

  render() {
    return (
      <div className="chatroom">
        <div className="chatarea">
          <div className="chatarea-topbar">
            <img src={numbersign} alt="channel" height={16} width={16} /><span>{this.props.activeChatroom}</span>
          </div>
          <div id="chatareamessages" className="chatarea-messages">
            {this.state.messages && this.state.messages.length > 0 ? this.state.messages.map((item, index) => {
              return (
                <div id={"message" + index} key={index}>
                  <p><span className="chatarea-messages-user" onClick={this.handleClick} onContextMenu={(event) => { this.contextMenu(event, item); }}>{item.username}</span> <Moment format="MM/DD/YYYY" className="chatarea-messages-time"><span>{item.createdAt}</span></Moment></p>
                  <p className="chatarea-messages-message">{item.message}</p>
                </div>
              )
            }) : null}
          </div>
          <div className="chatarea-container">
            <input placeholder="Send a message!" type="text" onChange={(event) => { this.setState({ message: event.target.value }); }} value={this.state.message} onKeyDown={(event) => { event.keyCode === 13 && event.shiftKey === false ? this.sendMessage(event) : this.sendMessage(null) }}></input>
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
          {this.props.serverUserList.length > 0 ? this.props.serverUserList.map((user, index)  => {
            return (
              <div key={index} className={user.type === 'owner' ? "sidebarright-usercontainer" : ""} onClick={this.handleClick} onContextMenu={(event) => { this.contextMenu(event, user); }}>
                {user.type === 'owner' ? <div className="username">
                  <img className="username-image" src={user.imageUrl ? user.imageUrl : chatot} alt="username-icon" />
                </div> : null}
                {user.type === 'owner' && user.active ? <div className="userinfo-online"></div> : null}
                {user.type === 'owner' && !user.active ? <div className="userinfo-offline"></div> : null}
                {user.type === 'owner' ? <span className="sidebarright-user">{user.username}</span> : null}
              </div>
            );
          }) : null}
          <div className="sidebarright-authority">
            <span>Administrators</span>
          </div>
          <div className="sidebarright-bordertwo" />
          {this.props.serverUserList.length > 0 ? this.props.serverUserList.map((user, index)  => {
            return (
              <div key={index} className={user.type === 'admin' ? "sidebarright-usercontainer" : ""} onClick={this.handleClick} onContextMenu={(event) => { this.contextMenu(event, user); }}>
                {user.type === 'admin' ? <div className="username">
                  <img className="username-image" src={user.imageUrl ? user.imageUrl : chatot} alt="username-icon" />
                </div> : null}
                {user.type === 'admin' && user.active ? <div className="userinfo-online"></div> : null}
                {user.type === 'admin' && !user.active ? <div className="userinfo-offline"></div> : null}
                {user.type === 'admin' ? <span className="sidebarright-user">{user.username}</span> : null}
              </div>
            );
          }) : null}
          <div className="sidebarright-authority">
            <span>Moderators</span>
          </div>
          <div className="sidebarright-bordertwo" />
          {this.state.users.length > 0 ? this.state.users.map((user, index)  => {
            return (
              <div key={index} className={user.type === 'moderator' ? "sidebarright-usercontainer" : ""} onClick={this.handleClick} onContextMenu={(event) => { this.contextMenu(event, user); }}>
                {user.type === 'moderator' ? <div className="username">
                  <img className="username-image" src={user.imageUrl ? user.imageUrl : chatot} alt="username-icon" />
                </div> : null}
                {user.type === 'moderator' && user.active ? <div className="userinfo-online"></div> : null}
                {user.type === 'moderator' && !user.active ? <div className="userinfo-offline"></div> : null}
                {user.type === 'moderator' ? <span className="sidebarright-user">{user.username}</span> : null}
              </div>
            );
          }) : null}
          <div className="sidebarright-authority">
            <span>Voice</span>
          </div>
          <div className="sidebarright-bordertwo" />
          {this.props.serverUserList.length > 0 ? this.props.serverUserList.map((user, index) => {
            return (
              <div key={index} className={user.type === 'voice' ? "sidebarright-usercontainer" : ""} onClick={this.handleClick} onContextMenu={(event) => { this.contextMenu(event, user); }}>
                {user.type === 'voice' ? <div className="username">
                  <img className="username-image" src={user.imageUrl ? user.imageUrl : chatot} alt="username-icon" />
                </div> : null}
                {user.type === 'voice' && user.active ? <div className="userinfo-online"></div> : null}
                {user.type === 'voice' && !user.active ? <div className="userinfo-offline"></div> : null}
                {user.type === 'voice' ? <span className="sidebarright-user">{user.username}</span> : null}
              </div>
            );
          }) : null}
          <div className="sidebarright-authority">
            <span>Users</span>
          </div>
          <div className="sidebarright-bordertwo" />
          {this.props.serverUserList.length > 0 ? this.props.serverUserList.map((user, index) => {
            return (
              <div key={index} className={user.type === 'user' ? "sidebarright-usercontainer" : ""} onClick={this.handleClick} onContextMenu={(event) => { this.contextMenu(event, user); }}>
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
        {this.state.userModalOpen ?
          <UserModal
            userId={this.state.rightClickedUser.userId}
            username={this.state.rightClickedUser.username}
            setUserModalOpen={() => { this.setState({ userModalOpen: false }); }}
            setPrivateMessageUser={() => { this.privateMessageUser(); }}
          />
        : null}
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