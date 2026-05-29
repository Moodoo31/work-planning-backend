const express = require('express');
const Employee = require('../models/Employee');

const router = express.Router();

// Register expo push token
router.post('/register-token', async (req, res) => {
  try {
    const { employeeId, expoPushToken } = req.body;
    await Employee.findByIdAndUpdate(employeeId, { expoPushToken });
    res.json({ message: 'Token registered' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;