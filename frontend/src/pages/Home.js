import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Footer from "../components/Footer";

import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronDown,
  faLock,
  faUser,
  faSearch,
  faMapPin,
  faArrowRight,
} from "@fortawesome/free-solid-svg-icons";

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
    cursorJs.defer = true;
    document.body.appendChild(cursorJs);
  };
  document.body.appendChild(jquery);

  return () => {
    document.querySelectorAll('script[src*="jquery"],script[src*="cursor.js"]').forEach((s) => s.remove());
  };
}, []);

  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState("signup");
  const [formData, setFormData] = useState({
    firstname: "",
    email: "",
    phone: "",
    username: "",
    password: "",
    signinUser: "",
    signinPass: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePhoneChange = (value) => {
    setFormData((prev) => ({ ...prev, phone: value }));
  };

  const handleSignup = () => {
    const { firstname, email, phone, username, password } = formData;
    if (!firstname || !email || !phone || !username || password.length < 8) {
      alert("Please fill all fields correctly.");
      return;
    }
    console.log("Signup Data:", formData);
    setShowAuthModal(false);
  };

  const handleSignin = () => {
    const { signinUser, signinPass } = formData;
    if (!signinUser || signinPass.length < 8) {
      alert("Invalid credentials.");
      return;
    }
    console.log("Signin Data:", { signinUser, signinPass });
    setShowAuthModal(false);
  };

  const navigate = useNavigate();
  const [isCitiesOpen, setIsCitiesOpen] = useState(true);

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
      {/* HEADER */}
      <header className="main-header">
        <div className="container">
          <div className="header-left">
            <Link to="/" aria-label="Home">
              <img src="/assets/img/logo.svg" alt="Logo" className="logo" />
            </Link>
          </div>

          <nav className="nav-center">
            {["Categories", "Home", "Services", "Customers", "Providers"].map(
              (txt) => (
                <a href={`#${txt.toLowerCase()}`} key={txt}>
                  {txt} <FontAwesomeIcon icon={faChevronDown} />
                </a>
              )
            )}
            <a href="#become-provider">Become a Provider</a>
            <a href="/admin">Admin</a>
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
              onClick={() => {
                setAuthMode("signup");
                setShowAuthModal(true);
              }}
            >
              <FontAwesomeIcon icon={faUser} /> Join Us
            </button>
          </div>
        </div>
      </header>

      {/* HERO */}
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

      {/* CATEGORY SECTION */}
      <section className="section category-section">
        <div className="container">
          <div className="text-center mb-4">
            <h2 className="mb-1">
              Explore our <span className="text-linear-primary">Categories</span>
            </h2>
            <p className="sub-title">
              Service categories help organize and structure the offerings on a marketplace.
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
                <button onClick={() => navigate("/flyers")}>View All</button>
              </div>
            ))}
          </div>

          <div className="text-center mt-4">
            <Link to="/categories" className="btn btn-dark">
              View All <FontAwesomeIcon icon={faArrowRight} className="ms-2" />
            </Link>
          </div>
        </div>
      </section>

      {/* Business Section */}
      <section className="section business-section bg-black">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-md-6">
              <div className="section-header mb-md-0 mb-4">
                <h2 className="text-white display-4">
                  Add Services & Grow <br />your
                  <span className="text-linear-primary"> business with us</span>
                </h2>
                <p className="text-light">
                  A versatile platform that connects you with local professionals across various categories,<br />
                  from home services like plumbing and electrical work to personal services like<br />
                  photography and tutoring.
                </p>
                <a href="#" className="btn btn-linear-primary">
                  <FontAwesomeIcon icon={faUser} className="me-2" />
                  Join Us
                </a>
              </div>
            </div>
            <div className="col-md-6 text-md-end">
              <div className="business-img">
                <img
                  src="/assets/img/business.jpg"
                  className="img-fluid"
                  alt="Business"
                  style={{ maxWidth: "90%", borderRadius: "12px" }}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Cities Section */}
      <section className="section info-section">
        <div className="container">
          <div className="accordion-item border-0 bg-transparent">
            <div className="popular-cities-header d-flex align-items-center justify-content-between w-100">
              <h2 className="fw-bold m-0 mb-0">Popular Cities</h2>
              <button
                className="toggle-button"
                onClick={() => setIsCitiesOpen(prev => !prev)}
                aria-label="Toggle Cities"
              >
                <span className={`dropdown-arrow ${isCitiesOpen ? "open" : ""}`} />
              </button>
            </div>
            <hr style={{ borderTop: "1px solid lightgray", margin: "10px 0" }} />
            {isCitiesOpen && (
              <div className="accordion-body px-0 pt-3">
                <div className="row row-cols-xl-6 row-cols-md-4 row-cols-sm-2 row-cols-1">
                  {[
                    "Detroit", "Greensboro", "Kansas City", "Memphis", "El Paso",
                    "Harrisburg", "Las Vegas", "Miami", "Fort Lauderdale", "Hartford",
                    "Long Beach", "Milwaukee", "Fort Worth", "Houston", "Los Angeles",
                    "Minneapolis", "Fresno", "Indianapolis", "Louisville", "Modesto",
                    "Grand Rapids", "Jacksonville", "Madison", "Nashville"
                  ].map((city, idx) => (
                    <div className="col" key={idx}>
                      <div className="main-links">
                        <a href="#">{city}</a>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />

      {/* Auth Modal */}
      {showAuthModal && (
        <div className="modal-overlay" onClick={() => setShowAuthModal(false)}>
          <div className="auth-modal" onClick={(e) => e.stopPropagation()}>
            <h3>{authMode === "signup" ? "Join Us" : "Sign In"}</h3>
            {authMode === "signup" ? (
              <>
                <input type="text" name="firstname" placeholder="First Name" value={formData.firstname} onChange={handleChange} />
                <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} />
                <PhoneInput placeholder="Phone Number" defaultCountry="IN" value={formData.phone} onChange={handlePhoneChange} />
                <input type="text" name="username" placeholder="Username" value={formData.username} onChange={handleChange} />
                <input type="password" name="password" placeholder="Password (min 8 characters)" value={formData.password} onChange={handleChange} />
                <button onClick={handleSignup} className="btn btn-dark">Sign Up</button>
              </>
            ) : (
              <>
                <input type="text" name="signinUser" placeholder="Username or Email" value={formData.signinUser} onChange={handleChange} />
                <input type="password" name="signinPass" placeholder="Password" value={formData.signinPass} onChange={handleChange} />
                <button onClick={handleSignin} className="btn btn-dark">Sign In</button>
              </>
            )}
            <p style={{ marginTop: "10px" }}>
              {authMode === "signup" ? (
                <>Already have an account? <span onClick={() => setAuthMode("signin")} className="auth-toggle">Sign In</span></>
              ) : (
                <>Don't have an account? <span onClick={() => setAuthMode("signup")} className="auth-toggle">Join Us</span></>
              )}
            </p>
          </div>
        </div>
      )}
      {/* Custom Cursor Element */}
<div className="tx-js-cursor xb-cursor">
  <div className="xb-cursor-wrapper">
    <div className="tx-js-follower xb-cursor--follower"></div>
    <div className="tx-js-label"></div>
    <div className="tx-js-icon"></div>
  </div>
</div>

    </>
  );
};

export default Home;
