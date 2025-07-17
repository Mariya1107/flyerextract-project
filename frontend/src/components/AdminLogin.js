// src/components/AdminLogin.js
import React, { useState } from "react";
import axios from "axios";
import "./ProviderLogin.css"; // Reuse same styles

import BASE_URL from "../config";

const AdminLogin = ({ setShowAdminModal }) => {
  const [credentials, setCredentials] = useState({ username: "", password: "" });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials((prev) => ({ ...prev, [name]: value }));
  };

const handleLogin = async (e) => {
  e.preventDefault();
  const cleanedCredentials = {
    username: credentials.username.trim(),
    password: credentials.password.trim(),
  };
  try {
    const res = await axios.post(`${BASE_URL}api/accounts/login/admin/`, cleanedCredentials);
    console.log("Login response:", res.data);

    const token = res.data.token || res.data.key;
    if (token) {
      localStorage.setItem("adminToken", token);
      alert("Admin login successful");
      setShowAdminModal(false);
      window.location.href = "/admin-dashboard";
    } else {
      alert("Login failed. Not an admin.");
    }
  } catch (err) {
    if (err.response) {
      console.error("Error Response:", err.response.data);
    } else if (err.request) {
      console.error("No response received:", err.request);
    } else {
      console.error("Request setup error:", err.message);
    }
    alert("Login failed. Invalid credentials or not an admin.");
  }
};


  return (
    <div className="provider-modal-overlay">
      <div className="provider-modal">
        <button className="close-btn" onClick={() => setShowAdminModal(false)}>&times;</button>
        <h2>Admin Login</h2>
        <form onSubmit={handleLogin} className="provider-login-form">
          <label>Username</label>
          <input
            type="text"
            name="username"
            value={credentials.username}
            onChange={handleChange}
            required
          />

          <label>Password</label>
          <input
            type="password"
            name="password"
            value={credentials.password}
            onChange={handleChange}
            required
          />

          <button type="submit">Login</button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
