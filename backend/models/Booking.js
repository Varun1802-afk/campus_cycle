const mongoose = require('mongoose');

const BookingSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    },
    itemId: {
        type: mongoose.Schema.ObjectId,
        required: true,
        refPath: 'itemType'
    },
    itemType: {
        type: String,
        required: true,
        enum: ['Inventory', 'Bicycle']
    },
    bookingDate: {
        type: Date,
        default: Date.now
    },
    returnDate: {
        type: Date,
        required: true
    },
    bookingStatus: {
        type: String,
        enum: ['active', 'returned', 'overdue'],
        default: 'active'
    }
}, { timestamps: true });

module.exports = mongoose.model('Booking', BookingSchema);
