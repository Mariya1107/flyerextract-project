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
    username: "",
    password: "",
    signinUser: "",
    signinPass: "",
  });

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // ✅ Signup
  const handleSignup = async () => {
    try {
      const res = await axios.post(`${BASE_URL}/api/accounts/register/`, {
        username: formData.username,
        email: formData.email,
        password: formData.password,
        full_name: formData.firstname,
        phone: formData.phone,
      });

      // ✅ Use real data from backend response
      const newUser = {
        fullname: res.data.full_name,
        email: res.data.email,
        phone: res.data.phone,
        username: res.data.username,
      };

      setUserData(newUser);
      localStorage.setItem("userData", JSON.stringify(newUser));

      alert("Registered successfully!");
      setAuthMode("signin");
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.error || "Signup failed");
    }
  };

  // ✅ Signin (username or phone)
  const handleSignin = async () => {
    try {
      const res = await axios.post(`${BASE_URL}/api/accounts/login/`, {
        identifier: formData.signinUser, // 👈 username OR phone
        password: formData.signinPass,
      });

      localStorage.setItem("token", res.data.token);

      // ✅ Use real user info returned from backend
      const loggedInUser = {
        fullname: res.data.full_name,
        email: res.data.email,
        phone: res.data.phone,
        username: res.data.username,
        is_provider: res.data.is_provider,
      };

      setUserData(loggedInUser);
      localStorage.setItem("userData", JSON.stringify(loggedInUser));

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
                Enter your username or phone number and password
              </p>

              <div className="auth-field">
                <label className="auth-label">Username or Phone</label>
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

              <button className="auth-btn-gradient" onClick={handleSignin}>
                Sign In
              </button>

              <p className="signup-redirect">
                Don’t have an account?{" "}
                <span onClick={() => setAuthMode("signup")}>Join us Today</span>
              </p>
            </>
          ) : (
            <div
              style={{
                maxHeight: "75vh",
                overflowY: "auto",
                paddingRight: "6px",
              }}
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
