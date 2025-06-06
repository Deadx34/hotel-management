import React, { useState, useEffect } from 'react';
import * as api from '../../services/api';

const ClerkDashboard = () => {
    const [pending, setPending] = useState([]);
    const [arrivals, setArrivals] = useState([]);
    const [departures, setDepartures] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchData = async () => {
        try {
            setLoading(true);
            // Fetch different lists of tasks
            const pendingRes = await api.getReservations({ status: 'pending' });
            setPending(pendingRes.data);

            const arrivalsRes = await api.getReservations({ status: 'confirmed' }); // Simplified: assuming confirmed are arrivals
            setArrivals(arrivalsRes.data);

            const departuresRes = await api.getReservations({ status: 'checked-in' });
            setDepartures(departuresRes.data);

        } catch (error) {
            console.error("Failed to fetch clerk data", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleCheckIn = async (id) => {
        if(window.confirm('Are you sure you want to check this guest in?')) {
            await api.updateReservationStatus(id, 'checked-in'); // This action completes the "check-in" task 
            fetchData(); // Refresh the lists
        }
    };
    
    const handleCheckOut = async (id) => {
        if(window.confirm('Are you sure you want to check this guest out?')) {
            await api.updateReservationStatus(id, 'checked-out'); // This action completes the "check-out" task 
            fetchData(); // Refresh the lists
        }
    };

    if (loading) return <p>Loading tasks...</p>;

    return (
        <div>
            <h2>Clerk Dashboard</h2>

            <section>
                <h3>Pending Reservations (Unconfirmed)</h3>
                {pending.length > 0 ? pending.map(res => (
                    <div key={res._id}>
                       {res.customer.personalDetails.firstName} {res.customer.personalDetails.lastName} - Room: {res.room.roomNumber}
                    </div>
                )) : <p>No pending reservations.</p>}
            </section>

            <section>
                <h3>Today's Arrivals (To Be Checked In)</h3>
                {arrivals.length > 0 ? arrivals.map(res => (
                    <div key={res._id}>
                       {res.customer.personalDetails.firstName} {res.customer.personalDetails.lastName} - Room: {res.room.roomNumber}
                       <button onClick={() => handleCheckIn(res._id)}>Check-In</button>
                    </div>
                )) : <p>No arrivals for today.</p>}
            </section>
            
            <section>
                <h3>Current Guests (To Be Checked Out)</h3>
                {departures.length > 0 ? departures.map(res => (
                    <div key={res._id}>
                       {res.customer.personalDetails.firstName} {res.customer.personalDetails.lastName} - Room: {res.room.roomNumber}
                       <button onClick={() => handleCheckOut(res._id)}>Check-Out</button>
                    </div>
                )) : <p>No guests are currently checked in.</p>}
            </section>
        </div>
    );
};

export default ClerkDashboard;