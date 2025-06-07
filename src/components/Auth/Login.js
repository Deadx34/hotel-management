import React, { useState } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
// Import Firebase services we need
import { auth } from '../../firebase-config'; // Assuming your config file is at this path
import { signInWithEmailAndPassword } from 'firebase/auth';

// MUI Components
import {
    Container,
    Box,
    TextField,
    Button,
    Typography,
    CircularProgress,
    Alert,
    InputAdornment,
    IconButton,
    Paper,
    Link
} from '@mui/material';

// MUI Icons
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import LoginIcon from '@mui/icons-material/Login';
import EmailIcon from '@mui/icons-material/Email'; // Changed from AccountCircle

const Login = () => {
    // State now uses email instead of username
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            // --- FIREBASE LOGIN LOGIC ---
            await signInWithEmailAndPassword(auth, formData.email, formData.password);

            // No need to manually set items in localStorage.
            // Firebase automatically persists the user's session.
            
            navigate('/dashboard');

        } catch (err) {
            // Handle specific Firebase errors
            let errorMessage = 'Login failed. Please check your credentials.';
            if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
                errorMessage = 'Invalid email or password.';
            } else if (err.code === 'auth/invalid-email') {
                errorMessage = 'Please enter a valid email address.';
            }
            console.error("Firebase login error:", err.code, err.message);
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const handleTogglePassword = () => {
        setShowPassword((prev) => !prev);
    };

    return (
        <Container component="main" maxWidth="xs">
            <Paper
                elevation={6}
                sx={{
                    marginTop: 8,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    padding: 4,
                    borderRadius: 2,
                }}
            >
                <Typography component="h1" variant="h5" gutterBottom>
                    Sign In
                </Typography>

                <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }} noValidate>
                    {error && (
                        <Alert severity="error" sx={{ width: '100%', mb: 2 }}>
                            {error}
                        </Alert>
                    )}

                    {/* Changed TextField to accept email */}
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="email"
                        label="Email Address"
                        name="email"
                        autoComplete="email"
                        autoFocus
                        value={formData.email}
                        onChange={handleChange}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <EmailIcon />
                                </InputAdornment>
                            ),
                        }}
                    />

                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        name="password"
                        label="Password"
                        type={showPassword ? 'text' : 'password'}
                        id="password"
                        autoComplete="current-password"
                        value={formData.password}
                        onChange={handleChange}
                        InputProps={{
                            endAdornment: ( // Changed to endAdornment for better UX
                                <InputAdornment position="end">
                                    <IconButton
                                        aria-label="toggle password visibility"
                                        onClick={handleTogglePassword}
                                        edge="end"
                                    >
                                        {showPassword ? <VisibilityOff /> : <Visibility />}
                                    </IconButton>
                                </InputAdornment>
                            ),
                        }}
                    />

                    <Box sx={{ position: 'relative', mt: 3, mb: 2 }}>
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            disabled={loading}
                            startIcon={<LoginIcon />}
                        >
                            Sign In
                        </Button>
                        {loading && (
                            <CircularProgress
                                size={24}
                                sx={{
                                    position: 'absolute',
                                    top: '50%',
                                    left: '50%',
                                    marginTop: '-12px',
                                    marginLeft: '-12px',
                                }}
                            />
                        )}
                    </Box>

                    <Link component={RouterLink} to="/register" variant="body2">
                        {"Don't have an account? Register"}
                    </Link>
                </Box>
            </Paper>
        </Container>
    );
};

export default Login;