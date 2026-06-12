const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');
const Route = require('../models/Route');
const { protect } = require('../middleware/authMiddleware');

// @route POST /api/bookings
router.post('/', protect, async (req, res) => {
  try {
    const { routeId, passengers, seats } = req.body;

    const route = await Route.findById(routeId);
    if (!route) return res.status(404).json({ message: 'Route not found' });

    // Check if seats are available
    const conflict = seats.some(s => route.bookedSeats.includes(s));
    if (conflict) return res.status(400).json({ message: 'One or more seats are already booked' });

    // Lock seats
    route.bookedSeats.push(...seats);
    await route.save();

    const totalAmount = route.price * seats.length;

    const booking = await Booking.create({
      user: req.user._id,
      route: routeId,
      passengers,
      seats,
      totalAmount,
    });

    const populated = await booking.populate([
      { path: 'route', populate: { path: 'bus' } },
    ]);

    res.status(201).json(populated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route GET /api/bookings/my
router.get('/my', protect, async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user._id })
      .populate({ path: 'route', populate: { path: 'bus' } })
      .sort({ createdAt: -1 });
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route GET /api/bookings/:id
router.get('/:id', protect, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate({ path: 'route', populate: { path: 'bus' } })
      .populate('user', 'name email');
    if (!booking) return res.status(404).json({ message: 'Booking not found' });
    if (booking.user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }
    res.json(booking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route PUT /api/bookings/:id/cancel
router.put('/:id/cancel', protect, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ message: 'Booking not found' });
    if (booking.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }
    if (booking.status === 'cancelled') return res.status(400).json({ message: 'Booking already cancelled' });

    // Free up seats
    const route = await Route.findById(booking.route);
    if (route) {
      route.bookedSeats = route.bookedSeats.filter(s => !booking.seats.includes(s));
      await route.save();
    }

    booking.status = 'cancelled';
    booking.paymentStatus = 'refunded';
    await booking.save();
    res.json({ message: 'Booking cancelled successfully', booking });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
