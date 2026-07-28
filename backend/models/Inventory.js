const mongoose = require('mongoose');

const InventorySchema = new mongoose.Schema({
    itemName: {
        type: String,
        required: [true, 'Please add an item name']
    },
    category: {
        type: String,
        required: [true, 'Please add a category']
    },
    description: {
        type: String,
        required: [true, 'Please add a description']
    },
    image: {
        type: String,
        default: 'no-image.jpg'
    },
    totalQuantity: {
        type: Number,
        required: [true, 'Please add total quantity']
    },
    availableQuantity: {
        type: Number,
        required: true
    },
    rentalPricePerDay: {
        type: Number,
        required: [true, 'Please add rental price per day']
    }
}, { timestamps: true });

module.exports = mongoose.model('Inventory', InventorySchema);
