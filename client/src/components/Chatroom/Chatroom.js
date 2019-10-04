import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actions from '../../redux';
import { ROOT_URL } from '../../config/networkSettings';
import io from 'socket.io-client';
import Moment from 'react-moment';
import 'moment-timezone';
import './Chatroom.css';
import chatot from '../../assets/images/chatot.png';
import numbersign from '../../assets/images/numbersign.png';
import voice from '../../assets/images/voice.png';
import editwhite from '../../assets/images/editwhite.png';

class Chatroom extends Component {
  constructor(props) {
    super(props);
    this.ref = React.createRef();
    this.useOnClickOutside(this.ref, () => this.setState({ messageMenu: false, userModalOpen: false, sideUserModalOpen: false }));

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
      sideRightClickedUser: {},
      sideUserModalOpen: false,
      userModalOpen: false,
      namespace: null,
      room: null,
      serverId: null,
      previousRoom: null,
      currentChatroom: null,
      editMessage: null,
      messageMenu: false,
      editingMessage: null,
      newMessage: "",
      hover: "",
      serverUserList: [],
      isLoading: false,
      chunks: [],
      myConnection: null,
      remoteConnection: null,
      voiceUsers: [],
      negotiating: false
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
    this.props.getUsers();

    this.socket = io(ROOT_URL);

    this.socket.on('connect', () => {
      this.setState({ serverUserList: this.props.serverUserList, socketId: this.socket.id, namespace: `${ROOT_URL}/${this.props.serverId}`, room: `${ROOT_URL}/chatroom/${this.props.serverId}/${this.props.activeChatroomId}`, previousRoom: `${ROOT_URL}/chatroom/${this.props.serverId}/${this.props.activeChatroomId}`, serverId: this.props.serverId, currentChatroom: this.props.activeChatroom, chatroomId: this.props.activeChatroomId, username: this.props.username });

      this.socket.emit('GET_CHATROOM_MESSAGES', {
        socketId: this.socket.id,
        chatroomId: this.props.activeChatroomId,
        previousRoom: `${ROOT_URL}/chatroom/${this.props.serverId}/${this.props.activeChatroomId}`,
        room: `${ROOT_URL}/chatroom/${this.props.serverId}/${this.props.activeChatroomId}`
      });
    });

    this.socket.on('RECEIVE_CHATROOM_MESSAGES', (data) => {
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

    this.socket.on('RECEIVE_SERVER_LIST', (data) => {
      const index = data.findIndex(x => x.username === this.state.username);
      if (index < 0) {
        this.props.leaveServer();
      } else if (index > -1) {
        this.props.refreshServerUsers();
        this.setState({ userModalOpen: false, sideUserModalOpen: false, rightClickedUser: {}, sideRightClickedUser: {}, serverUserList: data });
      }
    });

    // -- begin webrtc socket events -- //
    this.socket.on('RECEIVE_ICE_CANDIDATE', async(data) => {
      console.log('-- start receive ice candidate --');
      console.log(data.candidate);
      console.log('-- end receive ice candidate --');
      await this.state.myConnection.addIceCandidate(new RTCIceCandidate(data.candidate)).catch(err => console.log(err));
    });

    this.socket.on('RECEIVE_OFFER', async(data) => {
      console.log(data.username + ' =?= ' + this.state.username);

      this.setCalleeRemoteDescription(data.desc);
    });

    this.socket.on('RECEIVE_ANSWER', async(data) => {
      console.log(data.username + ' =?= ' + this.state.username);

      this.setCallerRemoteDescription(data.desc);
    });
    // -- end webrtc socket events -- //
  }

  async componentWillReceiveProps(nextProps) {
    if (nextProps.username) {
      this.setState({ username: nextProps.username });
    }
    if (nextProps.serverUserList) {
      this.setState({ serverUserList: nextProps.serverUserList });
    }
    if (nextProps.activeChatroomId !== this.state.chatroomId && this.state.chatroomId !== undefined) {
      await this.setState({
        previousRoom: `${ROOT_URL}/chatroom/${nextProps.serverId}/${this.state.chatroomId}`,
        room: `${ROOT_URL}/chatroom/${nextProps.serverId}/${nextProps.activeChatroomId}`,
        serverId: nextProps.serverId,
        currentChatroom: nextProps.activeChatroom,
        chatroomId: nextProps.activeChatroomId
      });
      this.socket.emit('GET_CHATROOM_MESSAGES', {
        socketId: this.state.socketId,
        chatroomId: nextProps.activeChatroomId,
        previousRoom: `${ROOT_URL}/chatroom/${nextProps.serverId}/${this.state.chatroomId}`,
        room: `${ROOT_URL}/chatroom/${nextProps.serverId}/${nextProps.activeChatroomId}`
      });
    }

    if (nextProps.users && nextProps.users.length) {
      const userList = [];
      for(let i = 0; i < nextProps.users.length; i++) {
        userList.push(nextProps.users[i]);
      }
      this.setState({ users: userList });
    }

    // -- start webrtc audio setup -- //
    if (nextProps.activeChatroomType === "voice" && nextProps.audioStream) {
      await this.setState({ localStream: nextProps.audioStream });
      this.recordAudioInput(nextProps.audioStream);
    }

    if (nextProps.activeChatroomType !== "voice") {
      await this.setState({ localStream: null });
      this.recordAudioInput(null);
    }
    // -- end webrtc audio setup -- //
  }

  // -- start webrtc peer connection setup -- //
  recordAudioInput = async(stream) => {
    if (stream) {
      try {
        console.log('------ my stream -------');
        console.log(stream);
        console.log('------ end my stream -------');

        const audioElements = document.getElementById('audioElements');
        const remoteAudio = document.createElement('audio');
        remoteAudio.style.display = "none";
        remoteAudio.srcObject = stream;
        remoteAudio.autoplay = true;
        audioElements.appendChild(remoteAudio);

        const STUN = {
          urls: 'stun:stun.l.google.com:19302'
        };

        const TURN = {
          urls: 'turn:turn.bistri.com:80',
          credential: 'homeo',
          username: 'homeo'
        };

        const configuration = {
          iceServers: [STUN, TURN]
        };

        await this.setState({ myConnection: new RTCPeerConnection(configuration) });

        await stream.getTracks().forEach((track) => {
          this.state.myConnection.addTrack(track, stream);
        });

        this.state.myConnection.onicecandidate = (event) => {
          const candidateQueue = [];
          if (this.state.myConnection.remoteDescription) {
            if (event.candidate && event.candidate.sdpMid !== "0") {
              this.socket.emit('SEND_ICE_CANDIDATE', {
                candidate: event.candidate,
                room: this.state.room
              });
            }

            if (candidateQueue && candidateQueue.length < 1) return;

            for (let i = 0; i < candidateQueue.length; i++) {
              this.socket.emit('SEND_ICE_CANDIDATE', {
                candidate: event.candidate,
                room: this.state.room
              });
            }
          } else if (!this.state.myConnection.remoteDescription && event.candidate && event.candidate.sdpMid !== "0") {
            candidateQueue.push(event.candidate);
          }
        }

        this.state.myConnection.ontrack = (event) => {
          console.log(event.streams[0]);
          if (!event.streams[0]) return;
          const audioElements = document.getElementById('audioElements');
          const remoteAudio = document.createElement('audio');
          remoteAudio.style.display = "none";
          remoteAudio.srcObject = event.streams[0];
          remoteAudio.autoplay = true;
          audioElements.appendChild(remoteAudio);
        };
      } catch (error) {
        console.log('error setting up RTCPeerConnection: ' + error);
      }
    } else {
      const audioElements = document.getElementById('audioElements');
      audioElements.innerHTML = '';
    }
  }

  startCall = () => {
    this.createCallerOffer();
  }

  createCallerOffer = async() => {
    console.log(`--- negotiating in ${this.state.myConnection.signalingState} ---`);

    try {
      const desc = await this.state.myConnection.createOffer({
        offerToReceiveAudio: 1,
        offerToReceiveVideo: 0
      });
      this.setCallerLocalDescription(desc);
    } catch (error) {
      console.log('error creating caller offer: ' + error);
    }
  }

  setCallerLocalDescription = async(desc) => {
    try {
      await this.state.myConnection.setLocalDescription(desc);
      console.log('-- start myConnection after setLocalDescription --');
      console.log(this.state.myConnection);
      console.log('-- end myConnection after setLocalDescription --');
      this.sendOfferFromCaller(desc);
    } catch(error) {
      console.log('error setting caller local description: ' + error);
    }
  }

  sendOfferFromCaller = (desc) => {
    console.log('-- sendOfferFromCaller --');
    const data = {
      desc: desc,
      username: this.state.username,
      room: this.state.room
    }

    this.socket.emit('SEND_OFFER', data);
  }

  setCalleeRemoteDescription = async(desc) => {
    console.log('-- setCalleeRemoteDescription --');
    try {
      await this.state.myConnection.setRemoteDescription(desc);
      this.calleCreateAnswer();
    } catch (error) {
      console.log('error setting callee remote description: ' + error);
    }
  }

  calleCreateAnswer = async() => {
    console.log('-- calleeCreateAnswer --');
    try {
      const desc = await this.state.myConnection.createAnswer();
      this.setCalleeLocalDescription(desc);
    } catch (error) {
      console.log('error creating callee answer: ' + error);
    }
  }

  setCalleeLocalDescription = async(desc) => {
    console.log('-- setCalleeLocalDescription --');
    try {
      await this.state.myConnection.setLocalDescription(desc);
      this.sendCallerDescription(desc);
    } catch (error) {
      console.log('error setting callee local description: ' + error);
    }
  }

  sendCallerDescription = (desc) => {
    console.log('-- sendCallerDescription --');
    const data = {
      desc: desc,
      username: this.state.username,
      room: this.state.room
    }

    this.socket.emit('SEND_ANSWER', data);
  }

  setCallerRemoteDescription = async(desc) => {
    console.log('-- setCallerRemoteDescription --');
    try {
      await this.state.myConnection.setRemoteDescription(desc);
    } catch (error) {
      console.log('error setting caller remote description: ' + error);
    }
  }
  // -- end webrtc peer connection setup -- //

  sideContextMenu = (event, item) => {
    event.preventDefault();
    this.setState({ sideRightClickedUser: item, sideUserModalOpen: true });
  }

  contextMenu = (event, item) => {
    event.preventDefault();
    this.setState({ rightClickedUser: item, userModalOpen: true, messageMenu: false, editingMessage: null });
  }

  privateMessageUser = () => {
    this.setState({ messages: [] });
    this.props.privateMessageUser(this.state.rightClickedUser);
  }

  sidePrivateMessageUser = () => {
    this.setState({ messages: [] });
    this.props.privateMessageUser(this.state.sideRightClickedUser);
  }

  openMessageMenu = (item) => {
    this.setState({ messageMenu: true, editMessage: item });
  }

  deleteChatroomMessage = () => {
    const data = {
      username: this.props.username,
      message: this.state.message,
      userId: this.props.userId,
      chatroomId: this.state.chatroomId,
      messageId: this.state.editMessage.id,
      room: this.state.room
    };
    this.socket.emit('DELETE_CHATROOM_MESSAGE', data);
  }

  editChatroomMessage = () => {
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
      username: this.props.username,
      message: this.state.newMessage,
      userId: this.props.userId,
      chatroomId: this.state.chatroomId,
      messageId: this.state.editingMessage.id,
      room: this.state.room
    };
    this.socket.emit('EDIT_CHATROOM_MESSAGE', data);
  }

  kickUser = (user) => {
    const data = {
      serverId: this.state.serverId,
      chatroomId: this.state.chatroomId,
      type: 'user',
      userId: user.userId,
      room: this.state.room
    };
    this.socket.emit('KICK_SERVER_USER', data);
  }

  banUser = (user) => {
    const data = {
      serverId: this.state.serverId,
      chatroomId: this.state.chatroomId,
      type: 'user',
      userId: user.userId,
      room: this.state.room
    };
    this.socket.emit('BAN_SERVER_USER', data);
  }

  sendMessage = (event) => {
    if (event) {
      event.preventDefault();
      const data = {
        username: this.props.username,
        message: this.state.message,
        userId: this.props.userId,
        chatroomId: this.state.chatroomId,
        room: this.state.room
      };
      this.socket.emit('CHATROOM_MESSAGE', data);
      this.setState({ message: "" });
    }
  }

  componentWillUnmount() {
    this.socket.emit('LEAVE_CHATROOMS', {
      room: this.state.room
    });
  }

  render() {
    return (
      <div className="chatroom">
        <div id="audioElements"></div>
        <div className="chatarea">
          <div className="chatarea-topbar" onClick={() => { this.startCall(); }}>
            <img src={this.props.activeChatroomType === "text" ? numbersign : voice} alt="channel" height={16} width={16} /><span>{this.props.activeChatroom}</span>
          </div>
          <div id="chatareamessages" className="chatarea-messages">
            {this.state.messages && this.state.messages.length > 0 ? this.state.messages.map((item, index) => {
              const moderate = (this.state.serverUserList.length > 0
              && this.state.serverUserList.some(serverItem => serverItem['username'] !== this.state.username
              && (serverItem['username'] === item.username && serverItem['type'] !== 'owner' && serverItem['type'] !== 'admin')));
              return (
                <div id={"message" + index} key={index} onMouseEnter={() => { this.setState({ hover: (this.state.editingMessage || this.state.messageMenu || (this.props.userId !== item.userId)) ? "" : ("message" + index) }) }} onMouseLeave={() => { this.setState({ hover: "" }); }}>
                  <div className="chatarea-messages-container">
                    <span className="chatarea-messages-user" onClick={this.handleClick} onContextMenu={(event) => { this.contextMenu(event, item); }}>{item.username}</span>
                    <Moment format="MM/DD/YYYY" date={item.updatedAt} className="chatarea-messages-time" />
                    {this.state.hover === ("message" + index) ? <span className="chatarea-messages-menu" onClick={() => { this.openMessageMenu(item); }}><img src={editwhite} height={15} width={15} alt="edit message" /></span> : null}
                    {this.state.messageMenu && this.state.editMessage.id === item.id ?
                      <div className="chatarea-messages-editmenu" ref={this.ref}>
                        <span onClick={() => { this.setState({ editMessage: null, messageMenu: false }); }}>&#10005;</span>
                        <p onClick={() => { this.editChatroomMessage(); }}>Edit</p>
                        <p onClick={() => { this.deleteChatroomMessage(); }}>Delete</p>
                      </div>
                    : null}
                    {this.state.userModalOpen && this.state.rightClickedUser.id === item.id ?
                      <div ref={this.ref} className={moderate === true ?"chatarea-messages-usermodalmod" : "chatarea-messages-usermodal"}>
                        <span onClick={() => { this.setState({ userModalOpen: false }); }}>&#10005;</span>
                        <p onClick={() => { this.privateMessageUser(); }} className={moderate === true ? "chatarea-messages-usermodalmod-privatemessage" : "chatarea-messages-usermodal-privatemessage"}>Send Message</p>

                        {moderate === true ? <p onClick={() => { this.kickUser(item); }} className="chatarea-messages-usermodalmod-kick">Kick {item.username}</p> : null}

                        {moderate === true ? <p onClick={() => { this.banUser(item); }} className="chatarea-messages-usermodalmod-ban">Ban {item.username}</p> : null}
                      </div>
                    : null}
                  </div>
                  {this.state.editingMessage !== null && this.state.editingMessage.id === item.id ? <span><input className="chatarea-messages-editmessage" onChange={(event) => { this.setState({ newMessage: event.target.value }) }} value={this.state.newMessage} onKeyDown={(event) => { event.keyCode === 13 && event.shiftKey === false ? this.sendEditedMessage(event) : this.sendMessage(null) }} /><p className="chatarea-messages-editmessage-note">escape to cancel • enter to save</p></span> : <p className="chatarea-messages-message">{item.message}</p>}
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
          {this.state.serverUserList.length > 0 ? this.state.serverUserList.map((user, index)  => {
            return (
              <div key={index} className={user.type === 'owner' ? "sidebarright-usercontainer" : ""} onClick={this.handleClick} onContextMenu={(event) => { this.sideContextMenu(event, user); }}>
                {user.type === 'owner' ? <div className="username">
                  <img className="username-image" src={user.imageUrl ? user.imageUrl : chatot} alt="username-icon" />
                </div> : null}
                {user.type === 'owner' && user.active ? <div className="userinfo-online"></div> : null}
                {user.type === 'owner' && !user.active ? <div className="userinfo-offline"></div> : null}
                {user.type === 'owner' ?
                  <div>
                    <span className="sidebarright-user">{user.username}</span>
                    {this.state.sideUserModalOpen && user.type === 'owner' && this.state.sideRightClickedUser.username === user.username ?
                      <div ref={this.ref} className="chatarea-messages-sideusermodal">
                        <span onClick={() => { this.setState({ sideUserModalOpen: false }); }}>&#10005;</span>
                        <p onClick={() => { this.sidePrivateMessageUser(); }} className="chatarea-messages-sideusermodal-privatemessage">Send Message</p>
                      </div>
                    : null}
                  </div>
                : null}
              </div>
            );
          }) : null}
          {this.state.serverUserList.length > 0 && this.state.serverUserList.some(item => item['type'] === 'owner') ? <div className="sidebarright-bordertwo" /> : null}
          <div className="sidebarright-authority">
            <span>Administrators</span>
          </div>
          <div className="sidebarright-bordertwo" />
          {this.state.serverUserList.length > 0 ? this.state.serverUserList.map((user, index)  => {
            return (
              <div key={index} className={user.type === 'admin' ? "sidebarright-usercontainer" : ""} onClick={this.handleClick} onContextMenu={(event) => { this.sideContextMenu(event, user); }}>
                {user.type === 'admin' ? <div className="username">
                  <img className="username-image" src={user.imageUrl ? user.imageUrl : chatot} alt="username-icon" />
                </div> : null}
                {user.type === 'admin' && user.active ? <div className="userinfo-online"></div> : null}
                {user.type === 'admin' && !user.active ? <div className="userinfo-offline"></div> : null}
                {user.type === 'admin' ?
                  <div>
                    <span className="sidebarright-user">{user.username}</span>
                    {this.state.sideUserModalOpen && user.type === 'admin' && this.state.sideRightClickedUser.username === user.username ?
                      <div ref={this.ref} className="chatarea-messages-sideusermodal">
                        <span onClick={() => { this.setState({ sideUserModalOpen: false }); }}>&#10005;</span>
                        <p onClick={() => { this.sidePrivateMessageUser(); }} className="chatarea-messages-sideusermodal-privatemessage">Send Message</p>
                      </div>
                    : null}
                  </div>
                : null}
              </div>
            );
          }) : null}
          {this.state.serverUserList.length > 0 && this.state.serverUserList.some(item => item['type'] === 'admin') ? <div className="sidebarright-bordertwo" /> : null}
          <div className="sidebarright-authority">
            <span>Moderators</span>
          </div>
          <div className="sidebarright-bordertwo" />
          {this.state.serverUserList.length > 0 ? this.state.serverUserList.map((user, index)  => {
            const moderate = (user.username !== this.state.username);
            return (
              <div key={index} className={user.type === 'moderator' ? "sidebarright-usercontainer" : ""} onClick={this.handleClick} onContextMenu={(event) => { this.sideContextMenu(event, user); }}>
                {user.type === 'moderator' ? <div className="username">
                  <img className="username-image" src={user.imageUrl ? user.imageUrl : chatot} alt="username-icon" />
                </div> : null}
                {user.type === 'moderator' && user.active ? <div className="userinfo-online"></div> : null}
                {user.type === 'moderator' && !user.active ? <div className="userinfo-offline"></div> : null}
                {user.type === 'moderator' ?
                  <div>
                    <span className="sidebarright-user">{user.username}</span>
                    {this.state.sideUserModalOpen && user.type === 'moderator' && this.state.sideRightClickedUser.username === user.username ?
                      <div ref={this.ref} className={moderate === true ?"chatarea-messages-sideusermodalmod" : "chatarea-messages-sideusermodal"}>
                        <span onClick={() => { this.setState({ sideUserModalOpen: false }); }}>&#10005;</span>
                        <p onClick={() => { this.sidePrivateMessageUser(); }} className={moderate === true ? "chatarea-messages-sideusermodalmod-privatemessage" : "chatarea-messages-sideusermodal-privatemessage"}>Send Message</p>

                        {moderate === true ? <p onClick={() => { this.kickUser(user); }} className="chatarea-messages-sideusermodalmod-kick">Kick {user.username}</p> : null}

                        {moderate === true ? <p onClick={() => { this.banUser(user); }} className="chatarea-messages-sideusermodalmod-ban">Ban {user.username}</p> : null}
                      </div>
                    : null}
                  </div>
                : null}
              </div>
            );
          }) : null}
          {this.state.serverUserList.length > 0 && this.state.serverUserList.some(item => item['type'] === 'moderator') ? <div className="sidebarright-bordertwo" /> : null}
          <div className="sidebarright-authority">
            <span>Voice</span>
          </div>
          <div className="sidebarright-bordertwo" />
          {this.state.serverUserList.length > 0 ? this.state.serverUserList.map((user, index) => {
            const moderate = (user.username !== this.state.username);
            return (
              <div key={index} className={user.type === 'voice' ? "sidebarright-usercontainer" : ""} onClick={this.handleClick} onContextMenu={(event) => { this.sideContextMenu(event, user); }}>
                {user.type === 'voice' ? <div className="username">
                  <img className="username-image" src={user.imageUrl ? user.imageUrl : chatot} alt="username-icon" />
                </div> : null}
                {user.type === 'voice' && user.active ? <div className="userinfo-online"></div> : null}
                {user.type === 'voice' && !user.active ? <div className="userinfo-offline"></div> : null}
                {user.type === 'voice' ?
                  <div>
                    <span className="sidebarright-user">{user.username}</span>
                    {this.state.sideUserModalOpen && user.type === 'voice' && this.state.sideRightClickedUser.username === user.username ?
                      <div ref={this.ref} className={moderate === true ?"chatarea-messages-sideusermodalmod" : "chatarea-messages-sideusermodal"}>
                        <span onClick={() => { this.setState({ sideUserModalOpen: false }); }}>&#10005;</span>
                        <p onClick={() => { this.sidePrivateMessageUser(); }} className={moderate === true ? "chatarea-messages-sideusermodalmod-privatemessage" : "chatarea-messages-sideusermodal-privatemessage"}>Send Message</p>

                        {moderate === true ? <p onClick={() => { this.kickUser(user); }} className="chatarea-messages-sideusermodalmod-kick">Kick {user.username}</p> : null}

                        {moderate === true ? <p onClick={() => { this.banUser(user); }} className="chatarea-messages-sideusermodalmod-ban">Ban {user.username}</p> : null}
                      </div>
                    : null}
                  </div>
                : null}
              </div>
            );
          }) : null}
          {this.state.serverUserList.length > 0 && this.state.serverUserList.some(item => item['type'] === 'voice') ? <div className="sidebarright-bordertwo" /> : null}
          <div className="sidebarright-authority">
            <span>Users</span>
          </div>
          <div className="sidebarright-bordertwo" />
          {this.state.serverUserList.length > 0 ? this.state.serverUserList.map((user, index) => {
            const moderate = (user.username !== this.state.username);
            return (
              <div key={index} className={user.type === 'user' ? "sidebarright-usercontainer" : ""} onClick={this.handleClick} onContextMenu={(event) => { this.sideContextMenu(event, user); }}>
                {user.type === 'user' ? <div className="username">
                  <img className="username-image" src={user.imageUrl ? user.imageUrl : chatot} alt="username-icon" />
                </div> : null}
                {user.type === 'user' && user.active ? <div className="userinfo-online"></div> : null}
                {user.type === 'user' && !user.active ? <div className="userinfo-offline"></div> : null}
                {user.type === 'user' ?
                  <div>
                    <span className="sidebarright-user">{user.username}</span>
                    {this.state.sideUserModalOpen && user.type === 'user' && this.state.sideRightClickedUser.username === user.username ?
                      <div ref={this.ref} className={moderate === true ?"chatarea-messages-sideusermodalmod" : "chatarea-messages-sideusermodal"}>
                        <span onClick={() => { this.setState({ sideUserModalOpen: false }); }}>&#10005;</span>
                        <p onClick={() => { this.sidePrivateMessageUser(); }} className={moderate === true ? "chatarea-messages-sideusermodalmod-privatemessage" : "chatarea-messages-sideusermodal-privatemessage"}>Send Message</p>

                        {moderate === true ? <p onClick={() => { this.kickUser(user); }} className="chatarea-messages-sideusermodalmod-kick">Kick {user.username}</p> : null}

                        {moderate === true ? <p onClick={() => { this.banUser(user); }} className="chatarea-messages-sideusermodalmod-ban">Ban {user.username}</p> : null}
                      </div>
                    : null}
                  </div>
                : null}
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