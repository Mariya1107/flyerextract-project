// src/pages/Home.js

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // ✅ removed Link
import axios from "axios";
import BASE_URL from "../config";

import ProviderLogin from "../components/ProviderLogin";
import AdminLogin from "../components/AdminLogin";
import ProviderModal1 from "../components/ProviderModal1";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faMapPin, faArrowRight } from "@fortawesome/free-solid-svg-icons";

import "./Home.css";
import "./cursor.css";
import Authorisation from "../components/Authorisation";

const Home = () => {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState("signup");
  const [, setUserData] = useState(
    JSON.parse(localStorage.getItem("currentUser")) || null
  ); // ✅ keep only setter
  const [showProviderModal, setShowProviderModal] = useState(false);
  const [showAllStores, setShowAllStores] = useState(false);
  const [showAdminModal, setShowAdminModal] = useState(false);
  const [showProviderModal1, setShowProviderModal1] = useState(false);

  const [stores, setStores] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [locationTerm, setLocationTerm] = useState("");

  const navigate = useNavigate();

  // ✅ Fetch all stores
  useEffect(() => {
    axios
      .get(`${BASE_URL}/stores/`)
      .then((res) => setStores(res.data))
      .catch((err) => console.error("Error fetching stores", err));
  }, []);

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

  const displayedStores = showAllStores
    ? filteredStores
    : filteredStores.slice(0, 5);

  // Unique regions for location dropdown
  const uniqueRegions = stores
    .map((store) => store.region?.name)
    .filter((v, i, a) => v && a.indexOf(v) === i);

  // Autocomplete supermarket suggestions
  const supermarketSuggestions = stores
    .map((store) => store.name)
    .filter((v, i, a) => v && a.indexOf(v) === i)
    .filter((name) => name.toLowerCase().includes(searchTerm.toLowerCase()));

  const handleSelectSupermarket = (name) => {
    setSearchTerm(name);
  };

  return (
    <>
      {/* HERO SECTION */}
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
                We can connect you to the supermarket, first time and every time.
              </p>

              <div className="row g-2 justify-content-center">
                {/* Supermarket Search Input */}
                <div className="col-md-4 position-relative">
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
                  {searchTerm && supermarketSuggestions.length > 0 && (
                    <ul className="list-group position-absolute w-100 mt-1">
                      {supermarketSuggestions.map((name, idx) => (
                        <li
                          key={idx}
                          className="list-group-item list-group-item-action"
                          style={{ cursor: "pointer" }}
                          onClick={() => handleSelectSupermarket(name)}
                        >
                          {name}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                {/* Location Dropdown */}
                <div className="col-md-4">
                  <div className="input-group">
                    <span className="input-group-text">
                      <FontAwesomeIcon icon={faMapPin} />
                    </span>
                    <select
                      className="form-control"
                      value={locationTerm}
                      onChange={(e) => setLocationTerm(e.target.value)}
                    >
                      <option value="">Select Location</option>
                      {uniqueRegions.map((region, idx) => (
                        <option key={idx} value={region}>
                          {region}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Search Button */}
                <div className="col-md-2 d-grid">
                  <button
                    type="button"
                    className="btn for_btn for_signin"
                    onClick={() => { /* no navigation, filtering already works */ }}
                  >
                    <FontAwesomeIcon icon={faSearch} className="me-2" />
                    Search
                  </button>
                </div>
              </div>
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
              Service categories help organize and structure the offerings on a marketplace.
            </p>
          </div>

          <div className="row g-4">
            {displayedStores.map((store) => (
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

          {filteredStores.length > 5 && (
            <div className="text-center mt-4">
              <button
                className="btn btn-dark"
                onClick={() => setShowAllStores(!showAllStores)}
              >
                {showAllStores ? "Show Less" : "View All"}{" "}
                <FontAwesomeIcon icon={faArrowRight} className="ms-2" />
              </button>
            </div>
          )}
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
          localStorage.setItem("currentUser", JSON.stringify(user));
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
