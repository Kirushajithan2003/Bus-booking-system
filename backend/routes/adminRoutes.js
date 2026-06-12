const express = require('express');
const router = express.Router();
const Bus = require('../models/Bus');
const Route = require('../models/Route');
const Booking = require('../models/Booking');
const User = require('../models/User');
const { protect } = require('../middleware/authMiddleware');
const { admin } = require('../middleware/adminMiddleware');

// ===================== BUS CRUD =====================

// GET all buses
router.get('/buses', protect, admin, async (req, res) => {
  try {
    const buses = await Bus.find().sort({ createdAt: -1 });
    res.json(buses);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// POST create bus
router.post('/buses', protect, admin, async (req, res) => {
  try {
    const bus = await Bus.create(req.body);
    res.status(201).json(bus);
  } catch (err) { res.status(400).json({ message: err.message }); }
});

// PUT update bus
router.put('/buses/:id', protect, admin, async (req, res) => {
  try {
    const bus = await Bus.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!bus) return res.status(404).json({ message: 'Bus not found' });
    res.json(bus);
  } catch (err) { res.status(400).json({ message: err.message }); }
});

// DELETE bus
router.delete('/buses/:id', protect, admin, async (req, res) => {
  try {
    await Bus.findByIdAndDelete(req.params.id);
    res.json({ message: 'Bus deleted' });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// ===================== ROUTE CRUD =====================

// GET all routes
router.get('/routes', protect, admin, async (req, res) => {
  try {
    const routes = await Route.find().populate('bus').sort({ date: -1, departureTime: 1 });
    res.json(routes);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// POST create route
router.post('/routes', protect, admin, async (req, res) => {
  try {
    const route = await Route.create(req.body);
    const populated = await route.populate('bus');
    res.status(201).json(populated);
  } catch (err) { res.status(400).json({ message: err.message }); }
});

// PUT update route
router.put('/routes/:id', protect, admin, async (req, res) => {
  try {
    const route = await Route.findByIdAndUpdate(req.params.id, req.body, { new: true }).populate('bus');
    if (!route) return res.status(404).json({ message: 'Route not found' });
    res.json(route);
  } catch (err) { res.status(400).json({ message: err.message }); }
});

// DELETE route
router.delete('/routes/:id', protect, admin, async (req, res) => {
  try {
    await Route.findByIdAndDelete(req.params.id);
    res.json({ message: 'Route deleted' });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// ===================== BOOKINGS (read only) =====================

// GET all bookings
router.get('/bookings', protect, admin, async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate({ path: 'route', populate: { path: 'bus' } })
      .populate('user', 'name email phone')
      .sort({ createdAt: -1 });
    res.json(bookings);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// ===================== DASHBOARD STATS =====================

router.get('/stats', protect, admin, async (req, res) => {
  try {
    const totalUsers = await User.countDocuments({ role: 'user' });
    const totalBuses = await Bus.countDocuments();
    const totalRoutes = await Route.countDocuments();
    const totalBookings = await Booking.countDocuments();
    const confirmedBookings = await Booking.countDocuments({ status: 'confirmed' });
    const revenue = await Booking.aggregate([
      { $match: { status: 'confirmed' } },
      { $group: { _id: null, total: { $sum: '$totalAmount' } } }
    ]);
    res.json({
      totalUsers,
      totalBuses,
      totalRoutes,
      totalBookings,
      confirmedBookings,
      revenue: revenue[0]?.total || 0,
    });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

module.exports = router;
