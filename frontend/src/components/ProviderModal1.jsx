import React, { useState, useEffect } from "react";
import "./ProviderModal1.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import backendBaseURL from "../config";

const ProviderModal1 = ({ showModal, setShowModal }) => {
  const [step, setStep] = useState(1);
  const [stores, setStores] = useState([]);
  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    phone: "",
    gender: "",
    company_name: "",
    address: "",
    gst_number: "",
    store: "",
    document: null,
  });

  useEffect(() => {
    // Fetch stores on load
    const fetchStores = async () => {
      try {
        const res = await fetch(`${backendBaseURL}/stores/`);
        const data = await res.json();
        setStores(data);
      } catch (err) {
        console.error("Failed to fetch stores", err);
      }
    };
    fetchStores();
  }, []);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files) {
      setFormData((prev) => ({ ...prev, [name]: files[0] }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const validateForm = () => {
    const {
      full_name,
      email,
      phone,
      gender,
      company_name,
      address,
      gst_number,
      store,
      document,
    } = formData;

    return (
      full_name.trim() &&
      email.trim() &&
      phone.trim() &&
      gender &&
      company_name.trim() &&
      address.trim() &&
      gst_number.trim() &&
      store &&
      document
    );
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      alert("Please fill in all fields before submitting.");
      return;
    }

    const form = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      form.append(key, value);
    });

    try {
      const res = await fetch(`${backendBaseURL}/api/become-provider/`, {
        method: "POST",
        body: form,
      });

      if (!res.ok) throw new Error("Failed to submit form");

      const data = await res.json();
      alert(data.message || "Submitted successfully!");
      setShowModal(false);

      setFormData({
        full_name: "",
        email: "",
        phone: "",
        gender: "",
        company_name: "",
        address: "",
        gst_number: "",
        store: "",
        document: null,
      });
      setStep(1);
    } catch (err) {
      console.error("Error submitting provider form:", err);
      alert("Submission failed");
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <>
            <div className="provider-field">
              <label>Full Name</label>
              <input
                name="full_name"
                value={formData.full_name}
                onChange={handleChange}
              />
            </div>
            <div className="provider-field">
              <label>Email</label>
              <input
                name="email"
                value={formData.email}
                onChange={handleChange}
              />
            </div>
            <div className="provider-field">
              <label>Phone</label>
              <input
                name="phone"
                value={formData.phone}
                onChange={handleChange}
              />
            </div>
            <div className="provider-field">
              <label>Gender</label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
              >
                <option value="">Select</option>
                <option value="female">Female</option>
                <option value="male">Male</option>
                <option value="other">Other</option>
              </select>
            </div>
          </>
        );
      case 2:
        return (
          <>
            <div className="provider-field">
              <label>Company Name</label>
              <input
                name="company_name"
                value={formData.company_name}
                onChange={handleChange}
              />
            </div>
            <div className="provider-field">
              <label>Address</label>
              <textarea
                name="address"
                value={formData.address}
                onChange={handleChange}
              />
            </div>
            <div className="provider-field">
              <label>GST Number</label>
              <input
                name="gst_number"
                value={formData.gst_number}
                onChange={handleChange}
              />
            </div>
            <div className="provider-field">
              <label>Store</label>
              <select
                name="store"
                value={formData.store}
                onChange={handleChange}
              >
                <option value="">Select a store</option>
                {stores.map((store) => (
                  <option key={store.id} value={store.id}>
                    {store.name}
                  </option>
                ))}
              </select>
            </div>
          </>
        );
      case 3:
        return (
          <div className="provider-field">
            <label>Upload Document</label>
            <input type="file" name="document" onChange={handleChange} />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    showModal && (
      <div className="provider-backdrop" onClick={() => setShowModal(false)}>
        <div className="provider-modal" onClick={(e) => e.stopPropagation()}>
          <button
            className="provider-close-btn"
            onClick={() => setShowModal(false)}
          >
            <FontAwesomeIcon icon={faTimes} />
          </button>

          <h2 className="provider-title">Become a Provider</h2>
          <p className="provider-subtitle">Step {step} of 3</p>

          {renderStep()}

          <div className="provider-nav-buttons">
            {step > 1 && (
              <button
                className="provider-button back"
                onClick={() => setStep(step - 1)}
              >
                Back
              </button>
            )}
            {step < 3 ? (
              <button
                className="provider-button"
                onClick={() => setStep(step + 1)}
              >
                Next
              </button>
            ) : (
              <button className="provider-button" onClick={handleSubmit}>
                Submit
              </button>
            )}
          </div>
        </div>
      </div>
    )
  );
};

export default ProviderModal1;
