const mongoose = require('mongoose');

const radarSchema = new mongoose.Schema({
  employeeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Employee',
    required: true,
  },
  serviceId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Service',
  },
  date: {
    type: Date,
    required: true,
  },
  actualStartTime: String, // Heure d'arrivée réelle
  actualEndTime: String, // Heure de départ réelle
  plannedStartTime: String,
  plannedEndTime: String,
  breaks: [{
    startTime: String,
    endTime: String,
    duration: Number,
  }],
  totalHours: Number,
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

module.exports = mongoose.model('Radar', radarSchema);