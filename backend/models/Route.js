const mongoose = require('mongoose');

const routeSchema = new mongoose.Schema({
  from: { type: String, required: true },
  to: { type: String, required: true },
  date: { type: String, required: true }, // "YYYY-MM-DD"
  departureTime: { type: String, required: true },
  arrivalTime: { type: String, required: true },
  duration: { type: String, required: true },
  price: { type: Number, required: true },
  bus: { type: mongoose.Schema.Types.ObjectId, ref: 'Bus', required: true },
  totalSeats: { type: Number, required: true, default: 40 },
  bookedSeats: [{ type: Number }], // seat numbers that are booked
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

// Virtual: available seats count
routeSchema.virtual('availableSeats').get(function () {
  return this.totalSeats - this.bookedSeats.length;
});

routeSchema.set('toJSON', { virtuals: true });
routeSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Route', routeSchema);
