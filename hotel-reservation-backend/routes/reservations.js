const express = require('express');
const router = express.Router();
const {
    createReservation,
    getReservations, // Add the new controller function
    updateReservationStatus // Add the new controller function
} = require('../controllers/reservationController');
const { protect, authorize } = require('../middleware/authMiddleware');

// Route to get reservations (with filters)
router.get('/', protect, authorize('clerk', 'manager'), getReservations);

// Route to create a reservation
router.post('/', protect, authorize('customer', 'clerk'), createReservation);

// Route to update a reservation's status
router.patch('/:reservationId/status', protect, authorize('clerk'), updateReservationStatus);


module.exports = router;