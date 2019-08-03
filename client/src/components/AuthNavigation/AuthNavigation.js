import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { withRouter } from 'react-router';
import { connect } from 'react-redux';
import * as actions from '../../redux';
import { ROOT_URL } from '../../config/networkSettings';
import io from "socket.io-client";
import './AuthNavigation.css';
import manage from '../../assets/images/manage.png';
import editprofile from '../../assets/images/editaccount.png';
import chatroom from '../../assets/images/chatroom.png';
import logout from '../../assets/images/logout.png';
import menu from '../../assets/images/hamburger-menu.png';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import onClickOutside from "react-onclickoutside";

class AuthNavigation extends Component {
  constructor(props) {
    super(props);

    this.state = {
      visible: false,
      navSideMenu: false,
      username: '',
      user: null
    }
  }

  componentDidMount() {
    this.props.currentUser();

    this.socket = io(ROOT_URL);
  }

  async componentWillReceiveProps(nextProps) {
    if(nextProps.user) {
      const { username, type } = nextProps.user;

      this.setState({ username: username, user: nextProps.user });
      if(type === 'admin') {
        this.setState({ visible: true });
      }
    }

    if(nextProps.logout) {
      await this.socket.emit('GET_USERS');
      await this.props.resetUserValues();
      this.props.history.push('/');
    }
  }
  async componentWillUnmount() {
    this.socket.disconnect(true);
  }

  handleClickOutside = () => {
    this.setState({ navSideMenu: false });
  };

  logout = async() => {
    await this.props.userLogout(this.state.user);
    this.socket.emit('LOGOUT_USER', {
      username: this.state.username,
      active: false
    });
  }

  toggleNavMenu = () => {
    this.setState({ navSideMenu: !this.state.navSideMenu });
  }

  render() {
    return (
      <div>
        <div className="navbarDashboard" onClick={this.toggleNavMenu}>
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
                <Link to="/Manage"><img className="navbarDashboard-authlink" src={manage} alt="user-icon" style={{ display: (this.state.visible === false ? 'none' : 'flex'), height: '3.5rem', width: '18.9rem', marginTop: '1.5rem', paddingBottom: '1.5rem', paddingLeft: '1.5rem', paddingRight: '1.5rem', borderBottom: '1px solid white' }} /></Link>
                <img className="navbarDashboard-authlink" src={logout} alt="user-icon" style={{ height: '3.5rem', width: '18.9rem', marginTop: '1.5rem', paddingBottom: '1.5rem', paddingLeft: '1.5rem', paddingRight: '1.5rem', borderBottom: '1px solid white' }} onClick={this.logout} />
              </div>
            </div>
          : null}
        </ReactCSSTransitionGroup>
      </div>
    );
  }
}

function mapStateToProps({ usersReducer }) {
  return {
    error: usersReducer.error,
    isLoading: usersReducer.isLoading,
    success: usersReducer.success,
    logout: usersReducer.logout,
    user: usersReducer.user,
  };
}

export default withRouter(connect(mapStateToProps, actions)(onClickOutside(AuthNavigation)));
