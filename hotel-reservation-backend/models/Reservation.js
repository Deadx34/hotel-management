const mongoose = require('mongoose');

const ReservationSchema = new mongoose.Schema({
    customer: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    room: { type: mongoose.Schema.Types.ObjectId, ref: 'Room' },
    arrivalDate: { type: Date, required: true },
    departureDate: { type: Date, required: true },
    numberOfOccupants: { type: Number, required: true },
    status: { type: String, enum: ['pending', 'confirmed', 'checked-in', 'checked-out', 'cancelled', 'no-show'], default: 'pending' },
    isGuaranteed: { type: Boolean, default: false }
});

module.exports = mongoose.model('Reservation', ReservationSchema);