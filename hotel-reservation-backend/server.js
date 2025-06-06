const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const cron = require('node-cron');
const connectDB = require('./config/db');
const Reservation = require('./models/Reservation');

dotenv.config();
connectDB();

const app = express();
app.use(express.json());
app.use(cors()); // Allow requests from localhost:3000

// --- Define API Routes ---
app.use('/api/auth', require('./routes/auth')); // Authentication routes
app.use('/api/reservations', require('./routes/reservations')); // Reservation routes
// app.use('/api/rooms', require('./routes/rooms')); // Example: Add more routes here

// This scheduled task runs at 7 PM every day.
cron.schedule('0 19 * * *', async () => {
    console.log('Running daily 7 PM tasks...');
    try {
        // Cancel reservations that are not guaranteed by credit card details 
        await Reservation.updateMany(
            { isGuaranteed: false, status: 'pending' },
            { $set: { status: 'cancelled' } }
        );
        console.log('Cancelled non-guaranteed reservations.');

        // Create billing records for no-show customers 
        // (Further logic to identify no-shows would be implemented here)

    } catch (error) {
        console.error('Error in scheduled task:', error);
    }
}, {
    timezone: "Asia/Colombo" // Set to your hotel's timezone
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Backend server running on http://localhost:${PORT}`));