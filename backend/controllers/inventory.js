const ErrorResponse = require('../utils/errorResponse');
const Inventory = require('../models/Inventory');

exports.getInventory = async (req, res, next) => {
    try {
        const inventory = await Inventory.find();
        res.status(200).json({ success: true, count: inventory.length, data: inventory });
    } catch (err) { next(err); }
};

exports.addInventory = async (req, res, next) => {
    try {
        const item = await Inventory.create({
            ...req.body,
            availableQuantity: req.body.availableQuantity !== undefined ? req.body.availableQuantity : req.body.totalQuantity
        });
        res.status(201).json({ success: true, data: item });
    } catch (err) { next(err); }
};

exports.updateInventory = async (req, res, next) => {
    try {
        let item = await Inventory.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!item) return next(new ErrorResponse('Item not found', 404));
        res.status(200).json({ success: true, data: item });
    } catch (err) { next(err); }
};

exports.deleteInventory = async (req, res, next) => {
    try {
        const item = await Inventory.findByIdAndDelete(req.params.id);
        if (!item) return next(new ErrorResponse('Item not found', 404));
        res.status(200).json({ success: true, data: {} });
    } catch (err) { next(err); }
};
