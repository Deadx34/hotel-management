import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

// Import your pages and components
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage'; // <-- 1. IMPORT THE NEW PAGE
import DashboardPage from './pages/DashboardPage';
import Navbar from './components/Common/Navbar';

function App() {
    return (
        <Router>
            <Navbar />
            <main>
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/register" element={<RegisterPage />} /> {/* <-- 2. ADD THE NEW ROUTE */}
                    <Route path="/dashboard" element={<DashboardPage />} />
                </Routes>
            </main>
        </Router>
    );
}

export default App;