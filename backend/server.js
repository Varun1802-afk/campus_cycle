const express = require('express');
const cors = require('cors');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/error');

// Load env vars
dotenv.config();

// Connect to Database
connectDB();

const app = express();

// Trust proxy for Vercel deployment
app.set('trust proxy', 1);

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
    origin: true,
    credentials: true
}));

// Session configuration backed by MongoDB
app.use(session({
    secret: process.env.SESSION_SECRET || 'campus_cycle_secure_session_secret_2026!',
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
        mongoUrl: process.env.MONGODB_URI,
        collectionName: 'sessions',
        ttl: 14 * 24 * 60 * 60 // 14 days
    }),
    cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax'
    }
}));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/inventory', require('./routes/inventory'));
app.use('/api/bicycles', require('./routes/bicycles'));
app.use('/api/bookings', require('./routes/bookings'));
app.use('/api/marketplace', require('./routes/marketplace'));
app.use('/api/notifications', require('./routes/notifications'));

app.get('/api', (req, res) => {
    res.json({ success: true, message: 'CampusCycle API is running with MongoDB persistence...' });
});

// Global Error Handler
app.use(errorHandler);

if (require.main === module) {
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
        console.log(`🚀 CampusCycle Server started on Port ${PORT}`);
    });
}

module.exports = app;
