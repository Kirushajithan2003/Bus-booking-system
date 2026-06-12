require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const Bus = require('./models/Bus');
const Route = require('./models/Route');
const connectDB = require('./config/db');

const seed = async () => {
  await connectDB();
  console.log('🌱 Seeding Sri Lankan database...');

  // Clear existing
  await User.deleteMany({});
  await Bus.deleteMany({});
  await Route.deleteMany({});

  // Create admin user
  const admin = await User.create({
    name: 'Admin',
    email: 'admin@bus.com',
    password: 'admin123',
    role: 'admin',
    phone: '0712345678',
  });

  // Create demo user
  await User.create({
    name: 'Chaminda Perera',
    email: 'chaminda@example.com',
    password: 'password123',
    role: 'user',
    phone: '0777654321',
  });

  // Create buses
  const buses = await Bus.insertMany([
    { busNumber: 'NB-1234', name: 'Lanka Express', type: 'Volvo', totalSeats: 40, amenities: ['WiFi', 'AC', 'Water', 'Charging Port'] },
    { busNumber: 'WP-5678', name: 'Southern Star', type: 'Sleeper', totalSeats: 36, amenities: ['AC', 'Blanket', 'Pillow', 'Charging Port'] },
    { busNumber: 'CP-9012', name: 'Hill Country Liner', type: 'AC', totalSeats: 45, amenities: ['AC', 'Water', 'WiFi'] },
    { busNumber: 'NP-3456', name: 'Northern Pioneer', type: 'Non-AC', totalSeats: 50, amenities: ['Water'] },
    { busNumber: 'SP-7890', name: 'Coastal Cruiser', type: 'Volvo', totalSeats: 40, amenities: ['WiFi', 'AC', 'Snacks', 'Charging Port'] },
  ]);

  // Generate dates for next 7 days
  const today = new Date();
  const getFutureDate = (daysAhead) => {
    const d = new Date(today);
    d.setDate(d.getDate() + daysAhead);
    return d.toISOString().split('T')[0];
  };

  const routesData = [
    // Trincomalee <-> Colombo
    { from: 'Trincomalee', to: 'Colombo', date: getFutureDate(1), departureTime: '06:00', arrivalTime: '12:00', duration: '6h', price: 1500, bus: buses[0]._id, totalSeats: 40 },
    { from: 'Trincomalee', to: 'Colombo', date: getFutureDate(1), departureTime: '22:00', arrivalTime: '04:00', duration: '6h', price: 1800, bus: buses[1]._id, totalSeats: 36 },
    { from: 'Colombo', to: 'Trincomalee', date: getFutureDate(1), departureTime: '07:00', arrivalTime: '13:00', duration: '6h', price: 1500, bus: buses[2]._id, totalSeats: 45 },
    { from: 'Colombo', to: 'Trincomalee', date: getFutureDate(2), departureTime: '21:00', arrivalTime: '03:00', duration: '6h', price: 1700, bus: buses[0]._id, totalSeats: 40 },
    
    // Colombo <-> Kandy
    { from: 'Colombo', to: 'Kandy', date: getFutureDate(1), departureTime: '08:00', arrivalTime: '11:00', duration: '3h', price: 800, bus: buses[2]._id, totalSeats: 45 },
    { from: 'Colombo', to: 'Kandy', date: getFutureDate(2), departureTime: '17:00', arrivalTime: '20:00', duration: '3h', price: 900, bus: buses[4]._id, totalSeats: 40 },
    { from: 'Kandy', to: 'Colombo', date: getFutureDate(1), departureTime: '09:00', arrivalTime: '12:00', duration: '3h', price: 800, bus: buses[4]._id, totalSeats: 40 },
    
    // Colombo <-> Galle
    { from: 'Colombo', to: 'Galle', date: getFutureDate(1), departureTime: '10:00', arrivalTime: '12:00', duration: '2h', price: 600, bus: buses[0]._id, totalSeats: 40 },
    { from: 'Galle', to: 'Colombo', date: getFutureDate(2), departureTime: '11:00', arrivalTime: '13:00', duration: '2h', price: 600, bus: buses[2]._id, totalSeats: 45 },
    
    // Colombo <-> Jaffna
    { from: 'Colombo', to: 'Jaffna', date: getFutureDate(1), departureTime: '05:00', arrivalTime: '12:00', duration: '7h', price: 1800, bus: buses[1]._id, totalSeats: 36 },
    { from: 'Colombo', to: 'Jaffna', date: getFutureDate(1), departureTime: '21:00', arrivalTime: '04:00', duration: '7h', price: 2000, bus: buses[0]._id, totalSeats: 40 },
    { from: 'Jaffna', to: 'Colombo', date: getFutureDate(2), departureTime: '08:00', arrivalTime: '15:00', duration: '7h', price: 1800, bus: buses[2]._id, totalSeats: 45 },
    
    // Anuradhapura <-> Colombo
    { from: 'Anuradhapura', to: 'Colombo', date: getFutureDate(1), departureTime: '06:00', arrivalTime: '10:00', duration: '4h', price: 1000, bus: buses[4]._id, totalSeats: 40 },
    { from: 'Colombo', to: 'Anuradhapura', date: getFutureDate(1), departureTime: '13:00', arrivalTime: '17:00', duration: '4h', price: 1000, bus: buses[0]._id, totalSeats: 40 },
  ];

  // Pre-book some seats
  routesData[0].bookedSeats = [1, 2, 3, 5, 10, 15, 20];
  routesData[4].bookedSeats = [4, 8, 12, 16, 20, 24];

  await Route.insertMany(routesData);

  console.log('✅ Admin account: admin@bus.com / admin123');
  console.log('✅ 5 buses seeded (Sri Lanka)');
  console.log('✅ 14 routes seeded (Sri Lanka)');
  console.log('🎉 Seeding complete!');
  process.exit(0);
};

seed().catch(err => {
  console.error('❌ Seed failed:', err);
  process.exit(1);
});
