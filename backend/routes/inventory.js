const express = require('express');
const { getInventory, addInventory, updateInventory, deleteInventory } = require('../controllers/inventory');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.route('/')
    .get(getInventory)
    .post(protect, authorize('admin'), addInventory);

router.route('/:id')
    .put(protect, authorize('admin'), updateInventory)
    .delete(protect, authorize('admin'), deleteInventory);

module.exports = router;
