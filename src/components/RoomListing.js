// src/components/RoomListing.js
import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import * as api from '../services/api';
import './RoomListing.css';


const RoomListing = () => {
  const location = useLocation();
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useState({});

  useEffect(() => {
    // Parse query parameters from URL
    const params = new URLSearchParams(location.search);
    const checkIn = params.get('checkIn');
    const checkOut = params.get('checkOut');
    const occupants = params.get('occupants');

    setSearchParams({ checkIn, checkOut, occupants });

    // Fetch available rooms
    const fetchRooms = async () => {
      try {
        const availableRooms = await api.getAvailableRooms({ 
          checkIn, 
          checkOut, 
          occupants 
        });
        setRooms(availableRooms);
      } catch (error) {
        console.error('Error fetching rooms:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRooms();
  }, [location.search]);

  if (loading) {
    return <div className="loading">Searching for available rooms...</div>;
  }

  return (
    <div className="room-listing">
      <h2>Available Rooms</h2>
      <div className="search-params">
        <p>Check-in: {searchParams.checkIn}</p>
        <p>Check-out: {searchParams.checkOut}</p>
        <p>Occupants: {searchParams.occupants}</p>
      </div>
      
      {rooms.length === 0 ? (
        <div className="no-rooms">
          <p>No rooms available for the selected dates.</p>
          <button onClick={() => window.history.back()}>
            Modify Search
          </button>
        </div>
      ) : (
        <div className="room-grid">
          {rooms.map(room => (
            <div key={room.id} className="room-card">
              <img src={room.image} alt={room.type} />
              <h3>{room.type}</h3>
              <p>${room.price} per night</p>
              <button>Book Now</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RoomListing;