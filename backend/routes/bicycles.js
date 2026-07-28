const express = require('express');
const { getBicycles, addBicycle, updateBicycle, rentBicycle, returnBicycle } = require('../controllers/bicycles');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.route('/')
    .get(getBicycles)
    .post(protect, authorize('admin'), addBicycle);

router.post('/rent', protect, authorize('student'), rentBicycle);
router.post('/return', protect, returnBicycle); // Admin or Student can return

router.route('/:id')
    .put(protect, authorize('admin'), updateBicycle);

module.exports = router;
