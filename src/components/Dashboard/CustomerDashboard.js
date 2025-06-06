import React, { useState, useEffect } from 'react';
import * as api from '../../services/api';
import './Dashboard.css'; // Let's add some basic styling

const CustomerDashboard = () => {
    const [reservations, setReservations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const user = JSON.parse(localStorage.getItem('user'));

    const fetchReservations = async () => {
        try {
            const { data } = await api.getMyReservations();
            setReservations(data);
        } catch (err) {
            setError('Failed to load reservations.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchReservations();
    }, []);

    const handleCancelReservation = async (reservationId) => {
        if (window.confirm('Are you sure you want to cancel this reservation?')) {
            try {
                // A customer may cancel reservations via the website 
                await api.updateReservationStatus(reservationId, 'cancelled');
                alert('Reservation successfully cancelled.');
                // Refresh the list after cancelling
                fetchReservations();
            } catch (err) {
                alert('Failed to cancel reservation.');
                console.error(err);
            }
        }
    };

    if (loading) return <p>Loading your reservations...</p>;
    if (error) return <p style={{ color: 'red' }}>{error}</p>;

    return (
        <div className="dashboard-container">
            <h2>Welcome, {user?.personalDetails?.firstName || user?.username}!</h2>
            <p>Here you can view and manage your reservations.</p>

            <div className="reservations-list">
                <h3>My Reservations</h3>
                {reservations.length > 0 ? (
                    reservations.map(res => (
                        <div key={res._id} className={`reservation-card ${res.status}`}>
                            <div className="card-header">
                                <h4>Room: {res.room ? res.room.type : 'N/A'}</h4>
                                <span className={`status-badge ${res.status}`}>{res.status}</span>
                            </div>
                            <div className="card-body">
                                <p><strong>Arrival:</strong> {new Date(res.arrivalDate).toLocaleDateString()}</p>
                                <p><strong>Departure:</strong> {new Date(res.departureDate).toLocaleDateString()}</p>
                                <p><strong>Occupants:</strong> {res.numberOfOccupants}</p>
                            </div>
                            <div className="card-actions">
                                {res.status !== 'cancelled' && res.status !== 'checked-out' && (
                                    <>
                                        <button className="btn-secondary" disabled>Change</button>
                                        <button className="btn-danger" onClick={() => handleCancelReservation(res._id)}>Cancel</button>
                                    </>
                                )}
                            </div>
                        </div>
                    ))
                ) : (
                    <p>You have no reservations. Time to book a trip!</p>
                )}
            </div>
        </div>
    );
};

export default CustomerDashboard;