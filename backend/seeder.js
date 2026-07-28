const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const connectDB = require('./config/db');

// Load env vars
dotenv.config();

// Load models
const User = require('./models/User');
const Bicycle = require('./models/Bicycle');
const Inventory = require('./models/Inventory');
const Marketplace = require('./models/Marketplace');
const Booking = require('./models/Booking');
const Notification = require('./models/Notification');

// Load initial data
const { users, inventory, bicycles, marketplace, pendingMarketplace } = require('./utils/data');

const importData = async () => {
    try {
        await connectDB();

        // Clear existing database
        await User.deleteMany();
        await Bicycle.deleteMany();
        await Inventory.deleteMany();
        await Marketplace.deleteMany();
        await Booking.deleteMany();
        await Notification.deleteMany();

        console.log('🧹 Existing data wiped...');

        // Hash passwords for seed users
        const preparedUsers = await Promise.all(users.map(async (u) => {
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(u.password, salt);
            return {
                fullName: u.fullName,
                rollNumber: u.rollNumber,
                email: u.email,
                password: hashedPassword,
                role: u.role
            };
        }));

        const createdUsers = await User.insertMany(preparedUsers);
        console.log(`✅ Seeded ${createdUsers.length} Users (Admin & Student)`);

        const adminUser = createdUsers.find(u => u.role === 'admin');
        const studentUser = createdUsers.find(u => u.role === 'student');

        // Seed Bicycles
        const preparedBicycles = bicycles.map(b => ({
            bicycleId: b.bicycleId,
            condition: b.condition,
            status: b.status || 'available',
            rentalPrice: b.rentalPrice,
            currentHolder: b.currentHolder ? studentUser._id : null
        }));
        const createdBicycles = await Bicycle.insertMany(preparedBicycles);
        console.log(`✅ Seeded ${createdBicycles.length} Bicycles`);

        // Seed Inventory
        const preparedInventory = inventory.map(i => ({
            itemName: i.itemName,
            category: i.category,
            description: i.description,
            image: i.image,
            totalQuantity: i.totalQuantity,
            availableQuantity: i.availableQuantity,
            rentalPricePerDay: i.rentalPricePerDay
        }));
        const createdInventory = await Inventory.insertMany(preparedInventory);
        console.log(`✅ Seeded ${createdInventory.length} Gear Inventory Items`);

        // Seed Marketplace Active Listings
        const preparedMarketplace = marketplace.map(m => ({
            sellerId: m.sellerName === 'Admin User' ? adminUser._id : studentUser._id,
            sellerName: m.sellerName,
            title: m.title,
            description: m.description,
            category: m.category,
            price: m.price,
            contactInfo: m.contactInfo,
            status: m.status || 'active',
            images: [m.image]
        }));

        // Seed Pending Marketplace Listings
        const preparedPending = pendingMarketplace.map(m => ({
            sellerId: studentUser._id,
            sellerName: m.sellerName,
            title: m.title,
            description: m.description,
            category: m.category,
            price: m.price,
            contactInfo: m.contactInfo,
            status: 'pending',
            images: [m.image]
        }));

        const createdMarketplace = await Marketplace.insertMany([...preparedMarketplace, ...preparedPending]);
        console.log(`✅ Seeded ${createdMarketplace.length} Marketplace Listings (Active & Pending)`);

        console.log('\n==========================================');
        console.log('🎉 ALL DATA SUCCESSFULLY SEEDED TO MONGODB!');
        console.log('==========================================\n');
        process.exit();
    } catch (err) {
        console.error('❌ Error during data seeding:', err);
        process.exit(1);
    }
};

const deleteData = async () => {
    try {
        await connectDB();

        await User.deleteMany();
        await Bicycle.deleteMany();
        await Inventory.deleteMany();
        await Marketplace.deleteMany();
        await Booking.deleteMany();
        await Notification.deleteMany();

        console.log('🧹 Data Destroyed Successfully!');
        process.exit();
    } catch (err) {
        console.error('❌ Error during data deletion:', err);
        process.exit(1);
    }
};

if (process.argv[2] === '-d') {
    deleteData();
} else {
    importData();
}
