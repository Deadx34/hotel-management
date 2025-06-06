import React from 'react';

// Import the different dashboard components
import CustomerDashboard from '../components/Dashboard/CustomerDashboard';
import ClerkDashboard from '../components/Dashboard/ClerkDashboard';
import ManagerDashboard from '../components/Dashboard/ManagerDashboard';

const DashboardPage = () => {
    // Retrieve the user object from local storage
    const user = JSON.parse(localStorage.getItem('user'));

    // If for some reason there is no user, prompt to log in
    if (!user) {
        return <p>An error occurred. Please log in again to view the dashboard.</p>;
    }

    // Use a switch statement to render the correct dashboard based on the user's role
    switch (user.role) {
        case 'customer':
            return <CustomerDashboard />;
        case 'clerk':
            return <ClerkDashboard />;
        case 'manager':
            return <ManagerDashboard />;
        default:
            return <p>No dashboard available for your role.</p>;
    }
};

export default DashboardPage;