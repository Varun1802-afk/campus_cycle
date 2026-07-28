const express = require('express');
const { getNotifications, markAsRead } = require('../controllers/notifications');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.get('/', protect, getNotifications);
router.put('/read/:id', protect, markAsRead);

module.exports = router;
