import React, { useEffect, useState } from "react";
import axios from "axios";
import BASE_URL from "../config";
import "../pages/ProviderLoginDashboard.css";
import "./ProvidersAdminDash.css";

const ProvidersAdminDash = () => {
  const [stores, setStores] = useState([]);
  const [selectedStore, setSelectedStore] = useState(null);
  const [editForm, setEditForm] = useState({ name: "", logo: null });
  const [message, setMessage] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [addForm, setAddForm] = useState({ name: "", logo: null });
  const [addMessage, setAddMessage] = useState("");

  const token = localStorage.getItem("token");

  const fetchStores = async () => {
  try {
    const res = await axios.get(`${BASE_URL}/api/accounts/stores/`, {
      headers: {
        Authorization: `Token ${token}`, // if your API requires auth
      },
    });
    console.log("Stores API response:", res.data);
    setStores(res.data);
  } catch (err) {
    console.error("Error fetching stores", err);
  }
};

  useEffect(() => {
    fetchStores();
  }, []);

  const handleCardClick = (store) => {
    setSelectedStore(store);
    setEditForm({ name: store.name, logo: null });
    setMessage("");
  };

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "logo") {
      setEditForm((prev) => ({ ...prev, logo: files[0] }));
    } else {
      setEditForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleAddInputChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "logo") {
      setAddForm((prev) => ({ ...prev, logo: files[0] }));
    } else {
      setAddForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedStore) return;

    const formData = new FormData();
    formData.append("name", editForm.name);
    if (editForm.logo) {
      formData.append("logo", editForm.logo);
    }

    try {
      const res = await axios.put(
        `${BASE_URL}/api/accounts/stores/${selectedStore.id}/update/`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Token ${token}`,
          },
        }
      );

      const updatedStores = stores.map((s) =>
        s.id === res.data.id ? res.data : s
      );
      setStores(updatedStores);
      setMessage("Store updated successfully!");
      setTimeout(() => {
        setSelectedStore(null);
        setMessage("");
      }, 1000);
    } catch (error) {
      console.error("Update failed", error);
      setMessage("Update failed. Check console.");
    }
  };

  const handleAddSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("name", addForm.name);
    if (addForm.logo) {
      formData.append("logo", addForm.logo);
    }

    try {
      const res = await axios.post(
        `${BASE_URL}/api/accounts/stores/create/`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Token ${token}`,
          },
        }
      );

      setStores([...stores, res.data]);
      setAddMessage("Store added successfully!");
      setAddForm({ name: "", logo: null });

      setTimeout(() => {
        setShowAddModal(false);
        setAddMessage("");
      }, 1000);
    } catch (error) {
      console.error("Add failed", error);
      setAddMessage("Add failed. Check console.");
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this store?")) return;

    try {
      const res = await axios.delete(
        `${BASE_URL}/api/accounts/stores/${selectedStore.id}/delete/`,
        {
          headers: {
            Authorization: `Token ${token}`,
          },
        }
      );

      if (res.status === 200) {
        alert("Store deleted successfully!");
        setSelectedStore(null);
        fetchStores();
      } else {
        alert("Failed to delete store");
      }
    } catch (error) {
      console.error("Delete error:", error);
      alert("Something went wrong while deleting");
    }
  };

  return (
    <div className="main-content">
      <div className="dashboard-header">
        <h2 className="dashboard-title">All Stores</h2>
        <div className="add-user-wrapper">
          <button
            className="add-provider-btn"
            onClick={() => setShowAddModal(true)}
          >
            + Add Store
          </button>
        </div>
      </div>

      <div className="category-grid">
        {stores.map((store) => (
          <div
            className="category-card"
            key={store.id}
            onClick={() => handleCardClick(store)}
          >
            <div className="category-icon">
              <img
                src={
                  store.logo?.startsWith("http")
                    ? store.logo
                    : `${BASE_URL}${store.logo}`
                }
                alt={store.name}
                className="img-fluid"
                onError={(e) =>
                  (e.target.src =
                    "https://via.placeholder.com/100x100?text=Logo")
                }
              />
            </div>
            <h6>{store.name}</h6>
            <p>Edit Store</p>
          </div>
        ))}
      </div>

      {/* Edit Store Modal */}
      {selectedStore && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button
              className="close-button"
              onClick={() => setSelectedStore(null)}
            >
              ✖
            </button>
            <h3>Edit Store</h3>
            <form onSubmit={handleSubmit}>
              <label>
                Store Name:
                <input
                  type="text"
                  name="name"
                  value={editForm.name}
                  onChange={handleInputChange}
                  required
                />
              </label>
              <label>
                Logo:
                <input
                  type="file"
                  name="logo"
                  accept="image/*"
                  onChange={handleInputChange}
                />
              </label>
              {message && <p className="status-msg">{message}</p>}

              <div
                className="form-actions2"
                style={{ display: "flex", gap: "20px", marginTop: "20px" }}
              >
                <button type="submit" className="submit-btn">
                  Save
                </button>
                <button
                  type="button"
                  className="deletebtn"
                  onClick={handleDelete}
                >
                  Delete
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Store Modal */}
      {showAddModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button
              className="close-button"
              onClick={() => setShowAddModal(false)}
            >
              ✖
            </button>

            <h3>Add New Store</h3>
            <form onSubmit={handleAddSubmit}>
              <label>
                Store Name:
                <input
                  type="text"
                  name="name"
                  value={addForm.name}
                  onChange={handleAddInputChange}
                  required
                />
              </label>
              <label>
                Logo:
                <input
                  type="file"
                  name="logo"
                  accept="image/*"
                  onChange={handleAddInputChange}
                />
              </label>
              {addMessage && <p className="status-msg">{addMessage}</p>}
              <button type="submit" className="submit-btn">
                Add Store
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};


export default ProvidersAdminDash;
