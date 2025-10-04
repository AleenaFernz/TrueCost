import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useExpenseContext } from '../context/ExpenseContext';

const Employee = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { expenses, managers, addExpense, updateExpense } = useExpenseContext();

  useEffect(() => {
    const user = localStorage.getItem('user');
    if (!user) {
      navigate('/login');
      return;
    }
    
    const userData = JSON.parse(user);
    if (userData.role !== 'employee') {
      navigate('/dashboard');
    }
  }, [navigate]);

  const handleUpload = () => {
    // Simulate file upload
    setIsLoading(true);
    setTimeout(() => {
      alert('File upload functionality would be implemented here');
      setIsLoading(false);
    }, 1000);
  };

  const handleNewExpense = () => {
    // Add a new empty expense row
    const newExpense = {
      id: Date.now(),
      employeeName: 'Current User',
      description: '',
      date: new Date().toISOString().split('T')[0],
      category: '',
      paidBy: managers[0],
      remarks: '',
      amount: 0,
      status: 'draft'
    };
    addExpense(newExpense);
  };

  const handleInputChange = (id, field, value) => {
    updateExpense(id, field, value);
  };


  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/login');
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved':
        return 'status-approved';
      case 'waiting':
        return 'status-waiting';
      case 'draft':
        return 'status-draft';
      case 'rejected':
        return 'status-rejected';
      default:
        return 'status-draft';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'approved':
        return 'Approved';
      case 'waiting':
        return 'Waiting';
      case 'draft':
        return 'Draft';
      case 'rejected':
        return 'Rejected';
      default:
        return 'Draft';
    }
  };

  return (
    <div className="employee-container">
      <div className="employee-header">
        <h1 className="employee-title">Expense Tracker</h1>
        <p className="employee-subtitle">Manage your expense reports</p>
        <button onClick={handleLogout} className="logout-button">
          Logout
        </button>
      </div>

      <div className="employee-actions">
        <button 
          onClick={handleUpload} 
          className="action-button upload-button"
          disabled={isLoading}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M21 15V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <polyline points="17,8 12,3 7,8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <line x1="12" y1="3" x2="12" y2="15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Upload File
        </button>
        
        <button 
          onClick={handleNewExpense} 
          className="action-button new-button"
          disabled={isLoading}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <line x1="12" y1="5" x2="12" y2="19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <line x1="5" y1="12" x2="19" y2="12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          New Expense
        </button>
      </div>

      <div className="expenses-table-container">
        <div className="table-header">
          <h2 className="table-title">Expense Reports</h2>
          <p className="table-subtitle">Track and manage your expenses</p>
        </div>

        <div className="table-wrapper">
          <table className="expenses-table">
            <thead>
              <tr>
                <th>Employee Name</th>
                <th>Description</th>
                <th>Date</th>
                <th>Category</th>
                <th>Paid By</th>
                <th>Remarks</th>
                <th>Amount</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {expenses.map(expense => (
                <tr key={expense.id}>
                  <td>
                    <input
                      type="text"
                      value={expense.employeeName}
                      onChange={(e) => handleInputChange(expense.id, 'employeeName', e.target.value)}
                      className="table-input"
                      placeholder="Employee name"
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      value={expense.description}
                      onChange={(e) => handleInputChange(expense.id, 'description', e.target.value)}
                      className="table-input"
                      placeholder="Description"
                    />
                  </td>
                  <td>
                    <input
                      type="date"
                      value={expense.date}
                      onChange={(e) => handleInputChange(expense.id, 'date', e.target.value)}
                      className="table-input"
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      value={expense.category}
                      onChange={(e) => handleInputChange(expense.id, 'category', e.target.value)}
                      className="table-input"
                      placeholder="Category"
                    />
                  </td>
                  <td>
                    <select
                      value={expense.paidBy}
                      onChange={(e) => handleInputChange(expense.id, 'paidBy', e.target.value)}
                      className="table-select"
                    >
                      {managers.map(manager => (
                        <option key={manager} value={manager}>
                          {manager}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td>
                    <input
                      type="text"
                      value={expense.remarks}
                      onChange={(e) => handleInputChange(expense.id, 'remarks', e.target.value)}
                      className="table-input"
                      placeholder="Remarks"
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      step="0.01"
                      value={expense.amount}
                      onChange={(e) => handleInputChange(expense.id, 'amount', parseFloat(e.target.value) || 0)}
                      className="table-input amount-input"
                      placeholder="0.00"
                    />
                  </td>
                  <td>
                    <span className={`status-badge ${getStatusColor(expense.status)}`}>
                      {getStatusText(expense.status)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Employee;
