const express = require('express');
const router = express.Router();
const { getMessages, saveMessage } = require('../controllers/messageController');
const { authMiddleware } = require('../middlewares/authMiddleware');

router.get('/:complaintId', authMiddleware, getMessages);
router.post('/', authMiddleware, saveMessage);

module.exports = router;
