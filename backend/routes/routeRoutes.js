const express = require('express');
const router = express.Router();
const Route = require('../models/Route');

// @route GET /api/routes/search?from=&to=&date=
router.get('/search', async (req, res) => {
  try {
    const { from, to, date } = req.query;
    const query = {};
    if (from) query.from = { $regex: from, $options: 'i' };
    if (to) query.to = { $regex: to, $options: 'i' };
    if (date) query.date = date;
    query.isActive = true;

    const routes = await Route.find(query).populate('bus').sort({ departureTime: 1 });
    res.json(routes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route GET /api/routes/cities
router.get('/cities', async (req, res) => {
  try {
    const froms = await Route.distinct('from');
    const tos = await Route.distinct('to');
    const cities = [...new Set([...froms, ...tos])].sort();
    res.json(cities);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route GET /api/routes/:id
router.get('/:id', async (req, res) => {
  try {
    const route = await Route.findById(req.params.id).populate('bus');
    if (!route) return res.status(404).json({ message: 'Route not found' });
    res.json(route);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route GET /api/routes/:id/seats
router.get('/:id/seats', async (req, res) => {
  try {
    const route = await Route.findById(req.params.id);
    if (!route) return res.status(404).json({ message: 'Route not found' });
    res.json({ totalSeats: route.totalSeats, bookedSeats: route.bookedSeats });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
