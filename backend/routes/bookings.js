const express = require('express');
const { getMyBookings, getAllBookings, createBooking, returnBooking } = require('../controllers/bookings');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.get('/my', protect, getMyBookings);
router.route('/')
    .get(protect, authorize('admin'), getAllBookings)
    .post(protect, authorize('student'), createBooking);

router.put('/return', protect, returnBooking);

module.exports = router;
