import React, { useEffect, useState } from "react";
import axios from "axios";
import BASE_URL from "../config";
import './UsersAdminDash.css';
import { FaEdit, FaTrash } from "react-icons/fa";
import EditIconUserAdmin from "./EditIconUserAdmin";
import AddUserModal from "./AddUserModal"; // ✅ Import Add modal
import './EditProfile.css';

const UsersAdminDash = () => {
  const [users, setUsers] = useState([]);
  const [editingUserId, setEditingUserId] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false); // ✅ State for add modal

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = () => {
    const token = localStorage.getItem('adminToken');
    axios.get(`${BASE_URL}/api/accounts/admin/users/`, {
      headers: { Authorization: `Token ${token}` }
    }).then(response => {
      setUsers(response.data);
    }).catch(error => {
      console.error('Error fetching users:', error);
    });
  };

  const deleteUser = (userId) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      const token = localStorage.getItem('adminToken');
     axios.delete(`${BASE_URL}/api/accounts/admin/users/${userId}/delete/`, {
        headers: { Authorization: `Token ${token}` }
      })
      .then(() => {
        fetchUsers(); // Refresh after deletion
      })
      .catch(error => {
        console.error('Error deleting user:', error);
      });
    }
  };

  return (
    <div className="provider-table-wrapper">
      <div className="table-header">
        <h2>All Users</h2>
        <button className="add-provider-btn" onClick={() => setShowAddModal(true)}>
          + Add User
        </button>
      </div>

      <div className="table-container">
        <table className="provider-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Username</th>
              <th>Email</th>
              <th>Full Name</th>
              <th>Phone</th>
              <th>Gender</th>
              <th>Profile Photo</th>
              <th>Is Provider</th>
              <th>Is Staff</th>
              <th>Superuser</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user, index) => (
              <tr key={user.id}>
                <td>{index + 1}</td>
                <td>{user.username || '-'}</td>
                <td>{user.email || '-'}</td>
                <td>{user.full_name || '-'}</td>
                <td>{user.phone || '-'}</td>
                <td>{user.gender || '-'}</td>
                <td>
                  <img
                    src={user.profile_photo ? `${BASE_URL}${user.profile_photo}` : '/default-avatar.png'}
                    alt="Profile"
                    className="profile-photo"
                  />
                </td>
                <td>{user.is_provider ? 'Yes' : 'No'}</td>
                <td>{user.is_staff ? 'Yes' : 'No'}</td>
                <td>{user.is_superuser ? 'Yes' : 'No'}</td>
                <td className="action-icons">
                  <button
                    className="icon-btn edit-btn"
                    onClick={() => setEditingUserId(user.id)}
                  >
                    <FaEdit />
                  </button>
                  <button
                    className="icon-btn delete-btn"
                    onClick={() => deleteUser(user.id)}
                  >
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 🔧 Edit modal */}
      {editingUserId && (
        <EditIconUserAdmin
          userId={editingUserId}
          onClose={() => setEditingUserId(null)}
          onUpdated={fetchUsers}
        />
      )}

      {/* ✅ Add modal */}
      {showAddModal && (
        <AddUserModal
          onClose={() => setShowAddModal(false)}
          onUserAdded={fetchUsers}
        />
      )}
    </div>
  );
};

export default UsersAdminDash;
