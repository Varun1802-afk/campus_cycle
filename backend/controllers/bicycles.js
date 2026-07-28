const ErrorResponse = require('../utils/errorResponse');
const Bicycle = require('../models/Bicycle');
const Booking = require('../models/Booking');

exports.getBicycles = async (req, res, next) => {
    try {
        const bicycles = await Bicycle.find();
        res.status(200).json({ success: true, count: bicycles.length, data: bicycles });
    } catch (err) { next(err); }
};

exports.addBicycle = async (req, res, next) => {
    try {
        const bike = await Bicycle.create({ ...req.body, status: 'available', currentHolder: null });
        res.status(201).json({ success: true, data: bike });
    } catch (err) { next(err); }
};

exports.updateBicycle = async (req, res, next) => {
    try {
        let bike = await Bicycle.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!bike) return next(new ErrorResponse('Bicycle not found', 404));
        res.status(200).json({ success: true, data: bike });
    } catch (err) { next(err); }
};

exports.rentBicycle = async (req, res, next) => {
    try {
        const { bicycleId, returnDate } = req.body;
        const bike = await Bicycle.findById(bicycleId);
        if (!bike || bike.status !== 'available') return next(new ErrorResponse('Not available', 400));

        const booking = await Booking.create({
            userId: req.user._id,
            itemId: bicycleId,
            itemType: 'Bicycle',
            returnDate: returnDate || new Date(Date.now() + 86400000),
            bookingStatus: 'active'
        });

        bike.status = 'rented';
        bike.currentHolder = req.user._id;
        await bike.save();

        res.status(200).json({ success: true, data: booking });
    } catch (err) { next(err); }
};

exports.returnBicycle = async (req, res, next) => {
    try {
        const { bicycleId } = req.body;
        const bike = await Bicycle.findById(bicycleId);
        if (!bike) return next(new ErrorResponse('Not found', 404));

        await Booking.findOneAndUpdate(
            { itemId: bicycleId, bookingStatus: 'active' },
            { bookingStatus: 'returned' }
        );

        bike.status = 'available';
        bike.currentHolder = null;
        await bike.save();

        res.status(200).json({ success: true, data: bike });
    } catch (err) { next(err); }
};
