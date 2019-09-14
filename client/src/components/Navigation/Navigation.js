import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import chatotlogo from '../../assets/images/chatterapp.png';
import './Navigation.css';

const Navigation = () => {
  const [open, showOpen] = useState(false);
  const [didMount, setDidMount] = useState(false);

  useEffect(() => {
    if (!didMount) {
      setDidMount(true);
      const user = localStorage.getItem('user');
      if (user) {
        showOpen(true);
      } else if (!user) {
        showOpen(false);
      }
    }
  }, [didMount]);

  return (
    <div>
      <div className="navbar row">
        <Link to="/" className="navbar-link"><img src={chatotlogo} height="80" width="140" alt="chatter-icon-logo" /></Link>
        {open === true ? <Link to="/Dashboard" className="navbar-authlink"><span>Open</span></Link> : null}
        <Link to="/Signup" className="navbar-authlink"><span>Signup</span></Link>
        <Link to="/Login" className="navbar-authlink"><span>Login</span></Link>
      </div>
    </div>
  );
}

export default Navigation;