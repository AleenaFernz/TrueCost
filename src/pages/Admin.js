import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Admin = () => {
  const [formData, setFormData] = useState({
    name: '',
    role: 'employee',
    email: '',
    assignedTo: []
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [addedUsers, setAddedUsers] = useState([]);
  const navigate = useNavigate();

  // Mock list of existing users (in a real app, this would come from an API)
  const existingUsers = [
    { id: 1, name: 'John Smith', role: 'manager', email: 'john@company.com' },
    { id: 2, name: 'Sarah Johnson', role: 'manager', email: 'sarah@company.com' },
    { id: 3, name: 'Mike Wilson', role: 'employee', email: 'mike@company.com' },
    { id: 4, name: 'Emily Davis', role: 'employee', email: 'emily@company.com' },
    { id: 5, name: 'David Brown', role: 'manager', email: 'david@company.com' },
    { id: 6, name: 'Lisa Anderson', role: 'employee', email: 'lisa@company.com' }
  ];

  useEffect(() => {
    const user = localStorage.getItem('user');
    if (!user) {
      navigate('/login');
      return;
    }
    
    const userData = JSON.parse(user);
    if (userData.email !== 'admin123') {
      navigate('/dashboard');
    }
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
    
    // Clear success message when form changes
    if (successMessage) {
      setSuccessMessage('');
    }
  };

  const handleAssignedToChange = (e) => {
    const selectedOptions = Array.from(e.target.selectedOptions, option => option.value);
    setFormData(prev => ({
      ...prev,
      assignedTo: selectedOptions
    }));
    
    // Clear error when user starts selecting
    if (errors.assignedTo) {
      setErrors(prev => ({
        ...prev,
        assignedTo: ''
      }));
    }
    
    // Clear success message when form changes
    if (successMessage) {
      setSuccessMessage('');
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    
    // Simulate API call
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Add user to the list
      const newUser = {
        id: Date.now(), // Simple ID generation
        name: formData.name,
        role: formData.role,
        email: formData.email,
        assignedTo: formData.assignedTo.map(id => {
          const user = existingUsers.find(u => u.id === parseInt(id));
          return user ? user.name : 'Unknown';
        }),
        addedAt: new Date().toLocaleString()
      };
      
      setAddedUsers(prev => [newUser, ...prev]);
      
      // Simulate sending password
      setSuccessMessage(`Password sent successfully to ${formData.email} for ${formData.role} ${formData.name}`);
      
      // Reset form
      setFormData({
        name: '',
        role: 'employee',
        email: '',
        assignedTo: []
      });
      
    } catch (error) {
      setErrors({ general: 'An error occurred. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteUser = (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      setAddedUsers(prev => prev.filter(user => user.id !== userId));
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <div className="admin-container">
      <div className="admin-header">
        <h1 className="admin-title">Admin Panel</h1>
        <p className="admin-subtitle">Manage employees and managers</p>
        <button onClick={handleLogout} className="logout-button">
          Logout
        </button>
      </div>

      <div className="admin-content">
        <div className="admin-form-container">
          <div className="form-header">
            <h2 className="form-title">Add New User</h2>
            <p className="form-subtitle">Create a new employee or manager account</p>
          </div>

          <form onSubmit={handleSubmit} className={isLoading ? 'loading' : ''}>
            <div className="form-group">
              <label htmlFor="name" className="form-label">Full Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="form-input"
                placeholder="Enter full name"
                disabled={isLoading}
              />
              {errors.name && <span className="error-message">{errors.name}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="role" className="form-label">Role</label>
              <select
                id="role"
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="form-select"
                disabled={isLoading}
              >
                <option value="employee">Employee</option>
                <option value="manager">Manager</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="email" className="form-label">Email Address</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="form-input"
                placeholder="Enter email address"
                disabled={isLoading}
              />
              {errors.email && <span className="error-message">{errors.email}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="assignedTo" className="form-label">Assigned To</label>
              <select
                id="assignedTo"
                name="assignedTo"
                value={formData.assignedTo}
                onChange={handleAssignedToChange}
                className="form-multiselect"
                multiple
                disabled={isLoading}
              >
                {existingUsers.map(user => (
                  <option key={user.id} value={user.id}>
                    {user.name} ({user.role})
                  </option>
                ))}
              </select>
              <div className="form-help-text">
                Hold Ctrl (or Cmd on Mac) to select multiple people
              </div>
              {errors.assignedTo && <span className="error-message">{errors.assignedTo}</span>}
            </div>

            {errors.general && <span className="error-message">{errors.general}</span>}
            {successMessage && <span className="success-message">{successMessage}</span>}

            <button type="submit" className="form-button" disabled={isLoading}>
              {isLoading ? 'Sending Password...' : 'Send Password'}
            </button>
          </form>
        </div>

        <div className="admin-users-container">
          <div className="users-header">
            <h2 className="users-title">Added Users</h2>
            <p className="users-subtitle">Users created in this session</p>
          </div>

          <div className="users-list">
            {addedUsers.length === 0 ? (
              <div className="no-users">
                <p>No users added yet</p>
                <p className="no-users-subtitle">Add a user using the form on the left</p>
              </div>
            ) : (
              addedUsers.map(user => (
                <div key={user.id} className="user-card">
                  <div className="user-card-header">
                    <div className="user-info">
                      <h3 className="user-name">{user.name}</h3>
                      <p className="user-role">{user.role}</p>
                      <p className="user-email">{user.email}</p>
                      <p className="user-added">Added: {user.addedAt}</p>
                    </div>
                    <button 
                      onClick={() => handleDeleteUser(user.id)}
                      className="delete-user-button"
                      title="Delete user"
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </button>
                  </div>
                  {user.assignedTo.length > 0 && (
                    <div className="user-assignments">
                      <p className="assignments-label">Assigned to:</p>
                      <div className="assignments-list">
                        {user.assignedTo.map((name, index) => (
                          <span key={index} className="assignment-tag">
                            {name}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Admin;
