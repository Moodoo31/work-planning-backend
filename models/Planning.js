const mongoose = require('mongoose');

const planningSchema = new mongoose.Schema({
  employeeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Employee',
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  dayType: {
    type: String,
    enum: ['work', 'rest', 'leave', 'recovery', 'annual_leave', 'sick_leave', 'special'],
    default: 'work',
  },
  serviceId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Service',
  },
  status: {
    type: String,
    enum: ['scheduled', 'completed', 'cancelled', 'modified'],
    default: 'scheduled',
  },
  notes: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Planning', planningSchema);