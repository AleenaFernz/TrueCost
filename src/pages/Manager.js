import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useExpenseContext } from '../context/ExpenseContext';

const Manager = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { expenses, updateExpenseStatus } = useExpenseContext();

  useEffect(() => {
    const user = localStorage.getItem('user');
    if (!user) {
      navigate('/login');
      return;
    }
    
    const userData = JSON.parse(user);
    if (userData.role !== 'manager') {
      navigate('/dashboard');
    }
  }, [navigate]);

  const handleInputChange = (id, field, value) => {
    // Update the expense in the shared context
    if (field === 'approvalDecision') {
      // Map approval decision to status
      let newStatus = 'draft';
      if (value === 'approved') {
        newStatus = 'approved';
      } else if (value === 'rejected') {
        newStatus = 'rejected';
      }
      updateExpenseStatus(id, newStatus);
    }
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
    <div className="manager-container">
      <div className="manager-header">
        <h1 className="manager-title">Approval Dashboard</h1>
        <p className="manager-subtitle">Review and approve expense requests</p>
        <button onClick={handleLogout} className="logout-button">
          Logout
        </button>
      </div>

      <div className="approvals-table-container">
        <div className="table-header">
          <h2 className="table-title">Expense Approvals</h2>
          <p className="table-subtitle">Manage employee expense requests</p>
        </div>

        <div className="table-wrapper">
          <table className="approvals-table">
            <thead>
              <tr>
                <th>Approval Subject (Employee Name)</th>
                <th>Request Owner (Manager Name)</th>
                <th>Category</th>
                <th>Request Status</th>
                <th>Total Amount</th>
                <th>Approval Decision</th>
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
                      value={expense.paidBy}
                      onChange={(e) => handleInputChange(expense.id, 'paidBy', e.target.value)}
                      className="table-input"
                      placeholder="Manager name"
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
                    <span className={`status-badge ${getStatusColor(expense.status)}`}>
                      {getStatusText(expense.status)}
                    </span>
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
                    <select
                      value={expense.status === 'approved' ? 'approved' : expense.status === 'rejected' ? 'rejected' : ''}
                      onChange={(e) => handleInputChange(expense.id, 'approvalDecision', e.target.value)}
                      className="table-select approval-select"
                    >
                      <option value="">Select Decision</option>
                      <option value="approved">Approved</option>
                      <option value="rejected">Rejected</option>
                    </select>
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

export default Manager;
