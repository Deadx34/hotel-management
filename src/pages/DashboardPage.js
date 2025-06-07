import React, { useState, useEffect } from 'react';
import { auth, db } from '../firebase-config'; // Make sure the path is correct
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';

// Import the different dashboard components
import CustomerDashboard from '../components/Dashboard/CustomerDashboard';
import ClerkDashboard from '../components/Dashboard/ClerkDashboard';
import ManagerDashboard from '../components/Dashboard/ManagerDashboard';
import { CircularProgress, Box } from '@mui/material'; // For a loading indicator

const DashboardPage = () => {
    const [userRole, setUserRole] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // onAuthStateChanged is the listener for login/logout events
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                // User is signed in.
                // Now, get their custom data (including role) from Firestore.
                const userDocRef = doc(db, 'users', user.uid);
                const userDoc = await getDoc(userDocRef);

                if (userDoc.exists()) {
                    // Get the role from the document data
                    setUserRole(userDoc.data().role);
                } else {
                    // Handle case where user exists in Auth but not in Firestore
                    console.error("User document not found in Firestore!");
                    setUserRole('unknown'); // Or handle as an error
                }
            } else {
                // User is signed out.
                setUserRole(null);
            }
            setLoading(false);
        });

        // Cleanup the listener when the component unmounts
        return () => unsubscribe();
    }, []); // The empty array ensures this effect runs only once on mount

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                <CircularProgress />
            </Box>
        );
    }

    // Use a switch statement to render the correct dashboard based on the user's role
    switch (userRole) {
        case 'customer':
            return <CustomerDashboard />;
        case 'clerk':
            return <ClerkDashboard />;
        case 'manager':
            return <ManagerDashboard />;
        default:
            return <p>An error occurred or you do not have a role assigned. Please log in again.</p>;
    }
};

export default DashboardPage;