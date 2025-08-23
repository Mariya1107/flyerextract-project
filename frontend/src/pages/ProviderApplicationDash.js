import React, { useEffect, useState } from "react";
import axios from "axios";
import BASE_URL from "../config";
import "../pages/UsersAdminDash.css";
import "./EditProfile.css";
import { FaTrash } from "react-icons/fa";

const ProviderApplicationDash = () => {
  const [applications, setApplications] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    phone: "",
    
    company_name: "",
    address: "",
    gst_number: "",
    document: null,
  });

  const fetchApplications = async () => {
    const token = localStorage.getItem("adminToken");
    try {
      const res = await axios.get(`${BASE_URL}/api/accounts/provider/applications/`, {
        headers: { Authorization: `Token ${token}` },
      });
      setApplications(res.data);
    } catch (err) {
      console.error("Failed to fetch applications:", err);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  const handleChange = (e) => {
    const { name, value, files, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "file" ? files[0] : value,
    }));
  };

  const handleAddApplication = async () => {
    const token = localStorage.getItem("adminToken");
    const data = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      if (value) data.append(key, value);
    });

    try {
      await axios.post(`${BASE_URL}/api/accounts/provider/applications/create/`, data, {
        headers: {
          Authorization: `Token ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      setShowAddModal(false);
      setFormData({
        full_name: "",
        email: "",
        phone: "",
       
        company_name: "",
        address: "",
        gst_number: "",
        document: null,
      });
      fetchApplications();
    } catch (err) {
      console.error("Failed to submit application:", err.response?.data || err);
      alert("Submission failed. Check required fields.");
    }
  };

  const handleDeleteApplication = async (id) => {
    const token = localStorage.getItem("adminToken");
    try {
      await axios.delete(`${BASE_URL}/api/accounts/provider/applications/${id}/delete/`, {
        headers: { Authorization: `Token ${token}` },
      });
      fetchApplications();
    } catch (err) {
      console.error("Failed to delete application:", err.response?.data || err);
    }
  };

  return (
    <div className="provider-table-wrapper">
      <div className="table-header">
        <h2>Provider Applications</h2>
        <button className="add-provider-btn" onClick={() => setShowAddModal(true)}>
          + Add Application
        </button>
      </div>

      <div className="table-container">
        <table className="provider-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Full Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Company</th>
              <th>Submitted</th>
              <th>Document</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {applications.map((app, index) => (
              <tr key={app.id}>
                <td>{index + 1}</td>
                <td>{app.full_name}</td>
                <td>{app.email}</td>
                <td>{app.phone}</td>
                <td>{app.company_name}</td>
                <td>{new Date(app.submitted_at).toLocaleString()}</td>
                <td>
                  {app.document ? (
                    <a href={app.document} target="_blank" rel="noreferrer">View</a>
                  ) : (
                    "No File"
                  )}
                </td>
                <td className="action-icons">
                  <button className="icon-btn delete-btn" onClick={() => handleDeleteApplication(app.id)}>
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
            <span className="modal-close" onClick={() => setShowAddModal(false)}>&times;</span>
            <h3 className="modal-title">Add Provider Application</h3>
            <form onSubmit={(e) => e.preventDefault()} className="provider-form">
              <input
                name="full_name"
                placeholder="Full Name"
                value={formData.full_name}
                onChange={handleChange}
                className="form-input"
                required
              />
              <input
                name="email"
                type="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                className="form-input"
                required
              />
              <input
                name="phone"
                placeholder="Phone"
                value={formData.phone}
                onChange={handleChange}
                className="form-input"
                required
              />
              
              <input
                name="company_name"
                placeholder="Company Name"
                value={formData.company_name}
                onChange={handleChange}
                className="form-input"
                required
              />
              <input
                name="address"
                placeholder="Address"
                value={formData.address}
                onChange={handleChange}
                className="form-input"
                required
              />
              <input
                name="gst_number"
                placeholder="GST Number"
                value={formData.gst_number}
                onChange={handleChange}
                className="form-input"
              />
              <label className="form-label">Upload Document:
                <input
                  type="file"
                  name="document"
                  accept="application/pdf,image/*"
                  onChange={handleChange}
                  className="form-input-file"
                />
              </label>
              <div className="modal-actions">
                <button className="submit-btn" type="button" onClick={handleAddApplication}>
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProviderApplicationDash;
