import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";

import ProviderLogin from "../components/ProviderLogin";
import AdminLogin from "../components/AdminLogin";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";
import axios from "axios";
import BASE_URL from "../config";

import ProviderModal1 from "../components/ProviderModal1";

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

import Authorisation from "../components/Authorisation";

const Home = () => {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState("signup");
  const [userData, setUserData] = useState(null);
  const [showProviderModal, setShowProviderModal] = useState(false);
  const [showAdminModal, setShowAdminModal] = useState(false);
  const [showProviderModal1, setShowProviderModal1] = useState(false);
  const [formData, setFormData] = useState({
    firstname: "",
    email: "",
    phone: "",
    gender: "",
    username: "",
    password: "",
    signinUser: "",
    signinPass: "",
  });

  const [stores, setStores] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isCitiesOpen, setIsCitiesOpen] = useState(true);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    axios.get("http://127.0.0.1:8000/stores/")
      .then((res) => {
        setStores(res.data);
      })
      .catch((err) => console.error("Error fetching stores", err));
  }, []);

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
      document
        .querySelectorAll('script[src*="jquery"],script[src*="cursor.js"]')
        .forEach((s) => s.remove());
    };
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePhoneChange = (value) => {
    setFormData((prev) => ({ ...prev, phone: value }));
  };

  const handleSignup = () => {
    const { firstname, email, phone, username, password, gender } = formData;
    if (!firstname || !email || !phone || !username || password.length < 8) {
      alert("Please fill all fields correctly.");
      return;
    }

    setUserData({
      firstname,
      email,
      phone,
      gender,
      username,
      profileImage: null,
    });

    setShowAuthModal(false);
  };

  const handleSignin = () => {
    const { signinUser, signinPass } = formData;

    if (!signinUser || signinPass.length < 8) {
      alert("Invalid credentials.");
      return;
    }

    setUserData({
      firstname: signinUser,
      email: "demo@example.com",
      phone: "+123456789",
      gender: "Not specified",
      username: signinUser,
      profileImage: null,
    });

    alert(`Logged in as ${signinUser}`);
    setShowAuthModal(false);
  };

  const filteredStores = stores.filter((store) =>
    store.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
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
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
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
            {filteredStores.map((store) => (
              <div
                className="category-card"
                key={store.id}
                onClick={() => navigate(`/store/${store.id}/flyers`)}
              >
                <div className="category-icon">
                  <img
                    src={
                      store.logo?.startsWith("http")
                        ? store.logo
                        : `${BASE_URL}${store.logo}`
                    }
                    alt={store.name}
                    className="img-fluid"
                    onError={(e) =>
                      (e.target.src = "https://via.placeholder.com/100x100?text=Logo")
                    }
                  />
                </div>
                <h6>{store.name}</h6>
                <p>View Flyers</p>
              </div>
            ))}
            {filteredStores.length === 0 && (
              <p className="text-center mt-4">No supermarkets matched your search.</p>
            )}
          </div>

          <div className="category-footer mt-4">
            <Link to="/all-stores" className="btn btn-dark">
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

      {/* Modals */}
      <Authorisation
        showAuthModal={showAuthModal}
        setShowAuthModal={setShowAuthModal}
        authMode={authMode}
        setAuthMode={setAuthMode}
        setUserData={setUserData}
      />
      {showProviderModal && (
        <div className="modal-overlay">
          <ProviderLogin setShowProviderModal={setShowProviderModal} />
        </div>
      )}
      {showProviderModal1 && (
        <ProviderModal1
          showModal={showProviderModal1}
          setShowModal={setShowProviderModal1}
        />
      )}
      {showAdminModal && (
        <AdminLogin setShowAdminModal={setShowAdminModal} />
      )}

      {/* Custom Cursor */}
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
