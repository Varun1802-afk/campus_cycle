const mongoose = require('mongoose');

const MarketplaceSchema = new mongoose.Schema({
    sellerId: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    },
    sellerName: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: [true, 'Please add a title']
    },
    description: {
        type: String,
        required: [true, 'Please add a description']
    },
    category: {
        type: String,
        required: [true, 'Please add a category']
    },
    price: {
        type: Number,
        required: [true, 'Please add a price']
    },
    images: {
        type: [String],
        default: ['no-image.jpg']
    },
    contactInfo: {
        type: String,
        required: [true, 'Please provide contact info (e.g., phone or email)']
    },
    status: {
        type: String,
        enum: ['active', 'pending', 'sold', 'removed'],
        default: 'active'
    }
}, { timestamps: true });

module.exports = mongoose.model('Marketplace', MarketplaceSchema);
