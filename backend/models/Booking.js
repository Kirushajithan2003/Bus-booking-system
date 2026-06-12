const mongoose = require('mongoose');

const passengerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  age: { type: Number, required: true },
  gender: { type: String, enum: ['Male', 'Female', 'Other'], required: true },
  seatNumber: { type: Number, required: true },
});

const bookingSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  route: { type: mongoose.Schema.Types.ObjectId, ref: 'Route', required: true },
  passengers: [passengerSchema],
  seats: [{ type: Number }],
  totalAmount: { type: Number, required: true },
  status: { type: String, enum: ['confirmed', 'cancelled', 'pending'], default: 'confirmed' },
  paymentStatus: { type: String, enum: ['paid', 'unpaid', 'refunded'], default: 'paid' },
  bookingId: { type: String, unique: true },
}, { timestamps: true });

// Auto-generate booking ID
bookingSchema.pre('save', function (next) {
  if (!this.bookingId) {
    this.bookingId = 'BUS' + Date.now().toString().slice(-8);
  }
  next();
});

module.exports = mongoose.model('Booking', bookingSchema);
