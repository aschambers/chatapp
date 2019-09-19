import React, { useState, useEffect, useRef } from 'react';
import useOnClickOutside from '../../utils/useOnClickOutside';
import { connect } from 'react-redux';
import * as actions from '../../redux';
import { Redirect } from 'react-router';
import { toast } from 'react-toastify';
import Moment from 'react-moment';
import 'moment-timezone';
import './Dashboard.css';
import ToastMessage from '../../components/ToastMessage/ToastMessage';
import Chatroom from '../../components/Chatroom/Chatroom';
import ChatroomFriend from '../../components/ChatroomFriend/ChatroomFriend';
import CreateServer from '../../components/CreateServer/CreateServer';
import JoinServer from '../../components/JoinServer/JoinServer';
import CategoryModal from '../../components/CategoryModal/CategoryModal';
import ChannelModal from '../../components/ChannelModal/ChannelModal';
import InviteModal from '../../components/InviteModal/InviteModal';
import NotificationSettingsModal from '../../components/NotificationSettingsModal/NotificationSettingsModal';
import PrivacyModal from '../../components/PrivacyModal/PrivacyModal';
import RegionModal from '../../components/RegionModal/RegionModal';
import UserManagement from '../../components/UserManagement/UserManagement';
import EditAccount from '../../components/EditAccount/EditAccount';
import UserBans from '../../components/UserBans/UserBans';
import Loading from '../../components/Loading/Loading';
import chatot from '../../assets/images/chatot.png';
import friends from '../../assets/images/friends.png';
import settings from '../../assets/images/settings.png';
import invite from '../../assets/images/invite.png';
import notification from '../../assets/images/notification.png';
import privacylock from '../../assets/images/privacylock.png';
import serversettings from '../../assets/images/serversettings.png';
import category from '../../assets/images/category.png';
import createchannel from '../../assets/images/createchannel.png';
import numbersign from '../../assets/images/numbersign.png';
import usregion from '../../assets/images/usregion.png';
import europe from '../../assets/images/europe.png';
import russia from '../../assets/images/russia.png';
import add from '../../assets/images/add.png';
import owner from '../../assets/images/owner.png';

