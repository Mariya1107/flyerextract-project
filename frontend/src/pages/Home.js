// src/pages/Home.jsx
import React, { useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronDown,
  faLock,
  faUser,
  faSearch,
  faMapPin,
} from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import "./Home.css";
import "./cursor.css";

const Home = () => {
  useEffect(() => {
    const jquery = document.createElement("script");
    jquery.src = "https://code.jquery.com/jquery-3.6.0.min.js";
    jquery.onload = () => {
      const cursorJs = document.createElement("script");
      cursorJs.src = `${process.env.PUBLIC_URL}/cursor.js`;
      cursorJs.async = true;
      document.body.appendChild(cursorJs);
    };
    document.body.appendChild(jquery);

    return () => {
      document
        .querySelectorAll('script[src*="jquery"],script[src*="cursor.js"]')
        .forEach((s) => s.remove());
    };
  }, []);

  const categories = [
    { id: 1, title: "SUPERMARKET 1", products: 9874, icon: "category-01.svg" },
    { id: 2, title: "SUPERMARKET 2", products: 787, icon: "category-02.svg" },
    { id: 3, title: "SUPERMARKET 3", products: 2357, icon: "category-13.svg" },
    { id: 4, title: "SUPERMARKET 4", products: 1260, icon: "category-04.svg" },
    { id: 5, title: "SUPERMARKET 5", products: 4546, icon: "category-05.svg" },
    { id: 6, title: "SUPERMARKET 6", products: 2546, icon: "category-06.svg" },
    { id: 7, title: "SUPERMARKET 7", products: 4547, icon: "category-07.svg" },
    { id: 8, title: "SUPERMARKET 8", products: 4787, icon: "category-08.svg" },
    { id: 9, title: "SUPERMARKET 9", products: 1457, icon: "category-09.svg" },
    { id: 10, title: "SUPERMARKET 10", products: 4157, icon: "category-10.svg" },
    { id: 11, title: "SUPERMARKET 11", products: 5477, icon: "category-11.svg" },
    { id: 12, title: "SUPERMARKET 12", products: 7457, icon: "category-12.svg" },
  ];

  return (
    <>
      <header className="main-header">
        <div className="container">
          <div className="header-left">
            <Link to="/" aria-label="Home">
              <img src="/assets/img/logo.svg" alt="Logo" className="logo" />
            </Link>
          </div>

          <nav className="nav-center">
            {[
              "Categories",
              "Home",
              "Services",
              "Customers",
              "Providers",
            ].map((txt) => (
              <a href={`#${txt.toLowerCase()}`} key={txt}>
                {txt} <FontAwesomeIcon icon={faChevronDown} />
              </a>
            ))}
            <a href="#become-provider">Become a Provider</a>
            <a href="/admin">Admin</a>
          </nav>

          <div className="header-right">
            <button className="btn-signin">
              <FontAwesomeIcon icon={faLock} /> Sign In
            </button>
            <button className="btn-joinus">
              <FontAwesomeIcon icon={faUser} /> Join Us
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
        <div className="container hero-flex">
          <div className="hero-left">
            <h1>Connect with Nearby Shops</h1>
            <p className="sub-title">
              We can connect you to the supermarket, first time and every time.
            </p>

            <div className="banner-form">
              <form>
                <div className="search-row">
                  <div className="input-group">
                    <span className="input-icon">
                      <FontAwesomeIcon icon={faSearch} />
                    </span>
                    <input
                      type="text"
                      placeholder="Search for Supermarket"
                      className="search-input"
                    />
                  </div>

                  <div className="input-group">
                    <span className="input-icon">
                      <FontAwesomeIcon icon={faMapPin} />
                    </span>
                    <input
                      type="text"
                      placeholder="Enter Location"
                      className="search-input"
                    />
                  </div>

                  <Link
                    to="/search"
                    className="btn-search d-inline-flex align-items-center"
                  >
                    <FontAwesomeIcon icon={faSearch} className="me-2" /> Search
                  </Link>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>

      <section className="section category-section">
        <div className="container">
          <div className="text-center mb-4">
            <h2 className="mb-1">
              Explore our <span className="text-linear-primary">Categories</span>
            </h2>
            <p className="sub-title">
              Service categories help organize and structure the offerings on a
              marketplace, making it easier for users to find what they need.
            </p>
          </div>

          <div className="category-grid">
            {categories.map((cat) => (
              <div className="category-card" key={cat.id}>
                <div className="category-icon">
                  <img
                    src={`/assets/img/icons/${cat.icon}`}
                    alt={cat.title}
                    className="img-fluid"
                  />
                </div>
                <h6>{cat.title}</h6>
                <p>{cat.products} Products</p>
                <Link to={`/supermarket/${cat.id}`} className="hover-link">
                  View All
                </Link>
              </div>
            ))}
          </div>

          <div className="text-center mt-4">
            <Link to="/categories" className="btn btn-dark">
              View All <i className="ti ti-arrow-right ms-2"></i>
            </Link>
          </div>
        </div>
      </section>

      {/* Business Section */}
      <section className="section business-section bg-black">
        <div className="container">
          <div className="row align-items-center bg-01">
            <div className="col-md-6 wow fadeInUp">
              <div className="section-header mb-md-0 mb-4">
                <h2 className="text-white display-4">
                  Add Services & Grow your{" "}
                  <span className="text-linear-primary">business with us</span>
                </h2>
                <p className="text-light">
                  A versatile platform that connects you with local professionals
                  across various categories, from home services like plumbing and
                  electrical work to personal services like photography and tutoring.
                </p>
                <a href="/join" className="btn btn-linear-primary">
                  <FontAwesomeIcon icon={faUser} className="me-2" />
                  Join Us
                </a>
              </div>
            </div>

            <div className="col-md-6 text-md-end wow fadeInUp">
              <div className="business-img">
                <img
                  src="/assets/img/business.jpg"
                  alt="Add Business"
                  className="img-fluid"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Home;