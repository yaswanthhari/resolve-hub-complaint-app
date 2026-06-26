const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ['user', 'agent', 'admin'],
    default: 'user',
  },
  contactInfo: {
    phone: String,
  },
  address: {
    street: String,
    city: String,
    state: String,
    zipCode: String
  },
  isApproved: {
    type: Boolean,
    default: true, // Typically false for agents until admin approves, but true for regular users
  }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
