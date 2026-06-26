const mongoose = require('mongoose');

const complaintSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  category: {
    type: String,
    required: true,
    // e.g., 'Municipal Corporation', 'Electricity', 'Police'
  },
  subCategory: {
    type: String, // e.g., 'Water Leakage'
  },
  description: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  urgencyLevel: {
    type: String,
    enum: ['Low', 'Medium', 'High'],
    default: 'Medium',
  },
  status: {
    type: String,
    enum: ['Pending', 'In Progress', 'Resolved', 'Cancelled'],
    default: 'Pending',
  },
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Refers to an agent/officer
    default: null,
  },
  attachments: [{
    type: String, // Array of file URLs or paths
  }],
  actionNotes: [{
    note: String,
    addedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    date: {
      type: Date,
      default: Date.now
    }
  }],
  trackingNumber: {
    type: String,
    unique: true,
  }
}, { timestamps: true });

// Pre-save hook to generate a tracking number if not present
complaintSchema.pre('save', async function() {
  if (!this.trackingNumber) {
    this.trackingNumber = 'COMP-' + Math.random().toString(36).substr(2, 9).toUpperCase();
  }
});

module.exports = mongoose.model('Complaint', complaintSchema);
