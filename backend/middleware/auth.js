const ErrorResponse = require('../utils/errorResponse');
const User = require('../models/User');

// Protect routes - Verify Session
exports.protect = async (req, res, next) => {
    try {
        if (req.session && req.session.userId) {
            req.user = await User.findById(req.session.userId);
            if (!req.user) {
                return next(new ErrorResponse('Not authorized to access this route', 401));
            }
            next();
        } else {
            return next(new ErrorResponse('Not authorized, please login', 401));
        }
    } catch (err) {
        next(new ErrorResponse('Not authorized to access this route', 401));
    }
};

// Grant access to specific roles
exports.authorize = (...roles) => {
    return (req, res, next) => {
        if (!req.user || !roles.includes(req.user.role)) {
            return next(new ErrorResponse(`User role ${req.user ? req.user.role : 'Unknown'} is not authorized`, 403));
        }
        next();
    };
};
