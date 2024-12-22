// models/Expense.js
const mongoose = require('mongoose');

const expenseSchema = new mongoose.Schema({
  description: String,
  amount: Number,
  date: Date,
  investment: String,  // Assuming this is a string field
  clientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Client'
  },
  projectId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project'
  },
});

const Expense = mongoose.model('Expense', expenseSchema);

module.exports = Expense;
