// controllers/reservationController.js

// Make sure you require your Reservation model at the top
const Reservation = require('../models/Reservation'); 

// FUNCTION 1: createReservation
const createReservation = async (req, res) => {
    try {
        const {
            guestName,
            email,
            phone,
            checkInDate,
            checkOutDate,
            roomType,
            numberOfGuests,
            specialRequests,
            isGuaranteed
        } = req.body;

        const reservation = await Reservation.create({
            guestName,
            email,
            phone,
            checkInDate,
            checkOutDate,
            roomType,
            numberOfGuests,
            specialRequests,
            isGuaranteed: isGuaranteed || false,
            status: 'pending',
            createdBy: req.user.id // Assuming you have user info from auth middleware
        });

        res.status(201).json({
            success: true,
            data: reservation
        });

    } catch (error) {
        console.error('Error creating reservation:', error);
        res.status(500).json({
            success: false,
            message: 'Error creating reservation',
            error: error.message
        });
    }
};

// FUNCTION 2: getReservations (Add your logic here)
const getReservations = async (req, res) => {
    // TODO: Add your logic to fetch reservations from the database
    res.status(200).json({ success: true, message: "getReservations logic goes here" });
};

// FUNCTION 3: updateReservationStatus (Add your logic here)
const updateReservationStatus = async (req, res) => {
    // TODO: Add your logic to update a reservation's status
    res.status(200).json({ success: true, message: "updateReservationStatus logic goes here" });
};


// THIS IS THE MOST IMPORTANT PART
// Export all functions together at the end of the file.
module.exports = {
    createReservation,
    getReservations,
    updateReservationStatus
};