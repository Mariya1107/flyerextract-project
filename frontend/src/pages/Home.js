import React, { useEffect } from "react";
import "./Home.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronDown,
  faLock,
  faUser,
  faSearch,
  faMapPin
} from "@fortawesome/free-solid-svg-icons";
import "./cursor.css";
import $ from "jquery";

const Home = () => {
  useEffect(() => {
    const jQueryScript = document.createElement("script");
    jQueryScript.src = "https://code.jquery.com/jquery-3.6.0.min.js";
    jQueryScript.onload = () => {
      const cursorScript = document.createElement("script");
      cursorScript.src = `${process.env.PUBLIC_URL}/cursor.js`;
      cursorScript.async = true;
      document.body.appendChild(cursorScript);
    };
    document.body.appendChild(jQueryScript);

    return () => {
      document.querySelectorAll('script[src*="jquery"], script[src*="cursor.js"]').forEach((script) =>
        script.remove()
      );
    };
  }, []);

  return (
    <>
      <header className="main-header">
        <div className="container">
          <div className="header-left">
            <a href="/" aria-label="Home">
              <img src="/assets/img/logo.svg" alt="Logo" className="logo" />
            </a>
          </div>

          <nav className="nav-center" role="navigation">
            <a href="#categories">
              Categories <FontAwesomeIcon icon={faChevronDown} />
            </a>
            <a href="#home">
              Home <FontAwesomeIcon icon={faChevronDown} />
            </a>
            <a href="#services">
              Services <FontAwesomeIcon icon={faChevronDown} />
            </a>
            <a href="#customers">
              Customers <FontAwesomeIcon icon={faChevronDown} />
            </a>
            <a href="#providers">
              Providers <FontAwesomeIcon icon={faChevronDown} />
            </a>
            <a href="#become-provider">Become a Provider</a>
            <a href="/admin">Admin</a>
          </nav>

          <div className="header-right">
            <button className="btn-signin">
              <FontAwesomeIcon icon={faLock} /> Sign In
            </button>
            <button className="btn-joinus">
              <FontAwesomeIcon icon={faUser} /> Join Us
            </button>
          </div>
        </div>

        <div className="xb-cursor tx-js-cursor">
          <div className="xb-cursor-wrapper">
            <div className="xb-cursor--follower xb-js-follower" />
          </div>
        </div>
      </header>

      <section className="hero-section" id="home">
        <div className="hero-content position-relative overflow-hidden">
          <div className="container">
            <div className="row align-items-center">
              <div className="col-lg-6">
                <div className="wow fadeInUp" data-wow-duration="1s" data-wow-delay=".25s">
                  <h1 className="mb-2">Connect with Nearby Shops</h1>
                  <p className="mb-3 sub-title">
                    We can connect you to the supermarket, first time and every time.
                  </p>

                  <div className="banner-form bg-white border mb-3">
                    <form action="#">
                      <div className="d-md-flex align-items-center flex-wrap">
                        <div className="input-group mb-2 me-md-2">
                          <span className="input-group-text px-1">
                            <FontAwesomeIcon icon={faSearch} />
                          </span>
                          <input className="form-control" placeholder="Search for SuperMarkets" />
                        </div>
                        <div className="input-group mb-2 me-md-2">
                          <span className="input-group-text px-1">
                            <FontAwesomeIcon icon={faMapPin} />
                          </span>
                          <input className="form-control" placeholder="Enter Location" />
                        </div>
                        <div className="mb-2 w-100 w-md-auto">
                          <a
                            href="/search"
                            className="btn btn-linear-primary d-inline-flex align-items-center w-100"
                          >
                            <FontAwesomeIcon icon={faSearch} className="me-2" />
                            Search
                          </a>
                        </div>
                      </div>
                    </form>
                    <img
                      src="/assets/img/bg/bg-06.svg"
                      alt="shape"
                      className="shape-06 round-animate"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="hero-image">
            <img src="/assets/img/bg/bg-03.svg" alt="bg" className="shape-03" />
            <img src="/assets/img/bg/bg-04.svg" alt="bg" className="shape-04" />
            <img src="/assets/img/bg/bg-05.svg" alt="bg" className="shape-05" />
          </div>
        </div>
      </section>
    </>
  );
};

export default Home;
