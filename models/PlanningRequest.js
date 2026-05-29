const mongoose = require('mongoose');

const planningRequestSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['recovery', 'leave', 'shift_exchange'], // Récupération, Congé, Échange de quart
    required: true,
  },
  employeeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Employee',
    required: true,
  },
  requestDate: {
    type: Date,
    required: true, // Date of the request
  },
  serviceDate: {
    type: Date,
    required: true, // Date the service is requested for
  },
  serviceId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Service',
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected', 'cancelled'],
    default: 'pending',
  },
  supervisorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Employee', // Superviseur de l'IE
  },
  reason: String,
  // For shift exchange
  exchangeWithEmployeeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Employee',
  },
  exchangeWithServiceId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Service',
  },
  supervisorResponse: String,
  respondedAt: Date,
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('PlanningRequest', planningRequestSchema);