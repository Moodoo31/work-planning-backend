const express = require('express');
const Planning = require('../models/Planning');

const router = express.Router();

// Get planning for employee
router.get('/employee/:employeeId', async (req, res) => {
  try {
    const { month, year } = req.query;
    const startDate = new Date(year, month, 1);
    const endDate = new Date(year, parseInt(month) + 1, 0);

    const planning = await Planning.find({
      employeeId: req.params.employeeId,
      date: { $gte: startDate, $lte: endDate },
    }).populate('serviceId');

    res.json(planning);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get planning for date
router.get('/date/:date', async (req, res) => {
  try {
    const date = new Date(req.params.date);
    const planning = await Planning.find({
      date: {
        $gte: new Date(date.setHours(0, 0, 0, 0)),
        $lt: new Date(date.setHours(23, 59, 59, 999)),
      },
    }).populate('employeeId serviceId');

    res.json(planning);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;