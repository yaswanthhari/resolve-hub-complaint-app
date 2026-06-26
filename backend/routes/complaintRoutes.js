const express = require('express');
const router = express.Router();
const { 
  createComplaint, 
  getMyComplaints, 
  getAllComplaints, 
  getComplaintById, 
  updateComplaintStatus, 
  assignComplaint 
} = require('../controllers/complaintController');
const { authMiddleware, agentMiddleware, adminMiddleware } = require('../middlewares/authMiddleware');

// Customer routes
router.post('/', authMiddleware, createComplaint);
router.get('/my', authMiddleware, getMyComplaints);

// Agent & Admin routes
router.get('/', authMiddleware, agentMiddleware, getAllComplaints);
router.put('/:id/status', authMiddleware, agentMiddleware, updateComplaintStatus);

// Admin specific routes
router.put('/:id/assign', authMiddleware, adminMiddleware, assignComplaint);

// Shared
router.get('/:id', authMiddleware, getComplaintById);

module.exports = router;