const Dashboard = (props) => {
  const [id, setId] = useState(null);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [active, setActive] = useState(false);
  const [server, setServer] = useState('');
  const [serverName, setServerName] = useState('');
  const [serverId, setServerId] = useState(null);
  const [serverImage, setServerImage] = useState('');
  const [serverRegion, setServerRegion] = useState('');
  const [serverUserList, setServerUserList] = useState([]);
  const [hover, setHover] = useState('');
  const [isSettingsOpen, setSettingsOpen] = useState(false);
  const [isServerSettingsOpen, setIsServerSettingsOpen] = useState(false);
  const [isModalOpen, setModalOpen] = useState(false);
  const [currentModal, setCurrentModal] = useState('');
  const [region, setRegion] = useState("US West");
  const [serversList, setServersList] = useState([]);
  const [serverSettings, showServerSettings] = useState(false);
  const [inviteModal, setInviteModal] = useState(false);
  const [expires, setExpires] = useState(24);
  const [showChannelModal, setShowChannelModal] = useState(false);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);
  const [showNotificationSettingsModal, setShowNotificationSettingsModal] = useState(false);
  const [newCategory, setNewCategory] = useState('');
  const [newChannel, setNewChannel] = useState('');
  const [triggerReload, setTriggerReload] = useState(false);
  const [categories, setCategories] = useState([]);
  const [currentDragItem, setCurrentDragItem] = useState(null);
  const [chatrooms, setChatrooms] = useState([]);
  const [activeChatroom, setActiveChatroom] = useState('');
  const [activeChatroomId, setActiveChatroomId] = useState(null);
  const [isChangingRegion, setIsChangingRegion] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteCode, setInviteCode] = useState('');
  const [activeServerSetting, setActiveServerSetting] = useState("overview");
  const [activeUserSetting, setActiveUserSetting] = useState("myaccount");
  const [isAdmin, setIsAdmin] = useState(false);
  const [serverInvites, setServerInvites] = useState([]);
  const [allowDirectMessages, setAllowDirectMessages] = useState(false);
  const [friendsList, setFriendsList] = useState(null);
  const [currentFriend, setCurrentFriend] = useState(null);
  const [serverUser, setServerUser] = useState(null);
  const [serverUserBan, setServerUserBan] = useState(null);
  const [serverUserRole, setServerUserRole] = useState("admin");
  const [showUserManagement, setShowUserManagement] = useState(false);
  const [showUserManagementBan, setShowUserManagementBan] = useState(false);
  const [openServerItem, setOpenServerItem] = useState(null);
  const [didMount, setDidMount] = useState(false);
  const [serverUserBans, setServerUserBans] = useState([]);
  const [editUsername, setEditUsername] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [editImageUrl, setEditImageUrl] = useState('');
  const [accountModalOpen, setAccountModalOpen] = useState('');
  const [mainFile, setMainFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const ref = useRef();
  useOnClickOutside(ref, () => setShowCategoryModal(false));

  useEffect(() => {
    if (friendsList === null && id !== null) {
      props.findFriends({
        userId: id
      });
    }

    if (props.friendsList && props.findFriendsSuccess) {
      setFriendsList(props.friendsList);
      props.resetFriendValues();
    }

    if (props.friendsList && props.createFriendSuccess) {
      setFriendsList(props.friendsList);
      props.resetFriendValues();
    }

    if (props.friendsList && props.deleteFriendSuccess) {
      setFriendsList(props.friendsList);
      props.resetFriendValues();
    }

    if (props.findInvitesSuccess || props.findInvitesError) {
      if (props.findInvitesSuccess) {
        setServerInvites(props.inviteServersList);
      }
      props.resetInviteValues();
      setActiveServerSetting("invites");
    }

    if (props.verifySuccess) {
      setModalOpen(false);
      toast.dismiss();
      toast.success('Success, you have joined the server!', { position: 'bottom-center' });
      props.resetInviteValues();
      props.getUpdatedUser({ userId: id });
    }

    if (props.verifyError) {
      toast.dismiss();
      toast.error('Error joining server!', { position: 'bottom-center' });
      props.resetInviteValues();
    }

    if (props.updateRoleSuccess) {
      setShowUserManagement(false);
      setServerUserRole("admin");
      setServerUser(null);
    }

    if (props.serverUserList) {
      setServerUserList(props.serverUserList);
      const index = props.serverUserList.findIndex(x => x.username === username);
      if (index > -1) {
        if (props.serverUserList[index].type === 'admin' || props.serverUserList[index].type === 'owner') {
          setIsAdmin(true);
        } else if (props.serverUserList[index].type !== 'admin' || props.serverUserList[index].type !== 'owner') {
          setIsAdmin(false);
        }
      }
    }

    if (props.serverUserBans) {
      setShowUserManagementBan(false);
      setServerUserBan(null);
      setServerUserBans(props.serverUserBans);
    }

    if (props.chatroomError) {
      toast.dismiss();
      toast.error('Error, Error creating chatroom!', { position: 'bottom-center' });
      props.resetChatroomValues();
    }

    if (props.inviteCode) {
      setInviteModal(true);
      setIsServerSettingsOpen(false);
      setInviteCode(props.inviteCode);
    }
    if (props.inviteEmailSuccess) {
      setInviteModal(false);
      setIsServerSettingsOpen(false);
      toast.dismiss();
      toast.success('Success, Invite was sent successfully!', { position: 'bottom-center' });
    }
    if (props.inviteEmailError) {
      toast.dismiss();
      toast.error('Error, Invite could not be sent!', { position: 'bottom-center' });
    }
    if (props.chatroomList && props.chatroomSuccess) {
      setChatrooms(props.chatroomList);
      if (props.chatroomList.length > 0) {
        setActiveChatroom(props.chatroomList[0].name);
        setActiveChatroomId(props.chatroomList[0].id);
      }
      setShowChannelModal(false);
      setNewChannel('');
      props.resetChatroomValues();
    }
    if (props.categoryList) {
      setCategories(props.categoryList);
      setShowCategoryModal(false);
    }
  }, [props, id, username, friendsList]);

  useEffect(() => {
    window.addEventListener('keydown', detectEscape);
    if(!props.user && !didMount) {
      setDidMount(true);
      props.currentUser();
    } else if (props.user && props.retrieveUserSuccess) {
      props.resetValues();
      const { id, username, email, imageUrl, active, serversList } = props.user;
      setId(id);
      setUsername(username);
      setEmail(email);
      setImageUrl(imageUrl);
      setEditUsername(username);
      setEditEmail(email);
      setEditImageUrl(imageUrl);
      setActive(active);
      setServersList(serversList);
      setAccountModalOpen(false);
      setIsLoading(false);
      props.findFriends({
        userId: id
      });
    } else if(props.user && props.retrieveUpdatedUserSuccess) {
      props.resetValues();
      const { id, username, email, imageUrl, active, serversList } = props.user;
      setId(id);
      setUsername(username);
      setEmail(email);
      setImageUrl(imageUrl);
      setEditUsername(username);
      setEditEmail(email);
      setEditImageUrl(imageUrl);
      setActive(active);
      setServersList(serversList);
      setAccountModalOpen(false);
      setIsLoading(false);
      props.findFriends({
        userId: id
      });
      if (openServerItem && serversList && serversList.length > 0) {
        const index = serversList.findIndex(x => x.serverId === openServerItem.serverId);
        if (index > -1) {
          setServer(openServerItem.name);
          setServerName(openServerItem.name);
          setServerId(openServerItem.serverId);
          setServerImage(openServerItem.imageUrl);
          setServerRegion(openServerItem.region);
          setCurrentFriend(null);
          props.findUserList({
            serverId: openServerItem.serverId
          });
          props.findUserBans({
            serverId: openServerItem.serverId
          });
          props.categoryFindAll({
            serverId: openServerItem.serverId
          });
          props.getChatrooms({
            serverId: openServerItem.serverId
          });
          setOpenServerItem(null);
        } else {
          setOpenServerItem(null);
          setServer('');
          setServerName('');
          setServerId(null);
          toast.info('You have been removed from the server by an admin!', { position: 'bottom-center' });
        }
      } else if (openServerItem && !serversList) {
        setOpenServerItem(null);
        setServer('');
        setServerName('');
        setServerId(null);
        toast.info('You have been removed from the server by an admin!', { position: 'bottom-center' });
      } else if (openServerItem && serversList && serversList.length < 1) {
        setOpenServerItem(null);
        setServer('');
        setServerName('');
        setServerId(null);
        toast.info('You have been removed from this server an admin!', { position: 'bottom-center' });
      }
    }
  }, [props, openServerItem, didMount]);

  const detectEscape = (event) => {
    if (event.keyCode === 27) {
      setSettingsOpen(false);
      setIsServerSettingsOpen(false);
      showServerSettings(false);
      setActiveServerSetting("overview");
      setActiveUserSetting("myaccount");
      setAccountModalOpen(false);
    }
  }

  if(props.logout) {
    return <Redirect push to="/" />;
  }

  const userLogout = () => {
    props.userLogout({ id: id });
  }

  const deleteServer = () => {
    // props.deleteServer({
    //   serverId: serverId
    // });
  }

  const toggleModal = (value) => {
    setModalOpen(true);
    setCurrentModal(value);
  }

  const refreshServerUsers = () => {
    props.findUserList({
      serverId: serverId
    });
    props.findUserBans({
      serverId: serverId
    });
  }

  const getUpdatedServerList = (closeModal) => {
    if (closeModal) {
      setModalOpen(false);
      toast.dismiss();
      toast.success('Success, the server was created!', { position: 'bottom-center' });
      props.getUpdatedUser({ userId: id });
    } else {
      toast.dismiss();
      toast.error('There was an error creating the server!', { position: 'bottom-center' });
    }
  }

  const setShowInviteModal = () => {
    setInviteModal(!inviteModal);
    showServerSettings(false);
    setInviteCode('');
    props.resetInviteValues();
  }

  const createInstantInvite = () => {
    props.inviteCreate({
      expires: expires,
      serverId: serverId
    });
  }

  const createNewServerInvite = () => {
    props.inviteEmailCreate({
      inviteCode: '',
      expires: expires,
      serverId: serverId,
      email: email
    });
  }

  const displayChannelModal = () => {
    setShowChannelModal(true);
    showServerSettings(false);
  }

  const createNewChannel = () => {
    props.chatroomCreate({
      name: newChannel,
      serverId: serverId,
      order: categories.length,
      visible: true
    });
  }

  const displayCategoryModal = () => {
    setShowCategoryModal(true);
    showServerSettings(false);
  }

  const displayNotificationSettingsModal = () => {
    setShowNotificationSettingsModal(!showNotificationSettingsModal);
    showServerSettings(false);
  }

  const displayPrivacyModal = () => {
    setShowPrivacyModal(!showPrivacyModal);
    showServerSettings(false);
  }

  const createNewCategory = () => {
    props.categoryCreate({
      name: newCategory,
      serverId: serverId,
      order: categories.length,
      visible: true
    });
    setNewCategory('');
  }

  const dragItem = (item, event) => {
    if (!isAdmin) return false;
    setCurrentDragItem(item);
    event.dataTransfer.setData("text", event.target.id);
  }

  const draggingOverItem = (event) => {
    if (!isAdmin) return false;
    event.preventDefault();
    event.stopPropagation();
  }

  const dropItem = (event) => {
    if (!isAdmin) return false;
    event.preventDefault();
    const newChatrooms = chatrooms || [];
    if (event.target.id !== currentDragItem.category && event.target.id) {
      for (let i = 0; i < newChatrooms.length; i++) {
        if (newChatrooms[i].categoryId === currentDragItem.categoryId && newChatrooms[i].name === currentDragItem.name) {
          newChatrooms[i] = {
            categoryId: +event.target.id.split('-')[0] === 0 ? null : +event.target.id.split('-')[0],
            id: currentDragItem.id,
            name: currentDragItem.name,
            serverId: currentDragItem.serverId
          }
          props.chatroomUpdate({
            chatroomId: currentDragItem.id,
            categoryId: +event.target.id.split('-')[0] === 0 ? null : +event.target.id.split('-')[0]
          });
          break;
        }
      }
      setChatrooms(newChatrooms);
      setTriggerReload(!triggerReload);
    }
  }

  const setItemVisibility = (group) => {
    for (let i = 0; i < categories.length; i++) {
      if (categories[i].name === group.name) {
        categories[i].visible = !categories[i].visible;
      }
    }
    setTriggerReload(!triggerReload);
  }

  const setServerProperties = (item) => {
    props.getUpdatedUser({ userId: id });
    setOpenServerItem(item);
  }

  const setCurrentActiveChatroom = (item, event) => {
    if (event) {
      event.stopPropagation();
    }
    setActiveChatroom(item.name);
    setActiveChatroomId(item.id);
  }

  const joinServer = (value) => {
    props.inviteVerification({
      userId: id,
      code: value,
      email: email
    });
  }

  const getInvites = () => {
    props.findInvites({
      serverId: serverId
    });
  }

  const privateMessageUser = (user) => {
    setServer('');
    props.friendCreate({
      userId: id,
      friendId: user.userId,
      username: user.username,
      friendUsername: username,
      imageUrl: user.imageUrl
    });
  }

  const deleteFriend = (event, friend) => {
    event.stopPropagation();
    setCurrentFriend(null);
    setServer('');
    props.friendDelete({
      userId: id,
      friendId: friend.friendId
    });
  }

  const clickSetCurrentFriend = (event, friend) => {
    event.stopPropagation();
    setCurrentFriend(friend);
  }

  const setHomeServer = () => {
    setServer('');
    props.findFriends({
      userId: id
    });
  }

  const setActiveServerUser = (user) => {
    setShowUserManagement(true);
    setServerUser(user);
  }

  const setActiveServerUserBan = (user) => {
    setShowUserManagementBan(true);
    setServerUserBan(user);
  }

  const setSaveServerUser = () => {
    const data = {
      active: true,
      imageUrl: null,
      type: serverUserRole,
      userId: serverUser.userId,
      username: serverUser.username,
      serverId: serverId
    }
    props.updateUserRole(data);
  }

  const setRemoveUserBan = () => {
    const data = {
      userId: serverUserBan.userId,
      serverId: serverId
    };
    props.unbanUser(data);
  }

  const leaveServer = () => {
    props.getUpdatedUser({ userId: id });
    setTriggerReload(!triggerReload);
    setServer('');
    setServerName('');
    setServerId(null);
    toast.info('You have been removed from the server by an admin!', { position: 'bottom-center' });
  }

  const saveAccountInfo = () => {
    const emailRegex = /^(([^<>()\]\\.,;:\s@"]+(\.[^<>()\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (!emailRegex.test(String(editEmail).toLowerCase())) {
      toast.dismiss();
      toast.error('Email address must be a valid!', { position: 'bottom-center' });
      return;
    } else if ((editUsername && editUsername.length < 2) || (editUsername && editUsername.length > 14) || !editUsername) {
      toast.dismiss();
      toast.error('Username does not meet the length requirements!', { position: 'bottom-center' });
    } else if (emailRegex.test(String(editEmail).toLowerCase())) {
      setIsLoading(true);
      const formData = new FormData();
      formData.append('id', id);
      formData.append('serverId', serverId);
      formData.append('imageUrl', editImageUrl);
      formData.append('mainFile', mainFile)
      formData.append('email', editEmail);
      formData.append('username', editUsername);
      props.userUpdate(formData);
    }
  }

  const showMainFile = (event) => {
    event.preventDefault();
    let reader = new FileReader();
    let file = event.target.files[0];

    reader.onloadend = () => {
      setMainFile(file);
      setEditImageUrl(reader.result);
    }
    reader.readAsDataURL(file);
  }

  if (isLoading) {
    return (
      <div className="loadingbackground">
        <Loading />
      </div>
    );
  }

  return (
    <div className="dashboard">
      <ToastMessage />
      {isModalOpen || showCategoryModal || showChannelModal || showNotificationSettingsModal || showPrivacyModal || inviteModal ? <span className="contentBackground"></span> : null}
      <div className="sidebar" onClick={() => { setCurrentFriend(null); }}>
        <div className="sidebar-container" onPointerOver={() => { setHover("Home") }} onPointerOut={() => { setHover('') }}>
          {hover === "Home" && server !== '' ? <span className="sidebar-hover"></span> : null}
          {server === '' ? <span className="sidebar-select"></span> : null}
          <img className="sidebar-logo" src={chatot} alt="chatter-icon-logo" onClick={() => { setHomeServer(); }} />
          {hover === "Home" ? <span className="tooltip"><span>Home</span></span> : null}
        </div>
        <div className="sidebar-border" />
        {serversList && serversList.length > 0 ? serversList.map((item, index)  => {
          return (
            <div key={index} className="sidebar-container" onPointerOver={() => { setHover(item.name) }} onPointerOut={() => { setHover('') }}>
              {hover === item.name && server !== item.name && server !== "Home" ? <span className="sidebar-hover"></span> : null}
              {server === item.name ? <span className="sidebar-select"></span> : null}
              <img className="sidebar-logo" src={item.imageUrl ? item.imageUrl : chatot} alt="chatter-icon" onClick={() => { setServerProperties(item); }} />
              {hover === item.name ? <span className="tooltip"><span>{item.name}</span></span> : null}
            </div>
          )
        }) : null}
      </div>
      {server === '' ?
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
          <div className="sidebarleft-listfriends">
            {friendsList && friendsList.length ? friendsList.map((item, index) => {
              if (item.activeFriend) {
                return (
                  <div key={index} className={currentFriend && item.username === currentFriend.username ? "sidebarleft-currentfriend-active" : "sidebarleft-currentfriend"} onClick={(event) => { clickSetCurrentFriend(event, item); }}>
                    <img className="sidebarleft-currentfriend-image" src={item.imageUrl ? item.imageUrl : chatot} alt="username-icon" />
                    <span className="sidebarleft-currentfriend-username">{item.username}</span>
                    <span className="sidebarleft-currentfriend-remove" onClick={(event) => { deleteFriend(event, item); }}>&#10005;</span>
                  </div>
                );
              } else {
                return null;
              }
            }) : null}
          </div>
          <div className="userinfo">
            <div className="username">
              <img className="username-image" src={imageUrl ? imageUrl : chatot} alt="username-icon" />
            </div>
            {active ? <div className="userinfo-online"></div> : null}
            <span style={{ color: 'white' }}>{username}</span>
            <img className="settings-image" src={settings} alt="settings-icon" onClick={() => { setSettingsOpen(!isSettingsOpen); }} />
          </div>
        </div> :
        <div className="sidebarleftchat">
          <div className="sidebarleftchat-container">
            <p className="sidebarleftchat-container-header">{server}</p>
            {isAdmin ? <div className="sidebarleftchat-container-dropdown" onClick={() => { showServerSettings(!serverSettings); }}>{!serverSettings ? <i className="channelarrow down"></i> : <span className="cancel">&#10005;</span>}</div> : null}
            {serverSettings ?
              <div className="serversettings-modal">
                <div className="serversettings-modal-section" onClick={() => { setShowInviteModal(); }}>
                  <img src={invite} alt="invite-people" height={25} width={25} />
                  <span>Invite People</span>
                </div>
                <div className="serversettings-modal-section" onClick={() => { setIsServerSettingsOpen(!isServerSettingsOpen); }}>
                  <img src={serversettings} alt="server-settings" height={25} width={25} />
                  <span>Server Settings</span>
                </div>
                <div className="serversettings-modal-section" onClick={() => {
                  displayChannelModal();
                }}>
                  <img src={createchannel} alt="server-settings" height={25} width={25} />
                  <span>Create Channel</span>
                </div>
                <div className="serversettings-modal-section" onClick={() => { displayCategoryModal(); }}>
                  <img src={category} alt="server-settings" height={25} width={25} />
                  <span>Create Category</span>
                </div>
                <div className="serversettings-modal-section" onClick={() => { displayNotificationSettingsModal(); }}>
                  <img src={notification} alt="server-settings" height={25} width={25} />
                  <span>Notification Settings</span>
                </div>
                <div className="serversettings-modal-section" onClick={() => { displayPrivacyModal(); }}>
                  <img src={privacylock} alt="server-settings" height={25} width={25} />
                  <span>Privacy Settings</span>
                </div>
              </div>
            : null}
          </div>

          {inviteModal ?
            <InviteModal
              expires={expires}
              inviteEmail={inviteEmail}
              inviteCode={inviteCode}
              setTimeExpires={(value) => { setExpires(value); }}
              createNewInvite={() => { createNewServerInvite(); }}
              setShowInviteModal={() => { setShowInviteModal(false); }}
              createNewInstantInvite={() => { createInstantInvite(); }}
              setCurrentInviteEmail={(value) => { setInviteEmail(value); }}
            />
          : null}

          {showChannelModal ?
            <ChannelModal
              newChannel={newChannel}
              setNewChannel={(event) => { setNewChannel(event.target.value); }}
              setShowChannelModal={() => { setShowChannelModal(false); }}
              createNewChannel={() => { createNewChannel(); }}
            />
          : null}

          {showCategoryModal ?
            <CategoryModal
              newCategory={newCategory}
              setNewCategory={(event) => { setNewCategory(event.target.value); }}
              setShowCategoryModal={() => { setShowCategoryModal(false); }}
              createNewCategory={() => { createNewCategory(); }}
            />
          : null}

          {showPrivacyModal ?
            <PrivacyModal
              server={server}
              allowDirectMessages={allowDirectMessages}
              setAllowDirectMessages={() => { setAllowDirectMessages(true); }}
              setShowPrivacyModal={() => { setShowPrivacyModal(false); }}
            />
          : null}

          {showNotificationSettingsModal ?
            <NotificationSettingsModal
              server={server}
              setShowNotificationSettingsModal={() => { setShowNotificationSettingsModal(false); }}
            />
          : null}

          <div className="sidebarleft-mainchat" style={{ marginTop: chatrooms && chatrooms.length ? '0.5rem' : '0rem' }}>
            <div onDrop={(event) => { dropItem(event); }} onDragOver={(event) => { draggingOverItem(event); }} id={0 + "-" + server}>
              {chatrooms && chatrooms.length > 0 ? chatrooms.filter(chatroom => chatroom.categoryId === null).map((item, index) => {
                return (
                  <div className={activeChatroom === item.name ? "active" : ''} key={index} id={0 + "-" + item.name} draggable="true" onDragStart={(event) => { dragItem(item, event); }} onClick={() => { setCurrentActiveChatroom(item); }}>
                    <img src={numbersign} alt="channel" height={16} width={16} /><span>{item.name}</span>
                  </div>
                )
              }) : null}
            </div>

            {categories && categories.length ? categories.map((group, categoryIndex) => {
              const height = chatrooms.filter(chatroom => chatroom.categoryId === group.id).length;
              const itemHeight = group.visible === true ? `${height * 2}rem` : '0rem';
              return (
                <div key={categoryIndex} style={{ marginBottom: itemHeight }}>
                  <span
                    className="sidebarleft-mainchat-dropdown"
                    onClick={() => { setItemVisibility(group); }}
                  >
                    {group.visible ? <i className="arrow down"></i> : <i className="arrow right"></i>}
                    <span>{group.name}</span>
                    {group.visible ?
                    <div onDrop={(event) => { dropItem(event); }} onDragOver={(event) => { draggingOverItem(event); }} id={group.id + "-" + group.name}>
                      {chatrooms && chatrooms.length > 0 ? chatrooms.filter(chatroom => chatroom.categoryId === group.id).map((item, index) => {
                        return (
                          <div className={activeChatroom === item.name ? "active" : "inactive"} id={item.categoryId + "-" + item.name} key={index} draggable="true" onDragStart={(event) => { dragItem(item, event); }} onClick={(event) => { setCurrentActiveChatroom(item, event); }}>
                            <img src={numbersign} alt="channel" height={16} width={16} /><span>{item.name}</span>
                          </div>
                        );
                      }) : null}
                    </div> : null}
                  </span>
                </div>
              );
            }) : null}

          </div>
        </div>
      }

      {server !== '' && activeChatroom !== '' && activeChatroomId !== null ?
        <Chatroom
          activeChatroom={activeChatroom}
          activeChatroomId={activeChatroomId}
          userId={id}
          serverId={serverId}
          username={username}
          serverUserList={serverUserList}
          refreshServerUsers={refreshServerUsers}
          privateMessageUser={(user) => { privateMessageUser(user) }}
          leaveServer={() => { leaveServer(); }}
        />
      : null}

      {server === '' && currentFriend !== null ?
        <ChatroomFriend
          groupId={currentFriend.groupId}
          userId={id}
          username={username}
          friendId={currentFriend.friendId}
          friendUsername={currentFriend.username}
        />
      : null}

      {server === '' && currentFriend === null ?
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
      : null}

      {isServerSettingsOpen ?
        <div className="serversettings">
          {isChangingRegion || showUserManagement || showUserManagementBan ? <span className="contentBackground"></span> : null}
          <div className="serversettings-sidebar">
            <h1>Server Settings</h1>
            <p className={activeServerSetting === "overview" ? "serversettings-sidebar-activeitem" : "serversettings-sidebar-overview"} onClick={() => { setActiveServerSetting("overview"); }}>Overview</p>
            <p className={activeServerSetting === "moderation" ? "serversettings-sidebar-activeitem" : "serversettings-sidebar-moderation"} onClick={() => { setActiveServerSetting("moderation"); }}>Moderation</p>
            <p className={activeServerSetting === "activitylog" ? "serversettings-sidebar-activeitem" : "serversettings-sidebar-activitylog"} onClick={() => { setActiveServerSetting("activitylog"); }}>Activity Log</p>
            <p className={activeServerSetting === "roles" ? "serversettings-sidebar-activeitem" : "serversettings-sidebar-roles"} onClick={() => { setActiveServerSetting("roles"); }}>Roles</p>
            <h1>User Management</h1>
            <p className={activeServerSetting === "members" ? "serversettings-sidebar-activeitem" : "serversettings-sidebar-members"} onClick={() => { setActiveServerSetting("members"); }}>Members</p>
            <p className={activeServerSetting === "invites" ? "serversettings-sidebar-activeitem" : "serversettings-sidebar-invites"} onClick={() => { getInvites(); }}>Invites</p>
            <p className={activeServerSetting === "bans" ? "serversettings-sidebar-activeitem" : "serversettings-sidebar-bans"} onClick={() => { setActiveServerSetting("bans"); }}>Bans</p>
            <p onClick={deleteServer}>Delete Server</p>
          </div>
          <div className="serversettings-servercontainer">
            {activeServerSetting === "overview" ?
              <div className="serversettings-myserver">
                <h1>Server Overview</h1>
                <div className="serversettings-myserver__container">
                  <div className="serversettings-myserver__container-image">
                    <img src={serverImage ? serverImage : chatot} alt="server-icon" />
                  </div>
                  <div className="serversettings-myserver__container-info">
                    <div className="serversettings-myserver__container-info-server">
                      <span>Server Name</span><br/>
                      <input onChange={(event) => setServerName(event.target.value)} value={serverName} />
                    </div>
                    <div className="serversettings-myserver__container-info-region">
                      <span>Server Region</span><br/>
                      <div className="servermodalregion-select">
                        {serverRegion === "US West" || serverRegion === "US Central" || serverRegion === "US East" ? <img src={usregion} height={35} width={55} alt="server-region" /> : null}
                        {serverRegion === "Central Europe" || serverRegion === "Western Europe" ? <img src={europe} height={35} width={55} alt="server-region" /> : null}
                        {serverRegion === "Russia" ? <img src={russia} height={35} width={55} alt="server-region" /> : null}
                        <span className="servermodalregion-select-current">{serverRegion}</span>
                        <span className="servermodalregion-select-change" onClick={() => { setIsChangingRegion(true); }}>Change</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            : null}

            {activeServerSetting === "members" ?
              <div className="serversettings-members">
                {showUserManagement ?
                  <UserManagement
                    serverUser={serverUser}
                    serverUserRole={serverUserRole}
                    setShowUserManagement={() => { setShowUserManagement(false); setServerUserRole("admin"); setServerUser(null); }}
                    setServerUserRole={(role) => { setServerUserRole(role); }}
                    setSaveServerUser={setSaveServerUser}
                  />
                : <div>
                    <h1 className="serversettings-members-title">Server Members</h1>
                    <p className="serversettings-members-count">{serverUserList.length} Members</p>
                    {serverUserList && serverUserList.length > 0 ? serverUserList.map((item, index)  => {
                      if (item.type === "owner") {
                        return (
                          <div key={index} className="serversettings-owner">
                            <img className="serversettings-logo" src={item.imageUrl ? item.imageUrl : chatot} alt="chatter-icon" />
                            <span>
                              <p>{item.type}</p>
                              <p>{item.username}</p>
                            </span>
                            <span className="serversettings-add">
                              <img src={owner} alt="add-icon" className="serversettings-user-add-image" />
                            </span>
                          </div>
                        )
                      } else {
                        return (
                          <div key={index} className="serversettings-user" onClick={() => { setActiveServerUser(item); }}>
                            <img className="serversettings-logo" src={item.imageUrl ? item.imageUrl : chatot} alt="chatter-icon" />
                            <span>
                              <p>{item.type}</p>
                              <p>{item.username}</p>
                            </span>
                            <span className="serversettings-add">
                              <img src={add} alt="add-icon" className="serversettings-user-add-image" />
                            </span>
                          </div>
                        )
                      }
                    }) : null}
                  </div>
                }
              </div>
            : null}

            {activeServerSetting === "invites" ?
              <div className="serversettings-invites">
                <h1>Server Invites</h1>
                <p className="serversettings-invites-count">{serverInvites.length === 1 ? '1 Invite' : `${serverInvites.length} Invites`} </p>
                {serverInvites && serverInvites.length > 0 ? serverInvites.map((item, index)  => {
                  return (
                    <div key={index} className="serversettings-invite">
                      <span>
                        <p>Code: {item.code}</p>
                        <p>
                          Created: <Moment format="MM/DD/YYYY" date={item.createdAt} /> at <Moment date={item.createdAt} format="LT" />
                        </p>
                        <p>Expiration: {item.expires} hours</p>
                      </span>
                      <span className="serversettings-add">
                        <img src={add} alt="add-icon" className="serversettings-invite-add-image" />
                      </span>
                    </div>
                  )
                }) : null}
              </div>
            : null}

            {activeServerSetting === "bans" ?
              <div className="serversettings-bans">
                {showUserManagementBan ?
                  <UserBans
                    serverUserBan={serverUserBan}
                    setShowUserManagementBan={() => { setShowUserManagementBan(false); setServerUserBan(null); }}
                    setRemoveUserBan={setRemoveUserBan}
                  />
                : <div>
                    <h1 className="serversettings-bans-title">Server Bans</h1>
                    <p className="serversettings-bans-count">{serverUserBans.length} Bans</p>
                    {serverUserBans && serverUserBans.length > 0 ? serverUserBans.map((item, index)  => {
                      if (item.type === "owner") {
                        return (
                          <div key={index} className="serversettings-owner">
                            <img className="serversettings-logo" src={item.imageUrl ? item.imageUrl : chatot} alt="chatter-icon" />
                            <span>
                              <p>{item.type}</p>
                              <p>{item.username}</p>
                            </span>
                            <span className="serversettings-add">
                              <img src={owner} alt="add-icon" className="serversettings-user-add-image" />
                            </span>
                          </div>
                        )
                      } else {
                        return (
                          <div key={index} className="serversettings-user" onClick={() => { setActiveServerUserBan(item); }}>
                            <img className="serversettings-logo" src={item.imageUrl ? item.imageUrl : chatot} alt="chatter-icon" />
                            <span>
                              <p>{item.type}</p>
                              <p>{item.username}</p>
                            </span>
                            <span className="serversettings-add">
                              <img src={add} alt="add-icon" className="serversettings-user-add-image" />
                            </span>
                          </div>
                        )
                      }
                    }) : null}
                  </div>
                }
              </div>
            : null}

            <div className="serversettings-escape" onClick={() => { setIsServerSettingsOpen(!isServerSettingsOpen); showServerSettings(false); setActiveServerSetting("overview"); setShowUserManagementBan(false); setShowUserManagement(false); }}>
            </div>
            <p className="serversettings-escapetext" onClick={() => { setIsServerSettingsOpen(!isServerSettingsOpen); showServerSettings(false); setActiveServerSetting("overview"); setShowUserManagementBan(false); setShowUserManagement(false); }}>ESC</p>
          </div>

          {isChangingRegion ?
            <RegionModal
              setIsChangingRegion={() => { setIsChangingRegion(false); }}
              setServerRegion={(region) => { setServerRegion(region); setIsChangingRegion(false); }}
            />
          : null}

        </div>
      : null}

      {isSettingsOpen ?
        <div className="usersettings">
          {accountModalOpen ? <span className="contentBackground"></span> : null}
          <div className="usersettings-sidebar">
            <h1>User Settings</h1>
            <p className={activeUserSetting === "myaccount" ? "usersettings-sidebar-activeitem" : "usersettings-sidebar-myaccount"} onClick={() => { setActiveUserSetting("myaccount"); }}>My Account</p>
            <p className={activeUserSetting === "privacy" ? "usersettings-sidebar-activeitem" : "usersettings-sidebar-privacy"} onClick={() => { setActiveUserSetting("privacy"); }}>Privacy &amp; Safety</p>
            <p className={activeUserSetting === "connections" ? "usersettings-sidebar-activeitem" : "usersettings-sidebar-connections"} onClick={() => { setActiveUserSetting("connections"); }}>Connections</p>
            <h1>App Settings</h1>
            <p className={activeUserSetting === "voice" ? "usersettings-sidebar-activeitem" : "usersettings-sidebar-voice"} onClick={() => { setActiveUserSetting("voice"); }}>Voice &amp; Video</p>
            <p className={activeUserSetting === "notifications" ? "usersettings-sidebar-activeitem" : "usersettings-sidebar-notifications"} onClick={() => { setActiveUserSetting("notifications"); }}>Notifications</p>
            <p className={activeUserSetting === "appearance" ? "usersettings-sidebar-activeitem" : "usersettings-sidebar-appearance"} onClick={() => { setActiveUserSetting("appearance"); }}>Appearance</p>
            <p className={activeUserSetting === "language" ? "usersettings-sidebar-activeitem" : "usersettings-sidebar-language"} onClick={() => { setActiveUserSetting("language"); }}>Language</p>
            <p onClick={userLogout}>Logout</p>
          </div>

          {activeUserSetting === "myaccount" ?
            <div className="usersettings-accountcontainer">
              {accountModalOpen ?
                <EditAccount
                  editUsername={editUsername}
                  editEmail={editEmail}
                  editImageUrl={editImageUrl}
                  setEditUsername={(value) => { setEditUsername(value); }}
                  setEditEmail={(value) => { setEditEmail(value); }}
                  setEditImageUrl={(value) => { setEditImageUrl(value); }}
                  saveAccountInfo={saveAccountInfo}
                  setAccountModalOpen={() => { setAccountModalOpen(false); }}
                  showMainFile={(event) => { showMainFile(event) }}
                />
              : <div>
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
                      <div className="usersettings-myaccount__container-edit" onClick={() => { setAccountModalOpen(true); }}>
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
                </div>
              }
            </div>
          : null}

          <div className="usersettings-escape" onClick={() => { setActiveUserSetting("myaccount"); setSettingsOpen(false); }}>
          </div>
          <p className="usersettings-escapetext" onClick={() => { setActiveUserSetting("myaccount"); setSettingsOpen(false); }}>ESC</p>
        </div>
      : null}

      {isModalOpen && currentModal === "create" ?
        <CreateServer
          id={id}
          region={region}
          setRegion={(region) => { setRegion(region) }}
          setModalOpen={() => { setModalOpen(!isModalOpen) }}
          getUpdatedServerList={(closeModal) => { getUpdatedServerList(closeModal) }}
        />
      : null}

      {isModalOpen && currentModal === "join" ?
        <JoinServer
          joinServer={(value) => { joinServer(value); }}
          setModalOpen={() => { setModalOpen(!isModalOpen) }}
        />
      : null}
    </div>
  );
}

const mapStateToProps = ({ usersReducer, serversReducer, categoriesReducer, chatroomsReducer, invitesReducer, friendsReducer }) => {
  return {
    error: usersReducer.error,
    isLoading: usersReducer.isLoading,
    success: usersReducer.success,
    logout: usersReducer.logout,
    user: usersReducer.user,
    users: usersReducer.users,
    retrieveUserError: usersReducer.retrieveUserError,
    retrieveUserSuccess: usersReducer.retrieveUserSuccess,
    retrieveUpdatedUserError: usersReducer.retrieveUpdatedUserError,
    retrieveUpdatedUserSuccess: usersReducer.retrieveUpdatedUserSuccess,
    serversList: serversReducer.serversList,
    serverUserList: serversReducer.serverUserList,
    serverUserBans: serversReducer.serverUserBans,
    updateRoleSuccess: serversReducer.updateRoleSuccess,
    updateRoleError: serversReducer.updateRoleError,
    categoryList: categoriesReducer.categoryList,
    chatroomList: chatroomsReducer.chatroomList,
    chatroomSuccess: chatroomsReducer.success,
    chatroomError: chatroomsReducer.error,
    inviteEmailError: invitesReducer.inviteEmailError,
    inviteEmailSuccess: invitesReducer.inviteEmailSuccess,
    inviteCode: invitesReducer.inviteCode,
    verifySuccess: invitesReducer.verifySuccess,
    verifyError: invitesReducer.verifyError,
    inviteServersList: invitesReducer.inviteServersList,
    findInvitesSuccess: invitesReducer.findInvitesSuccess,
    findInvitesError: invitesReducer.findInvitesError,
    createFriendSuccess: friendsReducer.createFriendSuccess,
    deleteFriendSuccess: friendsReducer.deleteFriendSuccess,
    findFriendsSuccess: friendsReducer.findFriendsSuccess,
    friendsList: friendsReducer.friendsList
  };
}

export default connect(mapStateToProps, actions)(Dashboard);