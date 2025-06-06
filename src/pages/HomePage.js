import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './HomePage.css'; // Import the CSS

const HomePage = () => {
    // State to hold the form input values
    const [checkIn, setCheckIn] = useState('');
    const [checkOut, setCheckOut] = useState('');
    const [occupants, setOccupants] = useState(1);
    
    // Hook for programmatic navigation
    const navigate = useNavigate();

    // Get today's date in YYYY-MM-DD format for the min attribute of date input
    const today = new Date().toISOString().split('T')[0];

    const handleSearch = (e) => {
        e.preventDefault(); // Prevent form from reloading the page
        if (!checkIn || !checkOut) {
            alert('Please select both check-in and check-out dates.');
            return;
        }
        // Navigate to a (yet to be created) room results page with search criteria in the URL
        navigate(`/rooms?checkIn=${checkIn}&checkOut=${checkOut}&occupants=${occupants}`);
    };

    return (
        <div className="homepage">
            <section className="hero-section">
                <div className="hero-content">
                    <h1>Your Perfect Getaway Awaits</h1>
                    <p>Book your stay with us and experience luxury and comfort like never before.</p>
                    
                    {/* The main booking form */}
                    <form className="booking-widget" onSubmit={handleSearch}>
                        <div className="form-group">
                            <label htmlFor="check-in">Check-in Date</label>
                            <input
                                type="date"
                                id="check-in"
                                value={checkIn}
                                min={today}
                                onChange={(e) => setCheckIn(e.target.value)}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="check-out">Check-out Date</label>
                            <input
                                type="date"
                                id="check-out"
                                value={checkOut}
                                min={checkIn || today}
                                onChange={(e) => setCheckOut(e.target.value)}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="occupants">Occupants</label>
                            <input
                                type="number"
                                id="occupants"
                                value={occupants}
                                min="1"
                                max="10"
                                onChange={(e) => setOccupants(e.target.value)}
                                required
                            />
                        </div>
                        <button type="submit">Check Availability</button>
                    </form>
                </div>
            </section>

            {/* You can add more sections here about the hotel */}
            <section style={{ padding: '4rem 2rem', textAlign: 'center' }}>
                <h2>Explore Our Hotel</h2>
                <p>Discover world-class amenities, fine dining, and breathtaking views.</p>
            </section>
        </div>
    );
};

export default HomePage;