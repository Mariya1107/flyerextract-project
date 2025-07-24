// src/pages/CountryAdmin.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import BASE_URL from '../config';
import "../pages/UsersAdminDash.css";
import { FaTrash } from "react-icons/fa";

const CountryAdmin = () => {
  const [countries, setCountries] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newCountry, setNewCountry] = useState('');

  useEffect(() => {
    fetchCountries();
  }, []);

  const fetchCountries = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/countries/`);
      setCountries(res.data);
    } catch (err) {
      console.error('Failed to fetch countries:', err);
    }
  };

  const handleAddCountry = async () => {
    const token = localStorage.getItem('token');
    try {
      await axios.post(
        `${BASE_URL}/api/accounts/countries/add/`,
        { name: newCountry },
        {
          headers: {
            Authorization: `Token ${token}`,
          },
        }
      );
      setShowAddModal(false);
      setNewCountry('');
      fetchCountries();
    } catch (err) {
      console.error('Failed to add country:', err.response?.data || err);
    }
  };

  const handleDeleteCountry = async (countryId) => {
  const token = localStorage.getItem('token');
  try {
    await axios.delete(`${BASE_URL}/api/accounts/countries/${countryId}/`, {
      headers: {
        Authorization: `Token ${token}`,
      },
    });
    fetchCountries(); // Refresh the country list
  } catch (err) {
    console.error('Failed to delete country:', err.response?.data || err);
  }
};

  return (
    <div className="provider-table-wrapper">
      <div className="table-header">
        <h2>All Countries</h2> 
        <button className="add-provider-btn" onClick={() => setShowAddModal(true)}>
          + Add Country 
        </button>
      </div>

      <div className="table-container">
        <table className="provider-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Countries</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
  {countries.map((country, index) => (
    <tr key={country.id}>
      <td>{index + 1}</td>
      <td>{country.name}</td>
      <td className="action-icons">
        <button
          className="icon-btn delete-btn"
          onClick={() => handleDeleteCountry(country.id)}
        >
          <FaTrash />
        </button>
      </td>
    </tr>
  ))}
</tbody>
        </table>
      </div>

      {showAddModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Add New Country</h3>
            <input
              type="text"
              value={newCountry}
              onChange={(e) => setNewCountry(e.target.value)}
              placeholder="Enter country name"
              className="modal-input"
            />
            <div className="modal-actions">
              <button className="submit-btn" onClick={handleAddCountry}>Save</button>
<span className="modal-close" onClick={() => setShowAddModal(false)}>
  &times;
</span>

            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CountryAdmin;
