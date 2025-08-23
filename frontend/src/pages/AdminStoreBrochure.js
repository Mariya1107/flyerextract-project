// src/pages/AdminStoreBrochure.js
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import "./FlyerList.css";
import "./UsersAdminDash.css";
import BASE_URL from "../config";

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

const AdminStoreBrochure = () => {
  const { store_slug } = useParams();
  const storeSlug = store_slug;
  const navigate = useNavigate();

  const [brochures, setBrochures] = useState([]);
  const [numPages, setNumPages] = useState({});
  const [showForm, setShowForm] = useState(false);
  const [storeOptions, setStoreOptions] = useState([]);
  const [regionOptions, setRegionOptions] = useState([]);
  const [formData, setFormData] = useState({
    store_id: "",
    region_id: "",
    title: "",
    pdf: null,
    image: null,
    expires_at: "",
  });

  const token = localStorage.getItem("adminToken");

  // Set auth header
  useEffect(() => {
    if (!token) {
      navigate("/admin-login");
    } else {
      axios.defaults.headers.common["Authorization"] = `Token ${token}`;
    }
  }, [token, navigate]);

  // Fetch brochures for the store
  const fetchBrochures = async () => {
    if (!storeSlug) return setBrochures([]);
    try {
      const res = await axios.get(`${BASE_URL}/flyers/store/${storeSlug}/`);
      setBrochures(res.data || []);
    } catch (err) {
      console.error("Error fetching brochures:", err.response?.data || err.message);
      setBrochures([]);
    }
  };

  // Fetch stores and regions
  const fetchDropdownData = async () => {
    try {
      const [storesRes, regionsRes] = await Promise.all([
        axios.get(`${BASE_URL}/stores/`),
        axios.get(`${BASE_URL}/regions/`),
      ]);
      const stores = storesRes.data.results || storesRes.data;
      const regions = regionsRes.data.results || regionsRes.data;
      setStoreOptions(stores);
      setRegionOptions(regions);

      // Preselect current store if slug matches
      if (storeSlug) {
        const selected = stores.find((s) => s.slug === storeSlug);
        if (selected) setFormData((prev) => ({ ...prev, store_id: selected.id }));
      }
    } catch (err) {
      console.error("Error fetching dropdown options:", err.response?.data || err.message);
    }
  };

  useEffect(() => {
    if (token) {
      fetchBrochures();
      fetchDropdownData();
    }
  }, [storeSlug, token]);

  const onDocumentLoadSuccess = (brochureId, { numPages }) => {
    setNumPages((prev) => ({ ...prev, [brochureId]: numPages }));
  };

  const handleFormToggle = () => setShowForm(!showForm);

  const handleFormChange = (e) => {
    const { name, value, type, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "file" ? files[0] : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.region_id || !formData.title || !formData.store_id) {
      alert("Store, region, and title are required.");
      return;
    }

    try {
      const data = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (value !== null && value !== "") data.append(key, value);
      });

      await axios.post(`${BASE_URL}/api/flyers/create/`, data, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Token ${token}`,
        },
      });

      setShowForm(false);
      setFormData({
        store_id: "",
        region_id: "",
        title: "",
        pdf: null,
        image: null,
        expires_at: "",
      });
      fetchBrochures();
    } catch (error) {
      console.error("Error submitting form:", error.response?.data || error.message);
      alert(`Error creating brochure: ${JSON.stringify(error.response?.data || error.message)}`);
    }
  };

  const handleDelete = async (flyerSlug) => {
    if (!window.confirm("Are you sure you want to delete this brochure?")) return;
    try {
      await axios.delete(`${BASE_URL}/api/flyers/${flyerSlug}/delete/`);
      fetchBrochures();
    } catch (error) {
      console.error("Error deleting flyer:", error.response?.data || error.message);
      alert("Failed to delete brochure.");
    }
  };

  return (
    <div className="flyer-list-wrapper">
      <div className="table-header">
        <h2 className="dashboard-title">Store Brochures</h2>
        <button className="add-provider-btn" onClick={handleFormToggle}>+ Add Brochure</button>
      </div>

      {showForm && (
        <div className="modal">
          <div className="modal-content edit-profile-container">
            <button className="close-button" onClick={() => setShowForm(false)}>✖</button>
            <h2>Add New Brochure</h2>
            <form className="edit-profile-form" onSubmit={handleSubmit}>
              <label>
                Store:
                <select
                  name="store_id"
                  value={formData.store_id}
                  onChange={handleFormChange}
                  required
                >
                  <option value="">Select Store</option>
                  {storeOptions.map((store) => (
                    <option key={store.id} value={store.id}>{store.name}</option>
                  ))}
                </select>
              </label>

              <label>
                Region:
                <select
                  name="region_id"
                  value={formData.region_id}
                  onChange={handleFormChange}
                  required
                >
                  <option value="">Select Region</option>
                  {regionOptions.map((region) => (
                    <option key={region.id} value={region.id}>{region.name}, {region.country?.name}</option>
                  ))}
                </select>
              </label>

              <input
                name="title"
                placeholder="Title"
                value={formData.title}
                onChange={handleFormChange}
                required
              />

              <label>
                PDF:
                <input type="file" name="pdf" accept="application/pdf" onChange={handleFormChange} />
              </label>

              <label>
                Image:
                <input type="file" name="image" accept="image/*" onChange={handleFormChange} />
              </label>

              <label>
                Expires At:
                <input
                  type="date"
                  name="expires_at"
                  value={formData.expires_at}
                  onChange={handleFormChange}
                />
              </label>

              <div className="form-actions">
                <button type="submit">Save</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {brochures.length === 0 ? (
        <p className="no-flyers">🚫 No brochures available for this store.</p>
      ) : (
        <div className="flyer-grid">
          {brochures.map((brochure) => (
            <div key={brochure.id} className="flyer-card fade-in">
              <div className="flyer-img-wrapper">
                <div className="flyer-overlay-container">
                  {brochure.image ? (
                    <img
                      src={brochure.image.startsWith("http") ? brochure.image : `${BASE_URL}${brochure.image}`}
                      alt={brochure.title || "Brochure"}
                      className="flyer-img"
                    />
                  ) : brochure.pdf ? (
                    <div className="pdf-container">
                      <Document
                        file={brochure.pdf.startsWith("http") ? brochure.pdf : `${BASE_URL}${brochure.pdf}`}
                        onLoadSuccess={(pdf) => onDocumentLoadSuccess(brochure.id, pdf)}
                        loading="Loading PDF..."
                      >
                        <Page pageNumber={1} width={240} />
                      </Document>
                    </div>
                  ) : (
                    <p>No preview available</p>
                  )}

                  <div className="flyer-hover-overlay">
                    <button className="flyer-hover-btn" onClick={() => handleDelete(brochure.slug)}>Delete</button>
                  </div>
                </div>
                <span className="flyer-tag">📌 Brochure</span>
              </div>
              <div className="flyer-info">
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <strong>{brochure.title || "Untitled Brochure"}</strong>
                  {brochure.expires_at && (
                    <span style={{ color: "red", fontSize: "1.1rem" }}>
                      Expires: {new Date(brochure.expires_at).toLocaleDateString()}
                    </span>
                  )}
                </div>
                <button className="flyer-view-btn" disabled>Explore →</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminStoreBrochure;
