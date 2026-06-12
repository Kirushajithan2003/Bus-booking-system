const mongoose = require('mongoose');

const busSchema = new mongoose.Schema({
  busNumber: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  type: { type: String, enum: ['AC', 'Non-AC', 'Sleeper', 'Volvo'], default: 'AC' },
  totalSeats: { type: Number, required: true, default: 40 },
  amenities: [{ type: String }],
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

module.exports = mongoose.model('Bus', busSchema);
