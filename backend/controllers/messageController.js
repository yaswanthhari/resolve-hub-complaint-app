const Message = require('../models/Message');

// @desc    Get messages for a specific complaint
// @route   GET /api/messages/:complaintId
exports.getMessages = async (req, res) => {
  try {
    const messages = await Message.find({ complaintId: req.params.complaintId })
      .populate('senderId', 'name role')
      .sort({ createdAt: 1 });
    
    res.json(messages);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Save a new message
// @route   POST /api/messages
exports.saveMessage = async (req, res) => {
  try {
    const { complaintId, content } = req.body;
    
    const newMessage = new Message({
      complaintId,
      senderId: req.user.id,
      content
    });

    const savedMessage = await newMessage.save();
    const populatedMessage = await savedMessage.populate('senderId', 'name role');

    res.status(201).json(populatedMessage);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};
