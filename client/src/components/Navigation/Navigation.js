import React from 'react';
import { Link } from 'react-router-dom';
import chatotlogo from '../../assets/images/chatterapp.png';
import './Navigation.css';

const Navigation = () => {
  return (
    <div>
      <div className="navbar row">
        <Link to="/" className="navbar-link"><img src={chatotlogo} height="80" width="140" alt="chatter-icon-logo" /></Link>
        <Link to="/Signup" className="navbar-authlink"><span>Signup</span></Link>
        <Link to="/Login" className="navbar-authlink"><span>Login</span></Link>
      </div>
    </div>
  );
}

export default Navigation;