const mongoose = require('mongoose');
const dns = require('dns');

// Set public DNS fallback for Windows SRV record resolution
try {
    dns.setServers(['8.8.8.8', '8.8.4.4', '1.1.1.1']);
} catch (e) {
    // Ignore error if custom DNS setting is unsupported
}

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGODB_URI);
        console.log(`==========================================`);
        console.log(`✅ MongoDB Connected Successfully: ${conn.connection.host}`);
        console.log(`==========================================`);
        return conn.connection.host;
    } catch (error) {
        console.error(`❌ MongoDB Connection Error: ${error.message}`);
        console.log("\nIf you see an IP Whitelist error, go to MongoDB Atlas -> Network Access -> Add IP Address (0.0.0.0/0)\n");
        throw error;
    }
};

module.exports = connectDB;
