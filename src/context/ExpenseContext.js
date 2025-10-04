import React, { createContext, useContext, useState } from 'react';

const ExpenseContext = createContext();

export const useExpenseContext = () => {
  const context = useContext(ExpenseContext);
  if (!context) {
    throw new Error('useExpenseContext must be used within an ExpenseProvider');
  }
  return context;
};

export const ExpenseProvider = ({ children }) => {
  // Sample expense data that will be shared between employee and manager
  const [expenses, setExpenses] = useState([
    {
      id: 1,
      employeeName: 'John Smith',
      description: 'Client lunch meeting',
      date: '2024-01-15',
      category: 'Meals',
      paidBy: 'Sarah Johnson',
      remarks: 'Important client discussion',
      amount: 85.50,
      status: 'waiting' // This will be updated by manager decisions
    },
    {
      id: 2,
      employeeName: 'Sarah Johnson',
      description: 'Office supplies',
      date: '2024-01-14',
      category: 'Office',
      paidBy: 'David Brown',
      remarks: 'Stationery and notebooks',
      amount: 45.20,
      status: 'waiting'
    },
    {
      id: 3,
      employeeName: 'Mike Wilson',
      description: 'Travel expenses',
      date: '2024-01-13',
      category: 'Travel',
      paidBy: 'Lisa Anderson',
      remarks: 'Business trip to NYC',
      amount: 320.75,
      status: 'draft'
    }
  ]);

  // Sample managers list
  const managers = [
    'John Smith',
    'Sarah Johnson', 
    'David Brown',
    'Lisa Anderson',
    'Mike Wilson'
  ];

  const updateExpenseStatus = (expenseId, newStatus) => {
    setExpenses(prev => prev.map(expense => 
      expense.id === expenseId ? { ...expense, status: newStatus } : expense
    ));
  };

  const addExpense = (newExpense) => {
    setExpenses(prev => [newExpense, ...prev]);
  };

  const updateExpense = (expenseId, field, value) => {
    setExpenses(prev => prev.map(expense => 
      expense.id === expenseId ? { ...expense, [field]: value } : expense
    ));
  };

  const value = {
    expenses,
    managers,
    updateExpenseStatus,
    addExpense,
    updateExpense
  };

  return (
    <ExpenseContext.Provider value={value}>
      {children}
    </ExpenseContext.Provider>
  );
};
