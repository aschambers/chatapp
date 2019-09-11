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
import CreateServer from '../../components/CreateServer/CreateServer';
import JoinServer from '../../components/JoinServer/JoinServer';
import CategoryModal from '../../components/CategoryModal/CategoryModal';
import ChannelModal from '../../components/ChannelModal/ChannelModal';
import InviteModal from '../../components/InviteModal/InviteModal';
import NotificationSettingsModal from '../../components/NotificationSettingsModal/NotificationSettingsModal';
import PrivacyModal from '../../components/PrivacyModal/PrivacyModal';
import RegionModal from '../../components/RegionModal/RegionModal';
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

const Dashboard = (props) => {
  const [id, setId] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [active, setActive] = useState(false);
  const [server, setServer] = useState('');
  const [serverName, setServerName] = useState('');
  const [serverId, setServerId] = useState(null);
  const [serverImage, setServerImage] = useState("");
  const [serverRegion, setServerRegion] = useState("");
  const [serverUserList, setServerUserList] = useState([]);
  const [hover, setHover] = useState('');
  const [isSettingsOpen, setSettingsOpen] = useState(false);
  const [isServerSettingsOpen, setIsServerSettingsOpen] = useState(false);
  const [isModalOpen, setModalOpen] = useState(false);
  const [currentModal, setCurrentModal] = useState("");
  const [region, setRegion] = useState("US West");
  const [serversList, setServersList] = useState([]);
  const [serverSettings, showServerSettings] = useState(false);
  const [inviteModal, setInviteModal] = useState(false);
  const [expires, setExpires] = useState(24);
  const [showChannelModal, setShowChannelModal] = useState(false);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);
  const [showNotificationSettingsModal, setShowNotificationSettingsModal] = useState(false);
  const [newCategory, setNewCategory] = useState("");
  const [newChannel, setNewChannel] = useState("");
  const [triggerReload, setTriggerReload] = useState(false);
  const [categories, setCategories] = useState([]);
  const [currentDragItem, setCurrentDragItem] = useState(null);
  const [chatrooms, setChatrooms] = useState([]);
  const [activeChatroom, setActiveChatroom] = useState("");
  const [activeChatroomId, setActiveChatroomId] = useState(null);
  const [isChangingRegion, setIsChangingRegion] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteCode, setInviteCode] = useState("");
  const [activeServerSetting, setActiveServerSetting] = useState("overview");
  const [activeUserSetting, setActiveUserSetting] = useState("myaccount");
  const [isAdmin, setIsAdmin] = useState(false);
  const [serverInvites, setServerInvites] = useState([]);
  const [allowDirectMessages, setAllowDirectMessages] = useState(false);

  const ref = useRef();
  useOnClickOutside(ref, () => setShowCategoryModal(false));

  useEffect(() => {
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
    if(!props.user) {
      props.currentUser();
      window.addEventListener('keydown', detectEscape);
    } else if(props.user) {
      const { id, username, email, imageUrl, active, serversList } = props.user;
      setId(id);
      setUsername(username);
      setEmail(email);
      setImageUrl(imageUrl);
      setActive(active);
      setServersList(serversList);
    }
  }, [props, id, username]);

  const detectEscape = (event) => {
    if (event.keyCode === 27) {
      setSettingsOpen(false);
      setIsServerSettingsOpen(false);
      showServerSettings(false);
      setActiveServerSetting("overview");
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
    setInviteCode("");
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
      inviteCode: "",
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
    setServer(item.name);
    setServerName(item.name);
    setServerId(item.serverId);
    setServerImage(item.imageUrl);
    setServerRegion(item.region);
    props.findUserList({
      serverId: item.serverId
    });
    props.categoryFindAll({
      serverId: item.serverId
    });
    props.getChatrooms({
      serverId: item.serverId
    });
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
    setServer("");
    console.log(user);
  }

  return (
    <div className="dashboard">
      <ToastMessage />
      {isModalOpen || showCategoryModal || showChannelModal || showNotificationSettingsModal || showPrivacyModal || inviteModal ? <span className="contentBackground"></span> : null}
      <div className="sidebar">
        <div className="sidebar-container" onPointerOver={() => { setHover("Home") }} onPointerOut={() => { setHover("") }}>
          {hover === "Home" && server !== "" ? <span className="sidebar-hover"></span> : null}
          {server === "" ? <span className="sidebar-select"></span> : null}
          <img className="sidebar-logo" src={chatot} alt="chatter-icon-logo" onClick={() => { setServer("") }} />
          {hover === "Home" ? <span className="tooltip"><span>Home</span></span> : null}
        </div>
        <div className="sidebar-border" />
        {serversList && serversList.length > 0 ? serversList.map((item, index)  => {
          return (
            <div key={index} className="sidebar-container" onPointerOver={() => { setHover(item.name) }} onPointerOut={() => { setHover("") }}>
              {hover === item.name && server !== item.name && server !== "Home" ? <span className="sidebar-hover"></span> : null}
              {server === item.name ? <span className="sidebar-select"></span> : null}
              <img className="sidebar-logo" src={item.imageUrl ? item.imageUrl : chatot} alt="chatter-icon" onClick={() => { setServerProperties(item); }} />
              {hover === item.name ? <span className="tooltip"><span>{item.name}</span></span> : null}
            </div>
          )
        }) : null}
      </div>
      {server === "" ?
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
        </div> :
        <div className="sidebarleft">
          <div className="sidebarleft-container">
            <p className="sidebarleft-container-header">{server}</p>
            {isAdmin ? <div className="sidebarleft-container-dropdown" onClick={() => { showServerSettings(!serverSettings); }}>{!serverSettings ? <i className="channelarrow down"></i> : <span className="cancel">&#10005;</span>}</div> : null}
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
              setNewChannel={(event) => { setNewChannel(event.target.value); }}
              setShowChannelModal={() => { setShowChannelModal(false); }}
              createNewChannel={() => { createNewChannel(); }}
            />
          : null}

          {showCategoryModal ?
            <CategoryModal
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
                  <div className={activeChatroom === item.name ? "active" : ""} key={index} id={0 + "-" + item.name} draggable="true" onDragStart={(event) => { dragItem(item, event); }} onClick={() => { setCurrentActiveChatroom(item); }}>
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

      {server !== "" ?
        <Chatroom 
          activeChatroom={activeChatroom}
          activeChatroomId={activeChatroomId}
          userId={id}
          serverId={serverId}
          username={username}
          serverUserList={serverUserList}
          privateMessageUser={(user) => { privateMessageUser(user) }} /> :
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

      {isServerSettingsOpen ?
        <div className="serversettings">
          {isChangingRegion ? <span className="contentBackground"></span> : null}
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
                <h1>Server Members</h1>
                <p className="serversettings-members-count">{serverUserList.length} Members</p>
                {serverUserList && serverUserList.length > 0 ? serverUserList.map((item, index)  => {
                  return (
                    <div key={index} className="serversettings-user">
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
                }) : null}
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
                        <p>Created: <Moment format="MM/DD/YYYY">{item.createdAt}</Moment> at <Moment format="LT">{item.createdAt}</Moment></p>
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

            <div className="serversettings-escape" onClick={() => { setIsServerSettingsOpen(!isServerSettingsOpen); showServerSettings(false); setActiveServerSetting("overview"); }}>
              <span>&#215;</span>
              <p>ESC</p>
            </div>
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
          <div className="usersettings-sidebar">
            <h1>User Settings</h1>
            <p className={activeUserSetting === "myaccount" ? "usersettings-sidebar-activeitem" : "usersettings-sidebar-myaccount"} onClick={() => { setActiveUserSetting("myaccount"); }}>My Account</p>
            <p className={activeUserSetting === "privacy" ? "usersettings-sidebar-activeitem" : "usersettings-sidebar-privacy"} onClick={() => { setActiveUserSetting("privacy"); }}>Privacy &amp; Safety</p>
            <p className={activeUserSetting === "connections" ? "usersettings-sidebar-activeitem" : "usersettings-sidebar-connections"} onClick={() => { setActiveUserSetting("connections"); }}>Connections</p>
            <p className={activeUserSetting === "billing" ? "usersettings-sidebar-activeitem" : "usersettings-sidebar-billing"} onClick={() => { setActiveUserSetting("billing"); }}>Billing</p>
            <h1>App Settings</h1>
            <p className={activeUserSetting === "voice" ? "usersettings-sidebar-activeitem" : "usersettings-sidebar-voice"} onClick={() => { setActiveUserSetting("voice"); }}>Voice &amp; Video</p>
            <p className={activeUserSetting === "notifications" ? "usersettings-sidebar-activeitem" : "usersettings-sidebar-notifications"} onClick={() => { setActiveUserSetting("notifications"); }}>Notifications</p>
            <p className={activeUserSetting === "appearance" ? "usersettings-sidebar-activeitem" : "usersettings-sidebar-appearance"} onClick={() => { setActiveUserSetting("appearance"); }}>Appearance</p>
            <p className={activeUserSetting === "language" ? "usersettings-sidebar-activeitem" : "usersettings-sidebar-language"} onClick={() => { setActiveUserSetting("language"); }}>Language</p>
            <p onClick={userLogout}>Logout</p>
          </div>

          {activeUserSetting === "myaccount" ?
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
            </div>
          : null}

          <div className="usersettings-escape" onClick={() => { setSettingsOpen(!isSettingsOpen); }}>
            <span>&#215;</span>
            <p>ESC</p>
          </div>
        </div>
      : null}

      {isModalOpen && currentModal === "create" ?
        <CreateServer id={id} region={region} setRegion={(region) => { setRegion(region) }} setModalOpen={() => { setModalOpen(!isModalOpen) }} getUpdatedServerList={(closeModal) => { getUpdatedServerList(closeModal) }} />
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

const mapStateToProps = ({ usersReducer, serversReducer, categoriesReducer, chatroomsReducer, invitesReducer }) => {
  return {
    error: usersReducer.error,
    isLoading: usersReducer.isLoading,
    success: usersReducer.success,
    logout: usersReducer.logout,
    user: usersReducer.user,
    users: usersReducer.users,
    serversList: serversReducer.serversList,
    serverUserList: serversReducer.serverUserList,
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
    findInvitesError: invitesReducer.findInvitesError
  };
}

export default connect(mapStateToProps, actions)(Dashboard);