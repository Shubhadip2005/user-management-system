import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authAPI, userAPI } from '../../api/api';
import Navbar from '../Navbar/Navbar';
import './Profile.css';

function Profile({ onLogout }) {
  const [user, setUser] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    age: '',
    currentPassword: '',
    newPassword: ''
  });
  const [deletePassword, setDeletePassword] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await authAPI.getProfile();
      setUser(response.data.data);
      setFormData({
        name: response.data.data.name,
        email: response.data.data.email,
        age: response.data.data.age,
        currentPassword: '',
        newPassword: ''
      });
    } catch (err) {
      if (err.response?.status === 401) {
        onLogout();
      } else {
        showMessage('error', 'Failed to load profile');
      }
    } finally {
      setLoading(false);
    }
  };

  const showMessage = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: '', text: '' }), 5000);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    if (message.text) setMessage({ type: '', text: '' });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setActionLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const dataToSend = {
        name: formData.name,
        email: formData.email,
        age: parseInt(formData.age)
      };

      if (formData.newPassword) {
        if (!formData.currentPassword) {
          showMessage('error', 'Current password is required to change password');
          setActionLoading(false);
          return;
        }
        if (formData.newPassword.length < 6) {
          showMessage('error', 'New password must be at least 6 characters');
          setActionLoading(false);
          return;
        }
        dataToSend.currentPassword = formData.currentPassword;
        dataToSend.newPassword = formData.newPassword;
      }

      const response = await userAPI.updateProfile(dataToSend);
      setUser(response.data.data);
      showMessage('success', 'Profile updated successfully!');
      setEditMode(false);
      setFormData({
        ...formData,
        currentPassword: '',
        newPassword: ''
      });
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Failed to update profile';
      showMessage('error', errorMsg);
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!deletePassword) {
      showMessage('error', 'Please enter your password to delete account');
      return;
    }

    setActionLoading(true);
    setMessage({ type: '', text: '' });

    try {
      await userAPI.deleteAccount(deletePassword);
      showMessage('success', 'Account deleted successfully');
      setTimeout(() => {
        onLogout();
        navigate('/login');
      }, 1500);
    } catch (err) {
      // Handle wrong password error specifically
      if (err.response?.status === 401) {
        showMessage('error', 'Incorrect password. Please try again.');
      } else {
        const errorMsg = err.response?.data?.message || 'Failed to delete account';
        showMessage('error', errorMsg);
      }
      setActionLoading(false);
      setDeletePassword('');
    }
  };

  const openDeleteModal = () => {
    setDeletePassword('');
    setMessage({ type: '', text: '' });
    setShowDeleteModal(true);
  };

  const closeDeleteModal = () => {
    setShowDeleteModal(false);
    setDeletePassword('');
    setMessage({ type: '', text: '' });
  };

  if (loading) {
    return (
      <div className="profile-page">
        <Navbar onLogout={onLogout} />
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-page">
      <Navbar onLogout={onLogout} />
      
      <div className="profile-container">
        <div className="profile-header-banner">
          <div className="banner-gradient"></div>
          <div className="profile-avatar-large">
            {user?.name.charAt(0).toUpperCase()}
          </div>
        </div>

        <div className="profile-content">
          {message.text && (
            <div className={`alert alert-${message.type}`}>
              {message.type === 'success' ? (
                <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                </svg>
              ) : (
                <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd"/>
                </svg>
              )}
              <span>{message.text}</span>
            </div>
          )}

          <div className="profile-card">
            <div className="card-header">
              <h2>Personal Information</h2>
              {!editMode && (
                <button className="btn-edit" onClick={() => setEditMode(true)}>
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z"/>
                  </svg>
                  Edit Profile
                </button>
              )}
            </div>

            {!editMode ? (
              <div className="profile-view">
                <div className="info-row">
                  <div className="info-item">
                    <label>Full Name</label>
                    <p>{user?.name}</p>
                  </div>
                  <div className="info-item">
                    <label>Age</label>
                    <p>{user?.age} years</p>
                  </div>
                </div>

                <div className="info-row">
                  <div className="info-item">
                    <label>Email Address</label>
                    <p>{user?.email}</p>
                  </div>
                </div>

                <div className="info-row">
                  <div className="info-item">
                    <label>Member Since</label>
                    <p>{new Date(user?.created_at).toLocaleDateString('en-US', { 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}</p>
                  </div>
                  <div className="info-item">
                    <label>Last Updated</label>
                    <p>{new Date(user?.updated_at).toLocaleDateString('en-US', { 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}</p>
                  </div>
                </div>
              </div>
            ) : (
              <form onSubmit={handleUpdate} className="profile-form">
                <div className="form-row">
                  <div className="input-group">
                    <label htmlFor="name">Full Name</label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      disabled={actionLoading}
                    />
                  </div>
                  <div className="input-group">
                    <label htmlFor="age">Age</label>
                    <input
                      type="number"
                      id="age"
                      name="age"
                      value={formData.age}
                      onChange={handleChange}
                      min="0"
                      max="150"
                      required
                      disabled={actionLoading}
                    />
                  </div>
                </div>

                <div className="input-group">
                  <label htmlFor="email">Email Address</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    disabled={actionLoading}
                  />
                </div>

                <div className="form-divider">
                  <span>Change Password (Optional)</span>
                </div>

                <div className="form-row">
                  <div className="input-group">
                    <label htmlFor="currentPassword">Current Password</label>
                    <input
                      type="password"
                      id="currentPassword"
                      name="currentPassword"
                      value={formData.currentPassword}
                      onChange={handleChange}
                      placeholder="Leave blank to keep current"
                      disabled={actionLoading}
                    />
                  </div>
                  <div className="input-group">
                    <label htmlFor="newPassword">New Password</label>
                    <input
                      type="password"
                      id="newPassword"
                      name="newPassword"
                      value={formData.newPassword}
                      onChange={handleChange}
                      placeholder="Leave blank to keep current"
                      disabled={actionLoading}
                    />
                  </div>
                </div>

                <div className="form-actions">
                  <button type="submit" className="btn-save" disabled={actionLoading}>
                    {actionLoading ? (
                      <>
                        <div className="spinner"></div>
                        Saving...
                      </>
                    ) : (
                      <>
                        <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M7.707 10.293a1 1 0 10-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 11.586V6h5a2 2 0 012 2v7a2 2 0 01-2 2H4a2 2 0 01-2-2V8a2 2 0 012-2h5v5.586l-1.293-1.293zM9 4a1 1 0 012 0v2H9V4z"/>
                        </svg>
                        Save Changes
                      </>
                    )}
                  </button>
                  <button 
                    type="button" 
                    className="btn-cancel"
                    onClick={() => {
                      setEditMode(false);
                      setFormData({
                        name: user.name,
                        email: user.email,
                        age: user.age,
                        currentPassword: '',
                        newPassword: ''
                      });
                      setMessage({ type: '', text: '' });
                    }}
                    disabled={actionLoading}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </div>

          <div className="danger-zone">
            <div className="danger-header">
              <div>
                <h3>Delete Account</h3>
                <p>Permanently delete your account and all associated data</p>
              </div>
              <button className="btn-delete" onClick={openDeleteModal}>
                <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd"/>
                </svg>
                Delete Account
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="modal-overlay" onClick={closeDeleteModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-icon modal-icon-danger">
                <svg width="24" height="24" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd"/>
                </svg>
              </div>
              <h3>Delete Account</h3>
              <p>This action cannot be undone. All your data will be permanently deleted.</p>
            </div>

            <div className="modal-body">
              <div className="input-group">
                <label htmlFor="deletePassword">Confirm your password to continue</label>
                <input
                  type="password"
                  id="deletePassword"
                  value={deletePassword}
                  onChange={(e) => {
                    setDeletePassword(e.target.value);
                    if (message.text) setMessage({ type: '', text: '' });
                  }}
                  placeholder="Enter your password"
                  disabled={actionLoading}
                  autoFocus
                />
              </div>
            </div>

            <div className="modal-actions">
              <button 
                className="btn-modal-cancel" 
                onClick={closeDeleteModal}
                disabled={actionLoading}
              >
                Cancel
              </button>
              <button 
                className="btn-modal-delete" 
                onClick={handleDeleteAccount}
                disabled={actionLoading || !deletePassword}
              >
                {actionLoading ? (
                  <>
                    <div className="spinner"></div>
                    Deleting...
                  </>
                ) : (
                  <>
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd"/>
                    </svg>
                    Delete Account
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Profile;