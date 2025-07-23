// src/pages/ProvidersAdminDash.js
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import BASE_URL from "../config";
import "../pages/ProviderLoginDashboard.css"; // Reuse existing styles
import "./ProvidersAdminDash.css"; // Create this file for modal styles

const ProvidersAdminDash = () => {
  const [stores, setStores] = useState([]);
  const [selectedStore, setSelectedStore] = useState(null);
  const [editForm, setEditForm] = useState({ name: "", logo: null });

  useEffect(() => {
    axios
      .get(`${BASE_URL}/stores/`)
      .then((res) => setStores(res.data))
      .catch((err) => console.error("Error fetching stores", err));
  }, []);

  const handleCardClick = (store) => {
    setSelectedStore(store);
    setEditForm({ name: store.name, logo: null }); // Don't prefill logo input
  };

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "logo") {
      setEditForm((prev) => ({ ...prev, logo: files[0] }));
    } else {
      setEditForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedStore) return;

    const formData = new FormData();
    formData.append("name", editForm.name);
    if (editForm.logo) {
      formData.append("logo", editForm.logo);
    }

    try {
      const res = await axios.put(`${BASE_URL}/stores/${selectedStore.id}/`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      // Update the list with new data
      const updatedStores = stores.map((s) => (s.id === res.data.id ? res.data : s));
      setStores(updatedStores);
      setSelectedStore(null);
    } catch (error) {
      console.error("Update failed", error);
    }
  };

  return (
    <div className="main-content">
      <h2 className="dashboard-title">All Stores</h2>
      <div className="category-grid">
        {stores.map((store) => (
          <div
            className="category-card"
            key={store.id}
            onClick={() => handleCardClick(store)}
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
            <p>Edit Store</p>
          </div>
        ))}
      </div>

      {selectedStore && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button className="close-button" onClick={() => setSelectedStore(null)}>
              ✖
            </button>
            <h3>Edit Store</h3>
            <form onSubmit={handleSubmit}>
              <label>
                Store Name:
                <input
                  type="text"
                  name="name"
                  value={editForm.name}
                  onChange={handleInputChange}
                  required
                />
              </label>
              <label>
                Logo:
                <input
                  type="file"
                  name="logo"
                  accept="image/*"
                  onChange={handleInputChange}
                />
              </label>
              <button type="submit" className="submit-btn">Save Changes</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProvidersAdminDash;
