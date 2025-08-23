// src/pages/Home.js

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
  faSearch,
  faMapPin,
  faArrowRight,
  faShoppingCart,
} from "@fortawesome/free-solid-svg-icons";

import "./Home.css";
import "./cursor.css";

import Authorisation from "../components/Authorisation";

const Home = () => {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState("signup");
  const [userData, setUserData] = useState(
    JSON.parse(localStorage.getItem("currentUser")) || null // ✅ use currentUser key
  ); 
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
  const [locationTerm, setLocationTerm] = useState(""); 

  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(`${BASE_URL}/stores/`)
      .then((res) => setStores(res.data))
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

    const newUser = {
      firstname,
      email,
      phone,
      gender,
      username,
      profileImage: null,
    };

    setUserData(newUser);
    localStorage.setItem("currentUser", JSON.stringify(newUser)); // ✅ save currentUser

    setShowAuthModal(false);
    navigate("/cart"); 
  };

  const handleSignin = () => {
    const { signinUser, signinPass } = formData;

    if (!signinUser || signinPass.length < 8) {
      alert("Invalid credentials.");
      return;
    }

    const signedUser = {
      firstname: signinUser,
      email: "demo@example.com",
      phone: "+123456789",
      gender: "Not specified",
      username: signinUser,
      profileImage: null,
    };

    setUserData(signedUser);
    localStorage.setItem("currentUser", JSON.stringify(signedUser)); // ✅ save currentUser

    alert(`Logged in as ${signinUser}`);
    setShowAuthModal(false);
    navigate("/cart"); 
  };

  // ✅ Cart click requires login
  const handleCartClick = () => {
    if (!userData) {
      alert("Please sign in to access your cart.");
      setAuthMode("signin");
      setShowAuthModal(true); 
    } else {
      navigate("/cart"); 
    }
  };

  // Filter stores based on search and location
  const filteredStores = stores.filter((store) => {
    const name = store.name?.toLowerCase() || "";
    const region = store.region?.name?.toLowerCase() || "";
    const country = store.region?.country?.name?.toLowerCase() || "";

    const term = searchTerm.toLowerCase();
    const loc = locationTerm.toLowerCase();

    return (
      name.includes(term) &&
      (region.includes(loc) || country.includes(loc) || loc === "")
    );
  });

  return (
    <>
      {/* HERO */}
      <section
        className="py-5 bg-light"
        id="home"
        style={{
          backgroundImage: `url("/slider.png")`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          minHeight: "60vh",
        }}
      >
        <div className="container py-5">
          <div className="row align-items-center">
            <div className="col-lg-8 mx-auto text-center">
              <h1 className="text-white fw-bold mb-3 fs-1">
                Connect with Nearby Shops
              </h1>
              <p className="text-light mb-4 fs-5">
                We can connect you to the supermarket, first time and every
                time.
              </p>

              <form>
                <div className="row g-2 justify-content-center">
                  <div className="col-md-4">
                    <div className="input-group">
                      <span className="input-group-text">
                        <FontAwesomeIcon icon={faSearch} />
                      </span>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Search for Supermarket"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="col-md-4">
                    <div className="input-group">
                      <span className="input-group-text">
                        <FontAwesomeIcon icon={faMapPin} />
                      </span>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Enter Location"
                        value={locationTerm}
                        onChange={(e) => setLocationTerm(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="col-md-2 d-grid">
                    <Link to="/search" className="btn for_btn for_signin">
                      <FontAwesomeIcon icon={faSearch} className="me-2" />
                      Search
                    </Link>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* CATEGORY SECTION */}
      <section
        className="py-5 bg-light"
        style={{ background: "linear-gradient(to bottom, #f7f9fc, #e3e8f4)" }}
      >
        <div className="container">
          <div className="text-center mb-4">
            <h2 className="mb-1">
              Explore our <span className="text-primary">Categories</span>
            </h2>
            <p className="text-muted">
              Service categories help organize and structure the offerings on a
              marketplace.
            </p>
          </div>

          <div className="row g-4">
            {filteredStores.map((store) => (
              <div
                className="col-6 col-md-4 col-lg-2"
                key={store.id}
                onClick={() => navigate(`/store/${store.slug}/flyers`)}
                style={{ cursor: "pointer" }}
              >
                <div className="card text-center shadow-sm h-100">
                  <div className="card-body">
                    <img
                      src={
                        store.logo?.startsWith("http")
                          ? store.logo
                          : `${BASE_URL}/${store.logo}`
                      }
                      alt={store.name}
                      className="img-fluid mb-3"
                      style={{ maxHeight: "100px", objectFit: "contain" }}
                      onError={(e) =>
                        (e.target.src =
                          "https://via.placeholder.com/100x100?text=Logo")
                      }
                    />
                    <h6 className="fw-bold">{store.name}</h6>
                    <p className="text-muted small">View Flyers</p>
                  </div>
                </div>
              </div>
            ))}

            {filteredStores.length === 0 && (
              <div className="col-12 text-center mt-4">
                <p>No supermarkets matched your search.</p>
              </div>
            )}
          </div>

          <div className="text-center mt-4">
            <Link to="/all-stores" className="btn btn-dark">
              View All <FontAwesomeIcon icon={faArrowRight} className="ms-2" />
            </Link>
          </div>
        </div>
      </section>

      {/* Modals */}
      <Authorisation
        showAuthModal={showAuthModal}
        setShowAuthModal={setShowAuthModal}
        authMode={authMode}
        setAuthMode={setAuthMode}
        setUserData={(user) => {
          setUserData(user);
          localStorage.setItem("currentUser", JSON.stringify(user)); // ✅ consistent
          navigate("/cart");
        }}
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
      {showAdminModal && <AdminLogin setShowAdminModal={setShowAdminModal} />}

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
