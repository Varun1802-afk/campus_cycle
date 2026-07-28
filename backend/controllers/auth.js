const ErrorResponse = require('../utils/errorResponse');
const User = require('../models/User');

exports.register = async (req, res, next) => {
    try {
        const { fullName, rollNumber, email, password } = req.body;
        
        const existingUser = await User.findOne({ $or: [{ email }, { rollNumber }] });
        if (existingUser) {
            return next(new ErrorResponse('User already exists', 400));
        }

        const user = await User.create({ fullName, rollNumber, email, password, role: 'student' });
        
        req.session.userId = user._id;
        res.status(201).json({ success: true, data: user });
    } catch (err) { next(err); }
};

exports.login = async (req, res, next) => {
    try {
        const { identifier, password } = req.body;
        const user = await User.findOne({ 
            $or: [{ email: identifier }, { rollNumber: identifier }] 
        }).select('+password');
        
        if (!user) {
            return next(new ErrorResponse('Invalid credentials', 401));
        }

        const isMatch = await user.matchPassword(password);
        if (!isMatch) {
            return next(new ErrorResponse('Invalid credentials', 401));
        }

        req.session.userId = user._id;
        res.status(200).json({ success: true, data: user });
    } catch (err) { next(err); }
};

exports.getMe = async (req, res, next) => {
    try {
        const user = await User.findById(req.session.userId);
        res.status(200).json({ success: true, data: user });
    } catch (err) { next(err); }
};

exports.logout = async (req, res, next) => {
    req.session.destroy();
    res.clearCookie('connect.sid');
    res.status(200).json({ success: true, data: {} });
};
