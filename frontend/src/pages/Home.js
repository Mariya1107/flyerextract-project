import React, { useEffect } from 'react';
import './Home.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown } from '@fortawesome/free-solid-svg-icons';
import './cursor.css';
import $ from 'jquery';


const Home = () => {
useEffect(() => {
  const jQueryScript = document.createElement('script');
  jQueryScript.src = 'https://code.jquery.com/jquery-3.6.0.min.js'; // Load jQuery from CDN
  jQueryScript.onload = () => {
    const cursorScript = document.createElement('script');
    cursorScript.src = `${process.env.PUBLIC_URL}/cursor.js`;
    cursorScript.async = true;
    document.body.appendChild(cursorScript);
  };
  document.body.appendChild(jQueryScript);

  return () => {
    document.querySelectorAll('script[src*="jquery"], script[src*="cursor.js"]').forEach(script => script.remove());
  };
}, []);


  return (
    <header className="main-header">
      <div className="container">
        <div className="header-left">
          <img src="/assets/img/logo.svg" alt="Logo" className="logo" />
        </div>

        <nav className="nav-center">
          <a href="#">Categories <FontAwesomeIcon icon={faChevronDown} /></a>
          <a href="#">Home <FontAwesomeIcon icon={faChevronDown} /></a>
          <a href="#">Services <FontAwesomeIcon icon={faChevronDown} /></a>
          <a href="#">Customers <FontAwesomeIcon icon={faChevronDown} /></a>
          <a href="#">Providers <FontAwesomeIcon icon={faChevronDown} /></a>
          <a href="#">Become a Provider</a>
          <a href="#">Admin</a>
        </nav>

        <div className="header-right">
          <button className="btn-signin">
            <i className="ti ti-lock"></i> Sign In
          </button>
          <button className="btn-joinus">
            <i className="ti ti-user-filled"></i> Join Us
          </button>
        </div>
      </div>

      {/* Cursor HTML should be placed here, outside .container for full screen effect */}
      <div className="xb-cursor tx-js-cursor">
        <div className="xb-cursor-wrapper">
          <div className="xb-cursor--follower xb-js-follower"></div>
        </div>
      </div>
    </header>
  );
};

export default Home;
