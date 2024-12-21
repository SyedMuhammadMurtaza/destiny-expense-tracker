// // models/Expense.js
// const mongoose = require('mongoose');

// const expenseSchema = new mongoose.Schema({
//   description: { type: String, required: true },
//   amount: { type: String, required: true },
//   date: { type: String, required: true },
//   investment: { type: String, required: true },
//   client: { type: String, required: true }, // Add client field
//   clientId: { type: String, required: true },
//   project: { type: String, required: true }, // Add project field
//   projectId: { type: String, required: true },
// });

// const ExpenseModel  = mongoose.model("Expense", expenseSchema);

// module.exports = ExpenseModel;



const mongoose = require('mongoose');

const expenseSchema = new mongoose.Schema({
  description: { type: String, required: true },
  amount: { type: Number, required: true },
  date: { type: Date, required: true },
  investment: { type: String, required: true },
  clientId: { type: String, required: true },  // Client ID (reference)
  projectId: { type: String, required: true }, // Project ID (reference)
  selectedClient: { type: String, required: true },    // Client name
  selectedProject: { type: String, required: true },   // Project name
});

const ExpenseModel = mongoose.model('Expense', expenseSchema);

module.exports = ExpenseModel;
