const mongoose = require('mongoose');

const BillingSchema = new mongoose.Schema({
    reservation: { type: mongoose.Schema.Types.ObjectId, ref: 'Reservation', required: true },
    customer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    totalAmount: { type: Number, required: true },
    paymentMethod: { type: String, enum: ['cash', 'credit_card'] },
    isPaid: { type: Boolean, default: false },
    lineItems: [{
        description: String,
        amount: Number
    }],
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Billing', BillingSchema);