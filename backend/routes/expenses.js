// routes/expenses.js
const express = require('express');
const router = express.Router();
const Expense = require('../models/Expense');

// Create a new expense
router.post('/', async (req, res) => {
  const { projectId, amount, description, date, investment,client,project } = req.body;
  const expense = new Expense({ projectId, amount, description, date, investment,client,project });

  try {
    const savedExpense = await expense.save();
    res.status(201).json(savedExpense);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get all expenses for a specific project
router.get('/:projectId', async (req, res) => {
  const { projectId } = req.params;
  try {
    const expenses = await Expense.find({ projectId });
    res.json(expenses);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

//Delete an expense
router.delete('/expenses/:id', async (req, res) => {
  try {
    const expense = await Expense.findByIdAndDelete(req.params.id);
    if (!expense) {
      return res.status(404).json({ message: 'Expense not found' });
    }
    res.status(200).json({ message: 'Expense deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to delete expense', error });
  }
});

router.put('/expenses/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updatedExpense = await Expense.findByIdAndUpdate(id, req.body, {
      new: true,
    });

    if (!updatedExpense) {
      return res.status(404).send({ message: 'Expense not found' });
    }

    res.send(updatedExpense);
  } catch (error) {
    res.status(500).send({ message: 'Error updating expense', error });
  }
});


// Fetch total expenses by individual names for a particular project
// Endpoint to fetch total expenses for "Muneeb" grouped by projectId
router.get('/investment-summary/:investment', async (req, res) => {
  const { investment } = req.params;

  try {
    // Fetch summary grouped by clientId and projectId
    const summary = await Expense.aggregate([
      { $match: { investment } }, // Filter by 'investment' field (Muneeb)
      {
        $lookup: {
          from: 'projects', // Join with projects collection
          localField: 'projectId', // Match projectId from expenses
          foreignField: '_id', // Match with _id from projects
          as: 'projectDetails'
        }
      },
      { $unwind: "$projectDetails" }, // Unwind to access project details
      {
        $group: {
          _id: { clientId: "$projectDetails.clientId", projectId: "$projectId" }, // Group by clientId and projectId
          totalExpense: { $sum: "$amount" }, // Sum expenses per project
          projectName: { $first: "$projectDetails.name" }, // Get project name
        }
      },
      {
        $lookup: {
          from: 'clients', // Join with clients collection to get client name
          localField: '_id.clientId', // Match clientId from projectDetails
          foreignField: '_id', // Match with _id from clients
          as: 'clientDetails'
        }
      },
      { $unwind: "$clientDetails" }, // Unwind to access client details
    ]);

    res.json(summary); // Send grouped data to frontend
  } catch (error) {
    console.error('Error fetching investment summary:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

router.get('/', async (req, res) => {
  try {
    const expenses = await Expense.find({});
    res.json(expenses);
  } catch (error) {
    console.error('Error fetching all expenses:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});







module.exports = router;
