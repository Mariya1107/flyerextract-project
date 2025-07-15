import React from "react";
import "./Authorisation.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";

const Authorisation = ({
  showAuthModal,
  setShowAuthModal,
  authMode,
  setAuthMode,
  formData,
  handleChange,
  handlePhoneChange,
  handleSignup,
  handleSignin,
}) => {
  return (
    showAuthModal && (
      <div className="auth-backdrop" onClick={() => setShowAuthModal(false)}>
        <div className="auth-modal" onClick={(e) => e.stopPropagation()}>
          {authMode === "signin" ? (
            <>
              <button className="auth-close-btn" onClick={() => setShowAuthModal(false)}>
                <FontAwesomeIcon icon={faTimes} />
              </button>

              <h2 className="auth-title">Welcome</h2>
              <p className="auth-subtitle">Enter your credentials to access your account</p>

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
                  <a href="#" className="forgot-password">Forgot Password?</a>
                </div>
                <input
                  type="password"
                  name="signinPass"
                  value={formData.signinPass}
                  onChange={handleChange}
                  className="auth-input"
                />
              </div>

              <div className="auth-options">
                <label><input type="checkbox" /> Remember Me</label>
                <label><input type="checkbox" /> Sign in with OTP</label>
              </div>

              <button className="auth-btn-gradient" onClick={handleSignin}>Sign In</button>

              <div className="divider">Or sign in with</div>

              <div className="social-buttons">
                <button className="social-btn google">
                  <img src="/assets/img/google-icon.svg" alt="Google" /> Google
                </button>
                <button className="social-btn facebook">
                  <img src="/assets/img/facebook-icon.svg" alt="Facebook" /> Facebook
                </button>
              </div>

              <p className="signup-redirect">
                Don’t have an account?{" "}
                <span onClick={() => setAuthMode("signup")}>Join us Today</span>
              </p>
            </>
          ) : (
            <div style={{ maxHeight: "75vh", overflowY: "auto", paddingRight: "6px" }}>
              <button className="auth-close-btn" onClick={() => setShowAuthModal(false)}>
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

              <button className="auth-btn-gradient" onClick={handleSignup}>Sign Up</button>

              <div className="divider">Or sign up with</div>

              <div className="social-buttons">
                <button className="social-btn google">
                  <img src="/assets/img/google-icon.svg" alt="Google" /> Google
                </button>
                <button className="social-btn facebook">
                  <img src="/assets/img/facebook-icon.svg" alt="Facebook" /> Facebook
                </button>
              </div>

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
