// src/pages/ProvidersPageDash.js
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import BASE_URL from "../config";
import "../pages/ProviderLoginDashboard.css"; // Reuse styles

const ProvidersPageDash = () => {
  const [stores, setStores] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get(`${BASE_URL}/stores/`)
      .then((res) => setStores(res.data))
      .catch((err) => console.error("Error fetching stores", err));
  }, []);

  return (
    <div className="main-content">
      <div className="category-grid">
        {stores.map((store) => (
          <div
            className="category-card"
            key={store.id}
            onClick={() => navigate(`/store/${store.id}/flyers`)}
          >
            <div className="category-icon">
              <img
                src={store.logo?.startsWith("http") ? store.logo : `${BASE_URL}/${store.logo}`}
                alt={store.name}
                className="img-fluid"
                onError={(e) => (e.target.src = "https://via.placeholder.com/100x100?text=Logo")}
              />
            </div>
            <h6>{store.name}</h6>
            <p>View Flyers</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProvidersPageDash;
