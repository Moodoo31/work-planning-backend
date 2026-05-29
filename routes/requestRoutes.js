const express = require('express');
const PlanningRequest = require('../models/PlanningRequest');
const Employee = require('../models/Employee');
const Planning = require('../models/Planning');
const nodemailer = require('nodemailer');

const router = express.Router();

// Helper: Send notifications
const sendNotification = async (employee, title, message, type) => {
  // Push notification via Expo
  try {
    const axios = require('axios');
    await axios.post('https://exp.host/--/api/v2/push/send', {
      to: employee.expoPushToken,
      title,
      body: message,
      data: { type },
    }, {
      headers: {
        'Authorization': `Bearer ${process.env.EXPO_ACCESS_TOKEN}`,
      },
    });
  } catch (error) {
    console.log('Push notification error:', error.message);
  }

  // Email notification
  try {
    const transporter = nodemailer.createTransport({
      service: process.env.EMAIL_SERVICE || 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: employee.email,
      subject: title,
      html: `<h3>${title}</h3><p>${message}</p>`,
    });
  } catch (error) {
    console.log('Email notification error:', error.message);
  }
};

// Create request (Récupération, Congé, Échange)
router.post('/', async (req, res) => {
  try {
    const { type, employeeId, requestDate, serviceDate, serviceId, reason, exchangeWithEmployeeId } = req.body;

    // Check if request is before 20:00 (8 PM)
    const now = new Date();
    if (now.getHours() >= 20) {
      return res.status(400).json({ message: 'Requests can only be made before 20:00' });
    }

    // Get employee's supervisor
    const employee = await Employee.findById(employeeId);
    const supervisor = await Employee.findById(employee.supervisorId);

    const planningRequest = new PlanningRequest({
      type,
      employeeId,
      requestDate: new Date(requestDate),
      serviceDate: new Date(serviceDate),
      serviceId,
      reason,
      exchangeWithEmployeeId,
      supervisorId: supervisor._id,
      status: 'pending',
    });

    await planningRequest.save();

    // Send notification to supervisor
    if (supervisor) {
      await sendNotification(
        supervisor,
        'Nouvelle demande',
        `${employee.name} a soumis une nouvelle demande de ${type}`,
        'request'
      );
    }

    res.status(201).json(planningRequest);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get requests for supervisor
router.get('/supervisor/:supervisorId', async (req, res) => {
  try {
    const requests = await PlanningRequest.find({
      supervisorId: req.params.supervisorId,
      status: 'pending',
    }).populate('employeeId serviceId');
    res.json(requests);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Approve/Reject request
router.put('/:id', async (req, res) => {
  try {
    const { status, supervisorResponse } = req.body;
    const planningRequest = await PlanningRequest.findByIdAndUpdate(
      req.params.id,
      { status, supervisorResponse, respondedAt: new Date() },
      { new: true }
    ).populate('employeeId serviceId');

    // If approved, update planning
    if (status === 'approved') {
      const planning = new (require('../models/Planning'))({
        employeeId: planningRequest.employeeId._id,
        date: planningRequest.serviceDate,
        dayType: planningRequest.type === 'recovery' ? 'recovery' : 'leave',
        serviceId: planningRequest.serviceId,
        status: 'scheduled',
      });
      await planning.save();
    }

    // Notify employee
    const employee = await Employee.findById(planningRequest.employeeId);
    await sendNotification(
      employee,
      status === 'approved' ? 'Demande approuvée' : 'Demande refusée',
      `Votre demande de ${planningRequest.type} a été ${status}`,
      'request_response'
    );

    res.json(planningRequest);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;