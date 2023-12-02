import React, { useRef, useEffect, useState, useDispatch } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { connect } from 'react-redux';
import * as actions from '../../redux';
import { ROOT_URL } from '../../config/networkSettings';
import io from "socket.io-client";
import './AuthNavigation.css';
import manage from '../../assets/images/manage.png';
import editprofile from '../../assets/images/editaccount.png';
import chatroom from '../../assets/images/chatroom.png';
import menu from '../../assets/images/hamburger-menu.png';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import { resetUserValues } from '../../redux/modules/users/users';
import useOnClickOutside from '../../utils/useOnClickOutside';

const AuthNavigation = (props) => {
  const [visible, setVisible] = useState(false);
  const [navSideMenu, setNavSideMenu] = useState(false);
  const [username, setUsername] = useState('');
  const [user, setUser] = useState(null);

  const dispatch = useDispatch();

  const ref = useRef();
  useOnClickOutside(ref, () => setNavSideMenu(false));

  useEffect(() => {
    this.props.currentUser();

    this.socket = io(ROOT_URL);

    if (props.user) {
      const { username, type } = props.user;

      setUsername(username);
      setUser(props.user);
      if (type === 'admin') {
        setVisible(true);
      }
    }

    if (props.logout) {
      this.socket.emit('GET_USERS');
      dispatch(resetUserValues());
      return <Navigate to="/" />;
    }
  }, [props, dispatch]);

  useEffect(() => {
    this.socket.disconnect(true);
  }, []);

  const logout = async() => {
    await this.props.userLogout(user);
    this.socket.emit('LOGOUT_USER', {
      username: username,
      active: false
    });
  }

  const toggleNavMenu = () => {
    this.setState({ navSideMenu: !navSideMenu });
  }

  return (
    <div>
      <div className="navbarDashboard" onClick={toggleNavMenu()}>
        <div className="navbarDashboard-link">
          <img className="navbarDashboard-home" src={menu} alt="menu-icon" style={{ height: '1.5rem', width: '2.5rem', marginTop: '1.3rem' }} />
        </div>
      </div>
      <ReactCSSTransitionGroup
        transitionName="slider"
        transitionAppear={true}
        transitionAppearTimeout={500}
        transitionEnterTimeout={500}
        transitionLeaveTimeout={500}
      >
        {this.state.navSideMenu ?
          <div className="navSideMenu" onClick={this.toggleNavMenu}>
            <div className="menu-links">
              <Link to="/Chatroom"><img className="navbarDashboard-authlink" src={chatroom} alt="user-icon" style={{ height: '2.5rem', width: '18.9rem', marginTop: '1.5rem', paddingBottom: '1.5rem', paddingLeft: '1.5rem', paddingRight: '1.5rem', borderBottom: '1px solid white' }} /></Link>
              <Link to="/Profile"><img className="navbarDashboard-authlink" src={editprofile} alt="user-icon" style={{ height: '3.5rem', width: '18.9rem', marginTop: '1.5rem', paddingBottom: '1.5rem', paddingLeft: '1.5rem', paddingRight: '1.5rem', borderBottom: '1px solid white' }} /></Link>
              <Link to="/Manage"><img className="navbarDashboard-authlink" src={manage} alt="user-icon" style={{ display: (visible === false ? 'none' : 'flex'), height: '3.5rem', width: '18.9rem', marginTop: '1.5rem', paddingBottom: '1.5rem', paddingLeft: '1.5rem', paddingRight: '1.5rem', borderBottom: '1px solid white' }} /></Link>
              <img className="navbarDashboard-authlink" src={logout} alt="user-icon" style={{ height: '3.5rem', width: '18.9rem', marginTop: '1.5rem', paddingBottom: '1.5rem', paddingLeft: '1.5rem', paddingRight: '1.5rem', borderBottom: '1px solid white' }} onClick={this.logout} />
            </div>
          </div>
        : null}
      </ReactCSSTransitionGroup>
    </div>
  );
}

function mapStateToProps({ user }) {
  return {
    error: user.error,
    isLoading: user.isLoading,
    success: user.success,
    logout: user.logout,
    user: user.user,
  };
}

export default connect(mapStateToProps, actions)(AuthNavigation);
