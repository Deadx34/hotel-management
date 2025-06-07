import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

// Firebase Imports
import { auth, db } from '../../firebase-config'; // Ensure path is correct
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { collection, query, where, getDocs, doc, updateDoc } from 'firebase/firestore';

// Material-UI (MUI) Components
import {
    AppBar,
    Toolbar,
    Typography,
    Container,
    Grid,
    Card,
    CardContent,
    CardActions,
    Button,
    Box,
    CircularProgress,
    Chip,
    Alert,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Paper, // <--- ADD THIS LINE
} from '@mui/material';

// MUI Icons
import LogoutIcon from '@mui/icons-material/Logout';
import BedIcon from '@mui/icons-material/Bed';

// Helper to get color for status chip
const getStatusChipColor = (status) => {
    switch (status) {
        case 'confirmed':
            return 'primary';
        case 'checked-in':
            return 'success';
        case 'checked-out':
            return 'default';
        case 'cancelled':
            return 'error';
        case 'pending':
            return 'warning';
        default:
            return 'secondary';
    }
};

const CustomerDashboard = () => {
    const [reservations, setReservations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [currentUser, setCurrentUser] = useState(null);
    const [openDialog, setOpenDialog] = useState(false);
    const [selectedReservationId, setSelectedReservationId] = useState(null);
    const navigate = useNavigate();

    // --- Data Fetching Logic ---
    const fetchReservations = useCallback(async (user) => {
        if (!user) return;
        setLoading(true);
        try {
            // Query for reservations created by the current user
            const q = query(collection(db, "reservations"), where("createdBy", "==", user.uid));
            const querySnapshot = await getDocs(q);
            const userReservations = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setReservations(userReservations);
        } catch (err) {
            setError('Failed to load reservations.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, []);

    // --- Authentication State Observer ---
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                setCurrentUser(user);
                fetchReservations(user);
            } else {
                setCurrentUser(null);
                navigate('/login'); // Redirect if not logged in
            }
        });
        return () => unsubscribe(); // Cleanup listener on unmount
    }, [fetchReservations, navigate]);


    // --- Action Handlers ---
    const handleLogout = async () => {
        await signOut(auth);
        navigate('/login');
    };

    const openCancelDialog = (reservationId) => {
        setSelectedReservationId(reservationId);
        setOpenDialog(true);
    };

    const closeCancelDialog = () => {
        setSelectedReservationId(null);
        setOpenDialog(false);
    };

    const confirmCancelReservation = async () => {
        if (!selectedReservationId) return;
        try {
            const reservationDocRef = doc(db, "reservations", selectedReservationId);
            await updateDoc(reservationDocRef, { status: 'cancelled' });
            closeCancelDialog();
            fetchReservations(currentUser); // Refresh the list
        } catch (err) {
            setError('Failed to cancel reservation.');
            console.error(err);
        }
    };

    // --- UI Rendering ---
    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Box sx={{ flexGrow: 1, backgroundColor: '#f4f6f8', minHeight: '100vh' }}>
            {/* --- Header Bar --- */}
            <AppBar position="static">
                <Toolbar>
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                        Welcome, {currentUser?.displayName?.split(' ')[0] || 'Guest'}
                    </Typography>
                    <Button color="inherit" startIcon={<LogoutIcon />} onClick={handleLogout}>
                        Logout
                    </Button>
                </Toolbar>
            </AppBar>

            {/* --- Main Content --- */}
            <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
                <Typography variant="h4" gutterBottom>My Reservations</Typography>
                {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
                
                {reservations.length > 0 ? (
                    <Grid container spacing={3}>
                        {reservations.map(res => (
                            <Grid item key={res.id} xs={12} sm={6} md={4}>
                                <Card elevation={3}>
                                    <CardContent>
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                                            <Typography variant="h6" component="div">
                                                {res.roomType || 'Room'}
                                            </Typography>
                                            <Chip label={res.status} color={getStatusChipColor(res.status)} size="small" />
                                        </Box>
                                        <Typography color="text.secondary" sx={{ display: 'flex', alignItems: 'center' }}>
                                            <BedIcon sx={{ mr: 1, fontSize: '1rem' }}/>
                                            Guests: {res.numberOfGuests || 'N/A'}
                                        </Typography>
                                        <Typography color="text.secondary">
                                            Arrival: {res.checkInDate ? new Date(res.checkInDate.toDate()).toLocaleDateString() : 'N/A'}
                                        </Typography>
                                        <Typography color="text.secondary">
                                            Departure: {res.checkOutDate ? new Date(res.checkOutDate.toDate()).toLocaleDateString() : 'N/A'}
                                        </Typography>
                                    </CardContent>
                                    <CardActions>
                                        {res.status !== 'cancelled' && res.status !== 'checked-out' && (
                                            <Button size="small" color="error" onClick={() => openCancelDialog(res.id)}>
                                                Cancel Reservation
                                            </Button>
                                        )}
                                    </CardActions>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                ) : (
                    <Paper sx={{ p: 4, textAlign: 'center' }}>
                        <Typography variant="h6">You have no reservations.</Typography>
                        <Button variant="contained" sx={{ mt: 2 }} onClick={() => navigate('/book-reservation')}>
                            Book a room
                        </Button>
                    </Paper>
                )}
            </Container>

            {/* --- Confirmation Dialog for Cancellation --- */}
            <Dialog open={openDialog} onClose={closeCancelDialog}>
                <DialogTitle>Confirm Cancellation</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Are you sure you want to permanently cancel this reservation? This action cannot be undone.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={closeCancelDialog}>Back</Button>
                    <Button onClick={confirmCancelReservation} color="error" autoFocus>
                        Yes, Cancel It
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default CustomerDashboard;