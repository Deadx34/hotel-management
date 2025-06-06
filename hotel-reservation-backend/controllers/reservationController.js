// Add this function to your existing controller file
exports.createReservation = async (req, res) => {
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

    module.exports = {
    getReservations,
    updateReservationStatus,
    createReservation // if you add it
};

};