// src/pages/RegionAdmin.js
import React, { useEffect, useState } from "react";
import axios from "axios";
import BASE_URL from "../config";
import "../pages/UsersAdminDash.css";
import { FaTrash } from "react-icons/fa";

const RegionAdmin = () => {
  const [regions, setRegions] = useState([]);
  const [countries, setCountries] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newRegion, setNewRegion] = useState("");
  const [selectedCountry, setSelectedCountry] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchRegions();
    fetchCountries();
  }, []);

  // ✅ Fetch Regions
  const fetchRegions = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/regions/`);
      setRegions(res.data);
    } catch (err) {
      console.error("Failed to fetch regions:", err.response?.data || err);
    }
  };

  // ✅ Fetch Countries
  const fetchCountries = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/countries/`);
      setCountries(res.data);
    } catch (err) {
      console.error("Failed to fetch countries:", err.response?.data || err);
    }
  };

  // ✅ Add Region
  const handleAddRegion = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("⚠ You must be logged in to add a region.");
      return;
    }

    if (!newRegion.trim() || !selectedCountry) {
      alert("Please enter a region name and select a country.");
      return;
    }

    setLoading(true);
    try {
      await axios.post(
        `${BASE_URL}/api/accounts/regions/add/`,
        { name: newRegion, country_id: selectedCountry },
        {
          headers: { Authorization: `Token ${token}` },
        }
      );
      setShowAddModal(false);
      setNewRegion("");
      setSelectedCountry("");
      fetchRegions();
    } catch (err) {
      console.error("Failed to add region:", err.response?.data || err);
      alert(
        `❌ Failed to add region: ${
          JSON.stringify(err.response?.data || err.message)
        }`
      );
    } finally {
      setLoading(false);
    }
  };

  // ✅ Delete Region
  const handleDeleteRegion = async (regionId) => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("⚠ You must be logged in to delete a region.");
      return;
    }

    if (!window.confirm("Are you sure you want to delete this region?")) return;

    try {
      await axios.delete(`${BASE_URL}/api/accounts/regions/${regionId}/`, {
        headers: { Authorization: `Token ${token}` },
      });
      fetchRegions();
    } catch (err) {
      console.error("Failed to delete region:", err.response?.data || err);
      alert(
        `❌ Failed to delete region: ${
          JSON.stringify(err.response?.data || err.message)
        }`
      );
    }
  };

  return (
    <div className="provider-table-wrapper">
      <div className="table-header">
        <h2>All Regions</h2>
        <button
          className="add-provider-btn"
          onClick={() => setShowAddModal(true)}
        >
          + Add Region
        </button>
      </div>

      <div className="table-container">
        <table className="provider-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Region</th>
              <th>Country</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {regions.length === 0 ? (
              <tr>
                <td colSpan="4" style={{ textAlign: "center" }}>
                  No regions available
                </td>
              </tr>
            ) : (
              regions.map((region, index) => (
                <tr key={region.id}>
                  <td>{index + 1}</td>
                  <td>{region.name}</td>
                  <td>{region.country.name}</td>
                  <td className="action-icons">
                    <button
                      className="icon-btn delete-btn"
                      onClick={() => handleDeleteRegion(region.id)}
                    >
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {showAddModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <span
              className="modal-close"
              onClick={() => setShowAddModal(false)}
            >
              &times;
            </span>
            <h3>Add New Region</h3>
            <input
              type="text"
              value={newRegion}
              onChange={(e) => setNewRegion(e.target.value)}
              placeholder="Enter region name"
              className="modal-input"
              disabled={loading}
            />
            <select
              value={selectedCountry}
              onChange={(e) => setSelectedCountry(e.target.value)}
              className="modal-input"
              disabled={loading}
            >
              <option value="">Select country</option>
              {countries.map((country) => (
                <option key={country.id} value={country.id}>
                  {country.name}
                </option>
              ))}
            </select>
            <div className="modal-actions">
              <button
                className="submit-btn"
                onClick={handleAddRegion}
                disabled={loading}
              >
                {loading ? "Saving..." : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RegionAdmin;
