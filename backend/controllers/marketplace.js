const ErrorResponse = require('../utils/errorResponse');
const Marketplace = require('../models/Marketplace');

exports.getListings = async (req, res, next) => {
    try {
        const listings = await Marketplace.find({ status: 'active' });
        res.status(200).json({ success: true, count: listings.length, data: listings });
    } catch (err) { next(err); }
};

exports.getPending = async (req, res, next) => {
    try {
        const pending = await Marketplace.find({ status: 'pending' });
        res.status(200).json({ success: true, count: pending.length, data: pending });
    } catch (err) { next(err); }
};

exports.addListing = async (req, res, next) => {
    try {
        const status = req.user.role === 'admin' ? 'active' : 'pending';
        const listing = await Marketplace.create({
            ...req.body,
            sellerId: req.user._id,
            sellerName: req.user.fullName,
            contactInfo: req.body.contactInfo || req.user.email,
            status
        });

        res.status(201).json({ success: true, data: listing, pending: req.user.role !== 'admin' });
    } catch (err) { next(err); }
};

exports.approveListing = async (req, res, next) => {
    try {
        const listing = await Marketplace.findByIdAndUpdate(
            req.params.id,
            { status: 'active' },
            { new: true, runValidators: true }
        );
        if (!listing) return next(new ErrorResponse('Not found', 404));

        res.status(200).json({ success: true, data: listing });
    } catch (err) { next(err); }
};

exports.updateListing = async (req, res, next) => {
    try {
        let listing = await Marketplace.findById(req.params.id);
        if (!listing) return next(new ErrorResponse('Not found', 404));
        
        if (listing.sellerId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            return next(new ErrorResponse('Not authorized', 401));
        }

        listing = await Marketplace.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        res.status(200).json({ success: true, data: listing });
    } catch (err) { next(err); }
};

exports.deleteListing = async (req, res, next) => {
    try {
        const listing = await Marketplace.findById(req.params.id);
        if (!listing) return next(new ErrorResponse('Not found', 404));

        await listing.deleteOne();
        res.status(200).json({ success: true, data: {} });
    } catch (err) { next(err); }
};
