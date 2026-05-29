const express = require('express');
const jwt = require('jwt-simple');
const Employee = require('../models/Employee');

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'secret_key';

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const employee = await Employee.findOne({ email });
    if (!employee) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isPasswordValid = await employee.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.encode({ id: employee._id, email: employee.email }, JWT_SECRET);

    res.json({
      token,
      employee: {
        id: employee._id,
        name: employee.name,
        email: employee.email,
        role: employee.role,
      },
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Register
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, matricule } = req.body;

    const existingEmployee = await Employee.findOne({ email });
    if (existingEmployee) {
      return res.status(400).json({ message: 'Employee already exists' });
    }

    const employee = new Employee({
      name,
      email,
      password,
      matricule,
    });

    await employee.save();

    const token = jwt.encode({ id: employee._id, email: employee.email }, JWT_SECRET);

    res.status(201).json({
      token,
      employee: {
        id: employee._id,
        name: employee.name,
        email: employee.email,
        role: employee.role,
      },
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;