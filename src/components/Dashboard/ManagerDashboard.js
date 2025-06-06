import React, { useState, useEffect } from 'react';
import * as api from '../../services/api';

const ManagerDashboard = () => {
    const [noShows, setNoShows] = useState([]);
    const [occupancy, setOccupancy] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchManagerData = async () => {
            try {
                setLoading(true);
                // The manager views reports, such as hotel occupancy and financial information 
                const noShowRes = await api.getReservations({ status: 'no-show' });
                setNoShows(noShowRes.data);

                const occupancyRes = await api.getReservations({ status: 'checked-in' });
                setOccupancy(occupancyRes.data);
            } catch (error) {
                console.error("Failed to fetch manager data", error);
            } finally {
                setLoading(false);
            }
        };

        fetchManagerData();
    }, []);

    if (loading) return <p>Loading reports...</p>;

    return (
        <div>
            <h2>Manager Dashboard</h2>

            <section>
                {/* A billing record is created for each no-show reservation  */}
                <h3>No-Show Reservations</h3>
                {noShows.length > 0 ? noShows.map(res => (
                    <div key={res._id}>
                        {res.customer.personalDetails.firstName} {res.customer.personalDetails.lastName} - Arrival: {new Date(res.arrivalDate).toLocaleDateString()}
                    </div>
                )) : <p>No no-shows recorded.</p>}
            </section>

            <section>
                {/* The manager views reports, such as hotel occupancy  */}
                <h3>Current Hotel Occupancy</h3>
                 {occupancy.length > 0 ? occupancy.map(res => (
                    <div key={res._id}>
                        Room: {res.room.roomNumber} ({res.room.type}) - Occupied by: {res.customer.personalDetails.firstName}
                    </div>
                )) : <p>The hotel is currently empty.</p>}
            </section>
        </div>
    );
};

export default ManagerDashboard;