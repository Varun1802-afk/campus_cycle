const mongoose = require('mongoose');

const BicycleSchema = new mongoose.Schema({
    bicycleId: {
        type: String,
        required: [true, 'Please add a unique bicycle ID'],
        unique: true
    },
    condition: {
        type: String,
        required: [true, 'Please add condition (e.g., Good, Fair, Poor)']
    },
    status: {
        type: String,
        enum: ['available', 'rented', 'maintenance'],
        default: 'available'
    },
    rentalPrice: {
        type: Number,
        required: [true, 'Please add rental price per day']
    },
    currentHolder: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        default: null
    }
}, { timestamps: true });

module.exports = mongoose.model('Bicycle', BicycleSchema);
