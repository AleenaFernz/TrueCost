import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

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
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (formData.email !== 'admin123' && formData.email !== 'employee123' && formData.email !== 'manager123' && !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
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
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Check for admin login
      if (formData.email === 'admin123' && formData.password === 'admin123') {
        localStorage.setItem('user', JSON.stringify({
          email: 'admin123',
          name: 'Admin',
          role: 'admin'
        }));
        navigate('/admin');
      }
      // Check for employee login
      else if (formData.email === 'employee123' && formData.password === 'employee123') {
        localStorage.setItem('user', JSON.stringify({
          email: 'employee123',
          name: 'Employee',
          role: 'employee'
        }));
        navigate('/employee');
      }
      // Check for manager login
      else if (formData.email === 'manager123' && formData.password === 'manager123') {
        localStorage.setItem('user', JSON.stringify({
          email: 'manager123',
          name: 'Manager',
          role: 'manager'
        }));
        navigate('/manager');
      }
      // For demo purposes, accept any valid email/password combination
      else if (formData.email && formData.password.length >= 6) {
        // Store user data in localStorage for demo
        localStorage.setItem('user', JSON.stringify({
          email: formData.email,
          name: formData.email.split('@')[0]
        }));
        
        navigate('/dashboard');
      } else {
        setErrors({ general: 'Invalid email or password' });
      }
    } catch (error) {
      setErrors({ general: 'An error occurred. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="form-container">
      <div className="form-header">
        <h1 className="form-title">Welcome Back</h1>
        <p className="form-subtitle">Sign in to your expense tracker account</p>
      </div>

      <form onSubmit={handleSubmit} className={isLoading ? 'loading' : ''} noValidate>
        <div className="form-group">
          <label htmlFor="email" className="form-label">Email Address</label>
          <input
            type="text"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="form-input"
            placeholder="Enter your email (admin123/admin, employee123/employee, manager123/manager)"
            disabled={isLoading}
          />
          {errors.email && <span className="error-message">{errors.email}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="password" className="form-label">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className="form-input"
            placeholder="Enter your password"
            disabled={isLoading}
          />
          {errors.password && <span className="error-message">{errors.password}</span>}
        </div>

        {errors.general && <span className="error-message">{errors.general}</span>}

        <button type="submit" className="form-button" disabled={isLoading}>
          {isLoading ? 'Signing In...' : 'Sign In'}
        </button>
      </form>

      <div className="form-link">
        Don't have an account? <Link to="/signup">Sign up here</Link>
      </div>
    </div>
  );
};

export default Login;
