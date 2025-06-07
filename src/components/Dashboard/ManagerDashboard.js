import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// Firebase Imports
import { auth, db } from '../../firebase-config'; // Ensure path is correct
import { signOut } from 'firebase/auth';
import { collection, query, where, getDocs } from 'firebase/firestore';

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
} from '@mui/material';

// MUI Icons
import EventBusyIcon from '@mui/icons-material/EventBusy';
import MeetingRoomIcon from '@mui/icons-material/MeetingRoom';
import LogoutIcon from '@mui/icons-material/Logout';

const ManagerDashboard = () => {
    const [noShows, setNoShows] = useState([]);
    const [occupancy, setOccupancy] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    // --- Logout Function ---
    const handleLogout = async () => {
        try {
            await signOut(auth);
            navigate('/login');
        } catch (error) {
            console.error("Failed to log out", error);
        }
    };

    // --- Data Fetching from Firestore ---
    useEffect(() => {
        const fetchManagerData = async () => {
            setLoading(true);
            try {
                // Query for "no-show" reservations
                const noShowQuery = query(collection(db, "reservations"), where("status", "==", "no-show"));
                const noShowSnapshot = await getDocs(noShowQuery);
                const noShowList = noShowSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                setNoShows(noShowList);

                // Query for "checked-in" reservations (occupancy)
                const occupancyQuery = query(collection(db, "reservations"), where("status", "==", "checked-in"));
                const occupancySnapshot = await getDocs(occupancyQuery);
                const occupancyList = occupancySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                setOccupancy(occupancyList);

            } catch (error) {
                console.error("Failed to fetch manager data from Firestore", error);
            } finally {
                setLoading(false);
            }
        };

        fetchManagerData();
    }, []);

    // --- UI Rendering ---
    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Box sx={{ flexGrow: 1 }}>
            {/* --- Header Bar --- */}
            <AppBar position="static">
                <Toolbar>
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                        Manager Dashboard
                    </Typography>
                    <Button color="inherit" startIcon={<LogoutIcon />} onClick={handleLogout}>
                        Logout
                    </Button>
                </Toolbar>
            </AppBar>

            {/* --- Main Content --- */}
            <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
                <Grid container spacing={3}>

                    {/* No-Shows Card */}
                    <Grid item xs={12} md={6}>
                        <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
                            <Typography component="h2" variant="h6" color="primary" gutterBottom>
                                No-Show Reservations
                            </Typography>
                            <Divider sx={{ mb: 2 }}/>
                            <List>
                                {noShows.length > 0 ? noShows.map(res => (
                                    <ListItem key={res.id}>
                                        <ListItemIcon>
                                            <EventBusyIcon color="error" />
                                        </ListItemIcon>
                                        <ListItemText
                                            primary={`${res.guestName}`}
                                            secondary={`Arrival: ${new Date(res.checkInDate.toDate()).toLocaleDateString()}`}
                                        />
                                    </ListItem>
                                )) : <Typography sx={{p: 2}}>No no-shows recorded.</Typography>}
                            </List>
                        </Paper>
                    </Grid>

                    {/* Occupancy Card */}
                    <Grid item xs={12} md={6}>
                        <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
                             <Typography component="h2" variant="h6" color="primary" gutterBottom>
                                Current Hotel Occupancy
                            </Typography>
                            <Divider sx={{ mb: 2 }}/>
                             <List>
                                {occupancy.length > 0 ? occupancy.map(res => (
                                    <ListItem key={res.id}>
                                        <ListItemIcon>
                                            <MeetingRoomIcon color="success" />
                                        </ListItemIcon>
                                        <ListItemText
                                            primary={`Room ${res.roomNumber || 'N/A'} (${res.roomType || 'N/A'})`}
                                            secondary={`Occupied by: ${res.guestName}`}
                                        />
                                    </ListItem>
                                )) : <Typography sx={{p: 2}}>The hotel is currently empty.</Typography>}
                            </List>
                        </Paper>
                    </Grid>

                </Grid>
            </Container>
        </Box>
    );
};

export default ManagerDashboard;