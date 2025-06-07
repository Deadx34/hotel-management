import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

// Firebase Imports
import { auth, db } from '../../firebase-config'; // Ensure path is correct
import { signOut } from 'firebase/auth';
import { collection, query, where, getDocs, doc, updateDoc } from 'firebase/firestore';

// Material-UI (MUI) Components
import {
    AppBar,
    Toolbar,
    Typography,
    Container,
    Grid,
    Paper,
    List,
    ListItem,
    ListItemText,
    ListItemIcon,
    Button,
    Box,
    CircularProgress,
    Divider,
    IconButton,
    Tooltip,
} from '@mui/material';

// MUI Icons
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';
import FlightLandIcon from '@mui/icons-material/FlightLand';
import FlightTakeoffIcon from '@mui/icons-material/FlightTakeoff';
import LogoutIcon from '@mui/icons-material/Logout';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';

const ClerkDashboard = () => {
    const [pending, setPending] = useState([]);
    const [arrivals, setArrivals] = useState([]);
    const [departures, setDepartures] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    // --- Data Fetching from Firestore ---
    // useCallback prevents this function from being recreated on every render
    const fetchData = useCallback(async () => {
        setLoading(true);
        try {
            const reservationsRef = collection(db, "reservations");

            // Fetch pending, arrivals (confirmed), and departures (checked-in)
            const pendingQuery = query(reservationsRef, where("status", "==", "pending"));
            const arrivalsQuery = query(reservationsRef, where("status", "==", "confirmed"));
            const departuresQuery = query(reservationsRef, where("status", "==", "checked-in"));

            const [pendingSnapshot, arrivalsSnapshot, departuresSnapshot] = await Promise.all([
                getDocs(pendingQuery),
                getDocs(arrivalsQuery),
                getDocs(departuresQuery)
            ]);

            setPending(pendingSnapshot.docs.map(d => ({ id: d.id, ...d.data() })));
            setArrivals(arrivalsSnapshot.docs.map(d => ({ id: d.id, ...d.data() })));
            setDepartures(departuresSnapshot.docs.map(d => ({ id: d.id, ...d.data() })));

        } catch (error) {
            console.error("Failed to fetch clerk data from Firestore", error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    // --- Action Handlers ---
    const updateReservationStatus = async (id, newStatus) => {
        if (!window.confirm(`Are you sure you want to set this reservation to "${newStatus}"?`)) return;
        
        const reservationDocRef = doc(db, "reservations", id);
        try {
            await updateDoc(reservationDocRef, { status: newStatus });
            fetchData(); // Refresh all lists after an update
        } catch (error) {
            console.error("Failed to update reservation status", error);
            alert("Error: Could not update the reservation.");
        }
    };
    
    const handleLogout = async () => {
        try {
            await signOut(auth);
            navigate('/login');
        } catch (error) {
            console.error("Failed to log out", error);
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

    const renderTaskList = (title, icon, items, action) => (
        <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', height: '100%' }}>
            <Typography component="h2" variant="h6" color="primary" gutterBottom>
                {title}
            </Typography>
            <Divider sx={{ mb: 1 }} />
            <List sx={{ overflow: 'auto' }}>
                {items.length > 0 ? items.map(res => (
                    <ListItem
                        key={res.id}
                        secondaryAction={action && (
                            <Tooltip title={action.label}>
                                <Button
                                    variant="contained"
                                    color={action.color}
                                    size="small"
                                    onClick={() => action.handler(res.id)}
                                    startIcon={action.icon}
                                >
                                    {action.label}
                                </Button>
                            </Tooltip>
                        )}
                    >
                        <ListItemIcon>{icon}</ListItemIcon>
                        <ListItemText
                            primary={res.guestName}
                            secondary={`Room: ${res.roomNumber || 'N/A'}`}
                        />
                    </ListItem>
                )) : <Typography sx={{ p: 2, textAlign: 'center' }}>No tasks in this list.</Typography>}
            </List>
        </Paper>
    );

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
            {/* --- Header Bar --- */}
            <AppBar position="static">
                <Toolbar>
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                        Clerk Dashboard
                    </Typography>
                    <Button color="inherit" startIcon={<LogoutIcon />} onClick={handleLogout}>
                        Logout
                    </Button>
                </Toolbar>
            </AppBar>

            {/* --- Main Content --- */}
            <Container maxWidth="xl" sx={{ mt: 4, mb: 4, flexGrow: 1 }}>
                <Grid container spacing={3} sx={{ height: '100%' }}>
                    <Grid item xs={12} md={4}>
                        {renderTaskList(
                            "Pending Reservations",
                            <HourglassEmptyIcon color="warning" />,
                            pending
                            // No action for pending items in this design
                        )}
                    </Grid>
                    <Grid item xs={12} md={4}>
                        {renderTaskList(
                            "Today's Arrivals",
                            <FlightLandIcon color="info" />,
                            arrivals,
                            { 
                                label: 'Check-In', 
                                handler: (id) => updateReservationStatus(id, 'checked-in'),
                                color: 'primary',
                                icon: <CheckCircleOutlineIcon/>
                            }
                        )}
                    </Grid>
                    <Grid item xs={12} md={4}>
                        {renderTaskList(
                            "Current Guests",
                            <FlightTakeoffIcon color="success" />,
                            departures,
                            { 
                                label: 'Check-Out', 
                                handler: (id) => updateReservationStatus(id, 'checked-out'),
                                color: 'secondary',
                                icon: <LogoutIcon/>
                            }
                        )}
                    </Grid>
                </Grid>
            </Container>
        </Box>
    );
};

export default ClerkDashboard;