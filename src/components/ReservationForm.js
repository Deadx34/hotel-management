import axios from 'axios';

const API = axios.create({ baseURL: 'http://localhost:5000/api' });

API.interceptors.request.use((req) => {
    if (localStorage.getItem('token')) {
        req.headers.Authorization = `Bearer ${localStorage.getItem('token')}`;
    }
    return req;
});

// Auth
export const login = (formData) => API.post('/auth/login', formData);

// Reservations
export const createReservation = (reservationData) => API.post('/reservations', reservationData);

// etc...