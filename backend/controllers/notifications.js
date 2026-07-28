const ErrorResponse = require('../utils/errorResponse');
const Notification = require('../models/Notification');

exports.getNotifications = async (req, res, next) => {
    try {
        const myNotifs = await Notification.find({ userId: req.user._id });
        res.status(200).json({ success: true, count: myNotifs.length, data: myNotifs });
    } catch (err) { next(err); }
};

exports.markAsRead = async (req, res, next) => {
    try {
        const notif = await Notification.findById(req.params.id);
        if (!notif) return next(new ErrorResponse('Not found', 404));
        if (notif.userId.toString() !== req.user._id.toString()) return next(new ErrorResponse('Not authorized', 401));
        
        notif.readStatus = true;
        await notif.save();
        res.status(200).json({ success: true, data: notif });
    } catch (err) { next(err); }
};

exports.createNotification = async (userId, message, type) => {
    try {
        await Notification.create({ userId, message, type, readStatus: false });
    } catch (err) {
        console.error('Error creating notification:', err);
    }
};
