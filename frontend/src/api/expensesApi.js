import axios from 'axios';

// const API_URL = 'http://localhost:5000/api/expenses';

const API_URL = 'https://destiny-expense-tracker.onrender.com/api/expenses';

export const fetchExpenses = (projectId) => axios.get(`${API_URL}/project/${projectId}`);
export const createExpense = (expenseData) => axios.post(API_URL, expenseData);
    