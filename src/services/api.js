import axios from 'axios';

const API = axios.create({
    baseURL: 'http://localhost:5000/api'
});

API.interceptors.request.use((req) => {
    const token = localStorage.getItem('token');
    if (token) {
        req.headers.Authorization = `Bearer ${token}`;
    }
    return req;
});

// --- AUTHENTICATION ---
export const login = (formData) => API.post('/auth/login', formData);
export const register = (formData) => API.post('/auth/register', formData);

// --- RESERVATIONS ---
export const createReservation = (reservationData) => API.post('/reservations', reservationData);

// Fetches reservations based on a query (for Clerk/Manager)
// This was missing the 'export' keyword
export const getReservations = (params) => API.get('/reservations', { params });

// Fetches reservations for the logged-in customer
// This was missing the 'export' keyword
export const getMyReservations = () => API.get('/reservations');

// Updates the status of a reservation (for cancelling, check-in, etc.)
// This was missing the 'export' keyword
export const updateReservationStatus = (id, status) => API.patch(`/reservations/${id}/status`, { status });

// In your api.js file
export const getAvailableRooms = async (params) => {
  try {
    // This should match your backend API endpoint
    const response = await axios.get('/api/rooms/available', { params });
    return response.data;
  } catch (error) {
    throw error;
  }
};