import React, { useState } from "react";
import "./Authorisation.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import BASE_URL from "../config";

const Authorisation = ({
  showAuthModal,
  setShowAuthModal,
  authMode,
  setAuthMode,
  setUserData,
}) => {
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

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSignup = async () => {
    try {
      const res = await axios.post(`${BASE_URL}api/accounts/register/`, {
        username: formData.username,
        email: formData.email,
        password: formData.password,
        full_name: formData.firstname,
        phone: formData.phone,
        gender: formData.gender,
      });

      setUserData({
        firstname: formData.firstname,
        email: formData.email,
        phone: formData.phone,
        gender: formData.gender,
        username: formData.username,
      });

      alert("Registered successfully!");
      setAuthMode("signin");
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.error || "Signup failed");
    }
  };

  const handleSignin = async () => {
    try {
      const res = await axios.post(`${BASE_URL}api/accounts/login/`, {
        username: formData.signinUser,
        password: formData.signinPass,
      });
      localStorage.setItem("token", res.data.token);

      setUserData({
        firstname: formData.signinUser,
        email: "demo@example.com",
        phone: "+123456789",
        gender: "Not specified",
        username: formData.signinUser,
      });

      alert("Login successful!");
      setShowAuthModal(false);
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.error || "Login failed");
    }
  };

  return (
    showAuthModal && (
      <div className="auth-backdrop" onClick={() => setShowAuthModal(false)}>
        <div className="auth-modal" onClick={(e) => e.stopPropagation()}>
          {authMode === "signin" ? (
            <>
              <button
                className="auth-close-btn"
                onClick={() => setShowAuthModal(false)}
              >
                <FontAwesomeIcon icon={faTimes} />
              </button>

              <h2 className="auth-title">Welcome</h2>
              <p className="auth-subtitle">
                Enter your credentials to access your account
              </p>

              <div className="auth-field">
                <label className="auth-label">User Name</label>
                <input
                  type="text"
                  name="signinUser"
                  value={formData.signinUser}
                  onChange={handleChange}
                  className="auth-input"
                />
              </div>

              <div className="auth-field">
                <div className="auth-label-row">
                  <label className="auth-label">Password</label>
                </div>
                <input
                  type="password"
                  name="signinPass"
                  value={formData.signinPass}
                  onChange={handleChange}
                  className="auth-input"
                />
              </div>

              <button
                className="auth-btn-gradient"
                onClick={handleSignin}
              >
                Sign In
              </button>

              <p className="signup-redirect">
                Don’t have an account?{" "}
                <span onClick={() => setAuthMode("signup")}>
                  Join us Today
                </span>
              </p>
            </>
          ) : (
            <div
              style={{ maxHeight: "75vh", overflowY: "auto", paddingRight: "6px" }}
            >
              <button
                className="auth-close-btn"
                onClick={() => setShowAuthModal(false)}
              >
                <FontAwesomeIcon icon={faTimes} />
              </button>

              <h2 className="auth-title">Create Account</h2>
              <p className="auth-subtitle">Fill in the details to get started</p>

              <div className="auth-field">
                <label className="auth-label">Full Name</label>
                <input
                  type="text"
                  name="firstname"
                  value={formData.firstname}
                  onChange={handleChange}
                  className="auth-input"
                />
              </div>

              <div className="auth-field">
                <label className="auth-label">Email</label>
                <input
                  type="text"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="auth-input"
                />
              </div>

              <div className="auth-field">
                <label className="auth-label">Phone Number</label>
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="auth-input"
                />
              </div>

              <div className="auth-field">
                <label className="auth-label">Gender</label>
                <select
                  name="gender"
                  value={formData.gender || ""}
                  onChange={handleChange}
                  className="auth-input"
                >
                  <option value="">Select</option>
                  <option value="female">Female</option>
                  <option value="male">Male</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div className="auth-field">
                <label className="auth-label">Username</label>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  className="auth-input"
                />
              </div>

              <div className="auth-field">
                <label className="auth-label">Password</label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="auth-input"
                />
              </div>

              <button className="auth-btn-gradient" onClick={handleSignup}>
                Sign Up
              </button>

              <p className="signup-redirect">
                Already have an account?{" "}
                <span onClick={() => setAuthMode("signin")}>Sign In</span>
              </p>
            </div>
          )}
        </div>
      </div>
    )
  );
};

export default Authorisation;
