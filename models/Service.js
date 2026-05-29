const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema({
  serviceCode: {
    type: String,
    required: true,
    unique: true, // SA 46, SA 50, TM 106, etc.
  },
  name: String,
  startTime: {
    type: String,
    required: true, // HH:mm format
  },
  endTime: {
    type: String,
    required: true, // HH:mm format
  },
  duration: Number, // in minutes
  line: String, // Tramway line
  route: [{
    origin: String,
    destination: String,
    departureTime: String,
    arrivalTime: String,
    duration: Number,
  }],
  breaks: [{
    startTime: String,
    endTime: String,
    duration: Number,
  }],
  garage: String,
  availability: String, // Available at PCC (Points de Contrôle)
  serviceImage: String, // Service sheet image URL
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Service', serviceSchema);