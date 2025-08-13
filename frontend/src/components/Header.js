import React from "react";
import './Header.css';
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronDown,
  faLock,
  faUser,
} from "@fortawesome/free-solid-svg-icons";

const Header = ({
  setShowProviderModal,
  setShowProviderModal1,
  setShowAdminModal,
  setAuthMode,
  setShowAuthModal,
}) => {
  return (
    <header className="main-header">
      <div className="container1">
        <div className="header-left">
          <Link to="/" aria-label="Home">
            <img src="/assets/Logo.png" alt="Logo" className="logo" />
          </Link>
        </div>

        <nav className="nav-center">
          {["Home"].map((txt) => (
            <a href={`#${txt.toLowerCase()}`} key={txt}>
              {txt}
            </a>
          ))}



          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              setShowProviderModal1(true);
            }}
          >
            Become a Shop With Us
          </a>
          {["About Us"].map((txt) => (
            <a href={`#${txt.toLowerCase()}`} key={txt}>
              {txt}
            </a>
          ))}


          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              setShowAdminModal(true);
            }}
          >
            Admin
          </a>
        </nav>

        <div className="header-right">
          <button
            className="btn-signin"
            onClick={() => {
              setAuthMode("signin");
              setShowAuthModal(true);
            }}
          >
            <FontAwesomeIcon icon={faLock} /> Sign In
          </button>

          <button
            className="btn-joinus"
            onClick={(e) => {
              e.preventDefault();
              setShowProviderModal(true);
            }}
          >
            <FontAwesomeIcon icon={faUser} /> Provider Sign In
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;

