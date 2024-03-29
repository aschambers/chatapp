import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actions from '../../redux/store';
import { ROOT_URL } from '../../config/networkSettings';
import io from "socket.io-client";
import Moment from 'react-moment';
import 'moment-timezone';
import './ChatroomFriend.css';
import editwhite from '../../assets/images/editwhite.png';
import emoji from '../../assets/images/emoji.png';
import EmojiPicker from 'emoji-picker-react';

class ChatroomFriend extends Component {
  constructor(props) {
    super(props);
    this.ref = React.createRef();
    this.useOnClickOutside(this.ref, () => this.setState({ messageMenu: false, showEmojiPicker: false }));

    this.state = {
      message: "",
      messages: [],
      socketId: "",
      currentSocket: "",
      userId: null,
      friendId: null,
      groupId: null,
      room: null,
      previousRoom: null,
      editMessage: null,
      messageMenu: false,
      editingMessage: null,
      newMessage: "",
      hover: "",
      showEmojiPicker: false
    }
  }

  useOnClickOutside = (ref, handler) => {
    const listener = event => {
      // Do nothing if clicking ref's element or descendent elements
      if (!ref.current || ref.current.contains(event.target)) {
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
  }

  async componentDidMount() {
    window.addEventListener('keydown', this.detectEscape);
    this.socket = io(ROOT_URL);

    this.socket.on('connect', () => {
      this.setState({ socketId: this.socket.id, userId: this.props.userId, friendId: this.props.friendId, groupId: this.props.groupId });

      const data = {
        socketId: this.socket.id,
        userId: this.props.userId,
        friendId: this.props.friendId !== null ? this.props.friendId: this.props.userId,
        room: `${ROOT_URL}/friends/${this.props.groupId}`,
        previousRoom: `${ROOT_URL}/friends/${this.props.groupId}`
      };
      if (data.userId === data.friendId) {
        this.socket.emit('GET_PERSONAL_MESSAGES', data);
      } else if (data.userId !== data.friendId) {
        this.socket.emit('GET_PRIVATE_MESSAGES', data);
      }
    });

    this.socket.on('RECEIVE_PRIVATE_MESSAGES', (data) => {
      this.setState({ messageMenu: false, editMessage: null, editingMessage: null, newMessage: "" });
      // scroll to latest message after rendering messages in firefox
      if (navigator.userAgent.search("Firefox") > -1 || navigator.userAgent.search("Edge") > -1) {
        this.setState({ messages: data.reverse() }, () => {
          if (data && data.length > 0) {
            const element = "message" + (this.state.messages.length - 1);
            if (document.getElementById(element)) {
              document.getElementById(element).scrollIntoView();
            }
          }
        });
      } else if (navigator.userAgent.search("Firefox") < 0 || navigator.userAgent.search("Edge") < 0) {
        this.setState({ messages: data });
      }
    });

    this.socket.on('RECEIVE_PERSONAL_MESSAGES', (data) => {
      this.setState({ messageMenu: false, editMessage: null, editingMessage: null, newMessage: "" });
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
    if (nextProps.groupId !== this.state.groupId && this.state.groupId !== undefined) {
      this.setState({
        userId: nextProps.userId,
        friendId: nextProps.friendId,
        groupId: nextProps.groupId,
        room: `${ROOT_URL}/friends/${nextProps.groupId}`,
        previousRoom: `${ROOT_URL}/friends/${this.state.groupId}`
      });
      const data = {
        socketId: this.state.socketId,
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
        room: `${ROOT_URL}/friends/${this.props.groupId}`,
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

  openMessageMenu = (item) => {
    this.setState({ messageMenu: true, editMessage: item });
  }

  deleteUserMessage = () => {
    const data = {
      socketId: this.state.socketId,
      userId: this.props.userId,
      friendId: this.props.friendId !== null ? this.props.friendId : this.props.userId,
      messageId: this.state.editMessage.id,
      room: `${ROOT_URL}/friends/${this.props.groupId}`
    };
    this.socket.emit('DELETE_USER_MESSAGE', data);
  }

  editUserMessage = () => {
    this.setState({ editingMessage: this.state.editMessage, newMessage: this.state.editMessage.message, hover: "" }, () => {
      this.setState({ editMessage: null, messageMenu: false });
    });
  }

  detectEscape = (event) => {
    if (event.keyCode === 27 && !this.state.messageMenu) {
      this.setState({ editingMessage: this.state.editMessage, newMessage: "" });
    }
  }

  sendEditedMessage = (event) => {
    event.preventDefault();
    const data = {
      socketId: this.state.socketId,
      message: this.state.newMessage,
      userId: this.props.userId,
      friendId: this.props.friendId !== null ? this.props.friendId : this.props.userId,
      messageId: this.state.editingMessage.id,
      room: `${ROOT_URL}/friends/${this.props.groupId}`
    };
    this.socket.emit('EDIT_USER_MESSAGE', data);
  }

  showEmojiPicker = () => {
    let { showEmojiPicker } = this.state;
    this.setState({ showEmojiPicker: !showEmojiPicker });
  }

  handleEmojiClick = (code) => {
    this.setState({
      message: this.state.message + String.fromCodePoint("0x" + code)
    });
  }

  hideEmojiPicker = () => {
    if (this.state.showEmojiPicker) {
      this.setState({ showEmojiPicker: false });
    }
  }

  handleMessageChange = (event) => {
    if (event.target.value.length < 500) {
      this.setState({ message: event.target.value });
    }
  }

  handleNewMessageChange = (event) => {
    if (event.target.value.length < 500) {
      this.setState({ newMessage: event.target.value });
    }
  }

  render() {
    return (
      <div className="chatroom">
        <div className="privatechatarea">
          <div id="privatechatareamessages" className="privatechatarea-messages">
            {this.state.messages && this.state.messages.length > 0 ? this.state.messages.map((item, index) => {
              return (
                <div id={"message" + index} key={index} onMouseEnter={() => { this.setState({ hover: (this.state.editingMessage || this.state.messageMenu || (this.props.userId !== item.userId)) ? "" : ("message" + index) }) }} onMouseLeave={() => { this.setState({ hover: "" }); }}>
                  <p className="privatechatarea-messages-container">
                    <span className="privatechatarea-messages-user">{item.username}</span>
                    <Moment format="MM/DD/YYYY" date={item.updatedAt} className="privatechatarea-messages-time" />
                    {this.state.hover === ("message" + index) ? <span className="privatechatarea-messages-menu" onClick={() => { this.openMessageMenu(item); }}><img src={editwhite} height={15} width={15} alt="edit message" /></span> : null}
                    {this.state.messageMenu && this.state.editMessage.id === item.id ?
                      <div className="privatechatarea-messages-editmenu" ref={this.ref}>
                        <span onClick={() => { this.setState({ editMessage: null, messageMenu: false }); }}>&#10005;</span>
                        <p onClick={() => { this.editUserMessage(); }}>Edit</p>
                        <p onClick={() => { this.deleteUserMessage(); }}>Delete</p>
                      </div>
                    : null}
                  </p>
                  {this.state.editingMessage !== null && this.state.editingMessage.id === item.id ? <span><input className="privatechatarea-messages-editmessage" onChange={(event) => { this.handleNewMessageChange(event); }} value={this.state.newMessage} onKeyDown={(event) => { event.keyCode === 13 && event.shiftKey === false ? this.sendEditedMessage(event) : this.sendMessage(null) }} /><p className="privatechatarea-messages-editmessage-note">escape to cancel • enter to save</p></span> : <p className="privatechatarea-messages-message">{item.message}</p>}
                </div>
              )
            }) : null}
          </div>
          {this.state.showEmojiPicker ?
            <div className="friendemojipickerchatroom" ref={this.ref}>
              <EmojiPicker
                style={{ width: "-webkit-fill-available", zIndex: 10 }}
                emojiResolution={32}
                onEmojiClick={(event) => { this.handleEmojiClick(event); }}
              />
            </div>
          : null}
          <div className="privatechatarea-container">
            <input placeholder="Send a message!" type="text" onChange={(event) => { this.handleMessageChange(event); }} value={this.state.message} onKeyDown={(event) => { event.keyCode === 13 && event.shiftKey === false ? this.sendMessage(event) : this.sendMessage(null) }}></input>
            <img src={emoji} className="friendemojiselectchatroom" onClick={() => { this.showEmojiPicker(); }} alt="emoji-picker-icon" />
          </div>
        </div>
      </div>
    );
  }
}

function mapStateToProps({ user }) {
  return {
    error: user.error,
    isLoading: user.isLoading,
    success: user.success,
    user: user.user,
    users: user.users
  };
}

export default connect(mapStateToProps, actions)(ChatroomFriend);