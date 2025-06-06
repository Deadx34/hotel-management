import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './HomePage.css';

const HomePage = () => {
    const [searchData, setSearchData] = useState({
        checkIn: '',
        checkOut: '',
        occupants: 1
    });
    const navigate = useNavigate();
    const today = new Date().toISOString().split('T')[0];

    const handleChange = (e) => {
        const { name, value } = e.target;
        setSearchData(prev => ({
            ...prev,
            [name]: name === 'occupants' ? parseInt(value) || 1 : value
        }));
    };

    const handleSearch = (e) => {
        e.preventDefault();
        if (!searchData.checkIn || !searchData.checkOut) {
            alert('Please select both check-in and check-out dates.');
            return;
        }
        navigate(`/rooms?checkIn=${searchData.checkIn}&checkOut=${searchData.checkOut}&occupants=${searchData.occupants}`);
    };

    return (
        <div className="homepage">
            {/* Hero Section with Background Image */}
            <section className="hero-section">
                <div className="hero-overlay"></div>
                <div className="container hero-content">
                    <div className="hero-text">
                        <h1>Your Perfect Getaway Awaits</h1>
                        <p className="lead">Discover luxury accommodations tailored to your needs</p>
                    </div>
                    
                    {/* Booking Widget */}
                    <div className="booking-widget-container">
                        <form className="booking-widget" onSubmit={handleSearch}>
                            <div className="form-row">
                                <div className="form-group">
                                    <label htmlFor="check-in">Check-in</label>
                                    <input
                                        type="date"
                                        id="check-in"
                                        name="checkIn"
                                        value={searchData.checkIn}
                                        min={today}
                                        onChange={handleChange}
                                        required
                                        className="form-control"
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="check-out">Check-out</label>
                                    <input
                                        type="date"
                                        id="check-out"
                                        name="checkOut"
                                        value={searchData.checkOut}
                                        min={searchData.checkIn || today}
                                        onChange={handleChange}
                                        required
                                        className="form-control"
                                    />
                                </div>
                            </div>
                            <div className="form-row">
                                <div className="form-group">
                                    <label htmlFor="occupants">Guests</label>
                                    <select
                                        id="occupants"
                                        name="occupants"
                                        value={searchData.occupants}
                                        onChange={handleChange}
                                        className="form-control"
                                    >
                                        {[1, 2, 3, 4, 5, 6].map(num => (
                                            <option key={num} value={num}>
                                                {num} {num === 1 ? 'Guest' : 'Guests'}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <button type="submit" className="search-btn">
                                    Check Availability
                                    <span className="icon">→</span>
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="features-section">
                <div className="container">
                    <h2 className="section-title">Why Choose Us</h2>
                    <div className="features-grid">
                        <div className="feature-card">
                            <div className="feature-icon">🏨</div>
                            <h3>Luxury Rooms</h3>
                            <p>Spacious accommodations with premium amenities</p>
                        </div>
                        <div className="feature-card">
                            <div className="feature-icon">🍽️</div>
                            <h3>Fine Dining</h3>
                            <p>Gourmet restaurants with diverse cuisine options</p>
                        </div>
                        <div className="feature-card">
                            <div className="feature-icon">🏊</div>
                            <h3>Premium Facilities</h3>
                            <p>Pool, spa, fitness center, and more</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Call to Action */}
            <section className="cta-section">
                <div className="container">
                    <h2>Ready for an unforgettable experience?</h2>
                    <button 
                        className="cta-btn"
                        onClick={() => navigate('/rooms')}
                    >
                        Browse All Rooms
                    </button>
                </div>
            </section>
        </div>
    );
};

export default HomePage;