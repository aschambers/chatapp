import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actions from '../../redux';
import { ROOT_URL } from '../../config/networkSettings';
import io from "socket.io-client";
import Moment from 'react-moment';
import 'moment-timezone';
import './ChatroomFriend.css';

class ChatroomFriend extends Component {
  constructor(props) {
    super(props);

    this.state = {
      message: "",
      messages: [],
      socketId: "",
      currentSocket: "",
      userId: null,
      friendId: null,
      groupId: null,
      room: null,
      previousRoom: null
    }
  }

  async componentDidMount() {
    this.socket = io(ROOT_URL);

    this.socket.on('connect', () => {
      this.setState({ socketId: this.socket.id, userId: this.props.userId, friendId: this.props.friendId, groupId: this.props.groupId });
    });

    const data = {
      userId: this.props.userId,
      friendId: this.props.friendId !== null ? this.props.friendId: this.props.userId,
      room: `${ROOT_URL}/friends/${this.props.groupdId}`,
      previousRoom: `${ROOT_URL}/friends/${this.props.groupdId}`
    };
    if (data.userId === data.friendId) {
      this.socket.emit('GET_PERSONAL_MESSAGES', data);
    } else if (data.userId !== data.friendId) {
      this.socket.emit('GET_PRIVATE_MESSAGES', data);
    }

    this.socket.on('RECEIVE_PRIVATE_MESSAGES', (data) => {
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

    this.socket.on('RECEIVE_PERSONAL_MESSAGES', (data) => {
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
    if (nextProps.groupId !== this.state.groupId) {
      this.setState({
        userId: nextProps.userId,
        friendId: nextProps.friendId,
        groupId: nextProps.groupId,
        room: `${ROOT_URL}/friends/${nextProps.groupId}`,
        previousRoom: `${ROOT_URL}/friends/${this.state.groupId}`
      });
      const data = {
        userId: nextProps.userId,
        friendId: nextProps.friendId,
        room: `${ROOT_URL}/friends/${nextProps.groupId}`,
        previousRoom: `${ROOT_URL}/friends/${this.state.groupId}`
      };
      if (data.userId === data.friendId) {
        this.socket.emit('GET_PERSONAL_MESSAGES', data);
      } else if (data.userId !== data.friendId) {
        this.socket.emit('GET_PRIVATE_MESSAGES', data);
      }
    }
  }

  componentWillUnmount() {
    this.socket.emit('LEAVE_CHATROOMS', {
      room: this.state.room
    });
  }

  sendMessage = (event) => {
    if (event) {
      event.preventDefault();
      const data = {
        username: this.props.username,
        message: this.state.message,
        userId: this.props.userId,
        friendId: this.props.friendId !== null ? this.props.friendId : this.props.userId,
        room: `${ROOT_URL}/friends/${this.props.groupdId}`,
        previousRoom: `${ROOT_URL}/friends/${this.state.groupId}`
      }
      if (data.userId === data.friendId) {
        this.socket.emit('SEND_PERSONAL_MESSAGE', data);
      } else if (data.userId !== data.friendId) {
        this.socket.emit('SEND_PRIVATE_MESSAGE', data);
      }
      this.setState({ message: "" });
    }
  }

  render() {
    return (
      <div className="chatroom">
        <div className="privatechatarea">
          <div id="privatechatareamessages" className="privatechatarea-messages">
            {this.state.messages && this.state.messages.length > 0 ? this.state.messages.map((item, index) => {
              return (
                <div id={"message" + index} key={index}>
                  <p><span className="privatechatarea-messages-user">{item.username}</span> <Moment format="MM/DD/YYYY" className="privatechatarea-messages-time"><span>{item.createdAt}</span></Moment></p>
                  <p className="privatechatarea-messages-message">{item.message}</p>
                </div>
              )
            }) : null}
          </div>
          <div className="privatechatarea-container">
            <input placeholder="Send a message!" type="text" onChange={(event) => { this.setState({ message: event.target.value }); }} value={this.state.message} onKeyDown={(event) => { event.keyCode === 13 && event.shiftKey === false ? this.sendMessage(event) : this.sendMessage(null) }}></input>
          </div>
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

export default connect(mapStateToProps, actions)(ChatroomFriend);