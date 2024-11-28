const express = require('express');
const router = express.Router();
const Client = require('../models/Client');

// Create a new client
router.post('/', async (req, res) => {
  const client = new Client(req.body);
  try {
    const savedClient = await client.save();
    res.json(savedClient);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get all clients
router.get('/', async (req, res) => {
  try {
    const clients = await Client.find();
    res.json(clients);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


module.exports = router;
