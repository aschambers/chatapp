import React from 'react';
import Navigation from '../../components/Navigation/Navigation';
import Signup from '../../components/Signup/Signup';
import Login from '../../components/Login/Login';
import './Home.css';

const Home = (props) => {
  const route = props.location.pathname;

  if(route === "/Signup") {
    return (
      <div className="homepage">
        <Navigation />
        <Signup />
      </div>
    );
  } else if(route === "/" || route === "/Login") {
    return (
      <div className="homepage">
        <Navigation />
        <Login />
      </div>
    );
  }
};

export default Home;