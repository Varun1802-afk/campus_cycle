let idCounter = 1000;

module.exports = {
    users: [
        { _id: 'admin1', fullName: 'Admin User', rollNumber: 'ADMIN', email: 'admin@campus.edu', password: 'password', role: 'admin' },
        { _id: 'student1', fullName: 'John Doe', rollNumber: 'STU123', email: 'john@campus.edu', password: 'password', role: 'student' }
    ],
    inventory: [
        { _id: 'gear1', itemName: 'Arduino Uno R3', category: 'Electronics', description: 'Microcontroller board for prototyping.', availableQuantity: 15, totalQuantity: 15, rentalPricePerDay: 10, image: 'https://images.unsplash.com/photo-1555664424-778a1e5e1b48?w=500' },
        { _id: 'gear2', itemName: 'Raspberry Pi 4', category: 'Electronics', description: '4GB RAM mini computer.', availableQuantity: 8, totalQuantity: 10, rentalPricePerDay: 25, image: 'https://images.unsplash.com/photo-1605335133642-a89c3bc89a74?w=500' },
        { _id: 'gear3', itemName: 'Digital Multimeter', category: 'Tools', description: 'Measures voltage, current, and resistance.', availableQuantity: 20, totalQuantity: 20, rentalPricePerDay: 5, image: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=500' },
        { _id: 'gear4', itemName: 'Soldering Iron Kit', category: 'Tools', description: 'Adjustable temperature, includes solder.', availableQuantity: 12, totalQuantity: 15, rentalPricePerDay: 8, image: 'https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?w=500' },
        { _id: 'gear5', itemName: 'Camping Tent', category: 'Outdoors', description: 'Waterproof 4-person tent.', availableQuantity: 3, totalQuantity: 5, rentalPricePerDay: 100, image: 'https://images.unsplash.com/photo-1504280390227-31c0d50711ee?w=500' },
        { _id: 'gear6', itemName: 'Sleeping Bag', category: 'Outdoors', description: 'Thermal sleeping bag for -5C.', availableQuantity: 10, totalQuantity: 10, rentalPricePerDay: 40, image: 'https://images.unsplash.com/photo-1523987355523-c7b5b0dd90a7?w=500' }
    ],
    bicycles: [
        { _id: 'bike1', bicycleId: 'B-MTB-01', condition: 'Excellent', status: 'available', rentalPrice: 50, currentHolder: null, image: 'https://images.unsplash.com/photo-1485965120184-e220f721d03e?w=500' },
        { _id: 'bike2', bicycleId: 'B-MTB-02', condition: 'Good', status: 'available', rentalPrice: 45, currentHolder: null, image: 'https://images.unsplash.com/photo-1532298229144-0ec0c57515c7?w=500' },
        { _id: 'bike3', bicycleId: 'B-CITY-01', condition: 'Fair', status: 'rented', rentalPrice: 30, currentHolder: 'student1', image: 'https://images.unsplash.com/photo-1511994298241-608e28f14fde?w=500' },
        { _id: 'bike4', bicycleId: 'B-CITY-02', condition: 'Excellent', status: 'available', rentalPrice: 50, currentHolder: null, image: 'https://images.unsplash.com/photo-1576435728678-68d0fbf94e91?w=500' },
        { _id: 'bike5', bicycleId: 'B-ELEC-01', condition: 'Excellent', status: 'available', rentalPrice: 150, currentHolder: null, image: 'https://images.unsplash.com/photo-1558981420-c532902e58b4?w=500' },
        { _id: 'bike6', bicycleId: 'B-ROAD-01', condition: 'Good', status: 'available', rentalPrice: 80, currentHolder: null, image: 'https://images.unsplash.com/photo-1485965120184-e220f721d03e?w=500' }
    ],
    bookings: [
        { _id: 'bk1', userId: 'student1', itemId: 'bike3', itemType: 'Bicycle', returnDate: '2026-05-15', bookingStatus: 'active' }
    ],
    marketplace: [
        { _id: 'list1', sellerId: 'student1', sellerName: 'John Doe', title: 'Calculus Textbook', description: '8th Edition, perfect condition.', category: 'Books', price: 800, contactInfo: 'john@campus.edu', status: 'active', image: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=500' },
        { _id: 'list2', sellerId: 'admin1', sellerName: 'Admin User', title: 'Mini Fridge', description: 'Perfect for dorm rooms. 50L capacity.', category: 'Electronics', price: 2500, contactInfo: 'admin@campus.edu', status: 'active', image: 'https://images.unsplash.com/photo-1584568694244-14fbdf83bd30?w=500' },
        { _id: 'list3', sellerId: 'student1', sellerName: 'John Doe', title: 'Acoustic Guitar', description: 'Yamaha F310. Strings need replacing.', category: 'Hobbies', price: 3000, contactInfo: 'john@campus.edu', status: 'active', image: 'https://images.unsplash.com/photo-1510915361894-db8b60106cb1?w=500' },
        { _id: 'list4', sellerId: 'admin1', sellerName: 'Admin User', title: 'Drafting Board', description: 'A3 size with parallel motion rule.', category: 'Tools', price: 600, contactInfo: 'admin@campus.edu', status: 'active', image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=500' }
    ],
    pendingMarketplace: [
        { _id: 'req1', sellerId: 'student1', sellerName: 'John Doe', title: 'Used Mechanical Keyboard', description: 'TVS Gold, all keys working.', category: 'Electronics', price: 900, contactInfo: 'john@campus.edu', image: 'https://images.unsplash.com/photo-1595225476474-87563907a212?w=500' }
    ],
    notifications: [],
    getId: () => String(idCounter++)
};
