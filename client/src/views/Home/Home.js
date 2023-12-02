import React from 'react';
import { useLocation } from 'react-router-dom';
import Navigation from '../../components/Navigation/Navigation';
import Signup from '../../components/Signup/Signup';
import Login from '../../components/Login/Login';
import './Home.css';

const Home = () => {
  const route = useLocation();
  const pathname = route ? (route.pathname || null) : null;
  console.log(pathname);

  if (pathname === "/Signup") {
    console.log('signup??');
    return (
      <div className="App">
        <div className="main">
          <div className="homepage">
            <Navigation />
            <Signup />
          </div>
        </div>
      </div>
    );
  } else if (pathname === "/" || pathname === "/Login") {
    console.log('login??');
    return (
      <div className="App">
        <div className="main">
          <div className="homepage">
            <Navigation />
            <Login />
          </div>
        </div>
      </div>
    );
  }
};

export default Home;