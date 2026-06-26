const Complaint = require('../models/Complaint');
const User = require('../models/User');

// @desc    Create a new complaint
// @route   POST /api/complaints
exports.createComplaint = async (req, res) => {
  try {
    const { category, subCategory, description, location, urgencyLevel, attachments } = req.body;

    const newComplaint = new Complaint({
      userId: req.user.id,
      category,
      subCategory,
      description,
      location,
      urgencyLevel,
      attachments
    });

    const savedComplaint = await newComplaint.save();
    res.status(201).json(savedComplaint);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get all complaints for the logged in user
// @route   GET /api/complaints/my
exports.getMyComplaints = async (req, res) => {
  try {
    const complaints = await Complaint.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.json(complaints);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get all complaints (Admin or Agent)
// @route   GET /api/complaints
exports.getAllComplaints = async (req, res) => {
  try {
    // Optionally filter by agent assignment
    let query = {};
    if (req.user.role === 'agent') {
      // Agents might see all, or just assigned to them. Let's return all they are assigned to, or maybe all pending.
      // For now, let's just return all. We can filter on frontend or add specific routes later.
    }
    
    const complaints = await Complaint.find(query).populate('userId', 'name email').sort({ createdAt: -1 });
    res.json(complaints);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get complaint by ID
// @route   GET /api/complaints/:id
exports.getComplaintById = async (req, res) => {
  try {
    const complaint = await Complaint.findById(req.params.id)
      .populate('userId', 'name email contactInfo')
      .populate('assignedTo', 'name email')
      .populate('actionNotes.addedBy', 'name');

    if (!complaint) {
      return res.status(404).json({ message: 'Complaint not found' });
    }

    // Check ownership or role
    if (complaint.userId.toString() !== req.user.id && req.user.role === 'user') {
      return res.status(403).json({ message: 'Not authorized to view this complaint' });
    }

    res.json(complaint);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Update complaint status and add action notes (Agent/Admin)
// @route   PUT /api/complaints/:id/status
exports.updateComplaintStatus = async (req, res) => {
  try {
    const { status, note } = req.body;
    let complaint = await Complaint.findById(req.params.id);

    if (!complaint) {
      return res.status(404).json({ message: 'Complaint not found' });
    }

    complaint.status = status || complaint.status;
    
    if (note) {
      complaint.actionNotes.push({
        note,
        addedBy: req.user.id,
      });
    }

    await complaint.save();
    res.json(complaint);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Assign an agent to a complaint (Admin)
// @route   PUT /api/complaints/:id/assign
exports.assignComplaint = async (req, res) => {
  try {
    const { agentId } = req.body;
    
    // Verify agent exists
    const agent = await User.findById(agentId);
    if (!agent || agent.role !== 'agent') {
      return res.status(400).json({ message: 'Valid agent not found' });
    }

    let complaint = await Complaint.findById(req.params.id);
    if (!complaint) {
      return res.status(404).json({ message: 'Complaint not found' });
    }

    complaint.assignedTo = agentId;
    complaint.status = 'In Progress'; // Automatically update status
    complaint.actionNotes.push({
      note: `Assigned to agent ${agent.name}`,
      addedBy: req.user.id
    });

    await complaint.save();
    res.json(complaint);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};
