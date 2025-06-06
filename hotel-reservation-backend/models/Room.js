const mongoose = require('mongoose');

const RoomSchema = new mongoose.Schema({
    roomNumber: { type: String, required: true, unique: true },
    type: { type: String, enum: ['standard', 'deluxe', 'suite'], required: true },
    occupancy: { type: Number, required: true },
    rate: { type: Number, required: true },
    status: { type: String, enum: ['available', 'occupied', 'maintenance'], default: 'available' }
});

module.exports = mongoose.model('Room', RoomSchema);