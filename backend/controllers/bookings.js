const ErrorResponse = require('../utils/errorResponse');
const Booking = require('../models/Booking');
const Inventory = require('../models/Inventory');

exports.getMyBookings = async (req, res, next) => {
    try {
        const myBookings = await Booking.find({ userId: req.user._id }).populate('itemId');
        res.status(200).json({ success: true, count: myBookings.length, data: myBookings });
    } catch (err) { next(err); }
};

exports.getAllBookings = async (req, res, next) => {
    try {
        const bookings = await Booking.find().populate('userId').populate('itemId');
        res.status(200).json({ success: true, count: bookings.length, data: bookings });
    } catch (err) { next(err); }
};

exports.createBooking = async (req, res, next) => {
    try {
        const { itemId, returnDate } = req.body;
        const item = await Inventory.findById(itemId);
        if (!item || item.availableQuantity < 1) return next(new ErrorResponse('Item out of stock', 400));

        const booking = await Booking.create({
            userId: req.user._id,
            itemId,
            itemType: 'Inventory',
            returnDate: returnDate || new Date(Date.now() + 86400000),
            bookingStatus: 'active'
        });

        item.availableQuantity -= 1;
        await item.save();

        res.status(201).json({ success: true, data: booking });
    } catch (err) { next(err); }
};

exports.returnBooking = async (req, res, next) => {
    try {
        const { bookingId } = req.body;
        const booking = await Booking.findById(bookingId);
        if (!booking) return next(new ErrorResponse('Booking not found', 404));
        if (booking.bookingStatus === 'returned') return next(new ErrorResponse('Already returned', 400));

        booking.bookingStatus = 'returned';
        await booking.save();

        if (booking.itemType === 'Inventory') {
            const item = await Inventory.findById(booking.itemId);
            if (item) {
                item.availableQuantity += 1;
                await item.save();
            }
        }
        res.status(200).json({ success: true, data: booking });
    } catch (err) { next(err); }
};
