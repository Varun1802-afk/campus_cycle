const express = require('express');
const { getListings, addListing, updateListing, deleteListing, getPending, approveListing } = require('../controllers/marketplace');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.get('/pending', protect, getPending);
router.post('/:id/approve', protect, approveListing);

router.route('/')
    .get(getListings)
    .post(protect, addListing);

router.route('/:id')
    .put(protect, updateListing)
    .delete(protect, deleteListing);

module.exports = router;
