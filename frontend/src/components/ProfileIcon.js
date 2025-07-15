import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserCircle, faEdit, faSave } from "@fortawesome/free-solid-svg-icons";
import "./ProfileIcon.css";

const ProfileIcon = ({ userData, setUserData }) => {
  console.log("👤 Rendering ProfileIcon with userData:", userData); // Debug line

  const [isOpen, setIsOpen] = useState(false);
  const [editing, setEditing] = useState(false);
  const [editedData, setEditedData] = useState({ ...userData });

  const handleEditToggle = () => {
    if (editing) {
      setUserData(editedData);
    }
    setEditing(!editing);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setEditedData((prev) => ({ ...prev, profileImage: reader.result }));
      setUserData((prev) => ({ ...prev, profileImage: reader.result }));
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="profile-icon-wrapper" style={{ background: "#ffe0e0", padding: "6px", borderRadius: "8px" }}>
      <img
        src={userData?.profileImage || "https://i.pravatar.cc/150?img=3"}
        alt="Profile"
        className="profile-avatar"
        onClick={() => setIsOpen(!isOpen)}
      />

      {isOpen && (
        <div className="profile-dropdown">
          <div className="profile-header">
            <label className="image-upload">
              <input type="file" accept="image/*" onChange={handleImageChange} />
              <img
                src={editedData?.profileImage || "https://i.pravatar.cc/150?img=3"}
                alt="Avatar"
              />
            </label>
          </div>

          <div className="profile-details">
            {["firstname", "email", "phone", "gender", "username"].map((field) => (
              <div key={field} className="profile-field">
                <label>{field.charAt(0).toUpperCase() + field.slice(1)}</label>
                {editing ? (
                  <input
                    type="text"
                    name={field}
                    value={editedData[field]}
                    onChange={handleChange}
                  />
                ) : (
                  <span>{userData[field]}</span>
                )}
              </div>
            ))}
          </div>

          <div className="profile-actions">
            <button className="edit-btn" onClick={handleEditToggle}>
              <FontAwesomeIcon icon={editing ? faSave : faEdit} />{" "}
              {editing ? "Save" : "Edit"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileIcon;
