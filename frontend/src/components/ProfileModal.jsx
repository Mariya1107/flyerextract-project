import React, { useState, useEffect } from "react";
import "./Authorisation.css";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes, faUser } from "@fortawesome/free-solid-svg-icons";
import BASE_URL from "../config";

const ProfileModal = ({ token, setShowProfileModal }) => {
  const [userData, setUserData] = useState({});
  const [editMode, setEditMode] = useState(false);
  const [profilePhoto, setProfilePhoto] = useState(null);

  useEffect(() => {
    axios
      .get(`${BASE_URL}/api/accounts/profile/`, {
        headers: {
          Authorization: `Token ${token}`,
        },
      })
      .then((res) => {
        setUserData(res.data);
      });
  }, []);

  const handleInputChange = (e) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    setProfilePhoto(e.target.files[0]);
  };

  const handleSave = async () => {
    const formData = new FormData();
    Object.keys(userData).forEach((key) => {
      formData.append(key, userData[key]);
    });
    if (profilePhoto) formData.append("profile_photo", profilePhoto);

    await axios.put(`${BASE_URL}/api/accounts/profile/update/`, formData, {
      headers: {
        Authorization: `Token ${token}`,
        "Content-Type": "multipart/form-data",
      },
    });

    setEditMode(false);
  };

  return (
    <div className="auth-backdrop" onClick={() => setShowProfileModal(false)}>
      <div className="auth-modal" onClick={(e) => e.stopPropagation()}>
        <button className="auth-close-btn" onClick={() => setShowProfileModal(false)}>
          <FontAwesomeIcon icon={faTimes} />
        </button>

        <h2 className="auth-title">My Profile</h2>

        <div className="auth-field">
          <label className="auth-label">Profile Photo</label>
          {userData.profile_photo && (
            <img
              src={userData.profile_photo}
              alt="Profile"
              style={{ width: "80px", borderRadius: "50%" }}
            />
          )}
          <input type="file" name="profile_photo" onChange={handleImageChange} />
        </div>

        {["full_name", "email", "phone", "gender", "username"].map((field) => (
          <div key={field} className="auth-field">
            <label className="auth-label">
              {field.replace("_", " ").toUpperCase()}
            </label>
            <input
              className="auth-input"
              name={field}
              value={userData[field] || ""}
              onChange={handleInputChange}
              disabled={!editMode}
            />
          </div>
        ))}

        <button
          className="auth-btn-gradient"
          onClick={() => (editMode ? handleSave() : setEditMode(true))}
        >
          {editMode ? "Save Changes" : "Edit Profile"}
        </button>
      </div>
    </div>
  );
};

export default ProfileModal;
