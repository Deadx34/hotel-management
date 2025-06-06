import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import * as api from '../../services/api';
import './Auth.css';

const Register = () => {
    const [formData, setFormData] = useState({
        username: '',
        password: '',
        confirmPassword: '',
        firstName: '',
        lastName: '',
        email: '',
        phone: ''
    });
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        // Clear error when user starts typing
        if (errors[name]) {
            setErrors({ ...errors, [name]: '' });
        }
    };

    const validateForm = () => {
        const newErrors = {};
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const phoneRegex = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/;

        if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
        if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
        if (!formData.email.trim()) {
            newErrors.email = 'Email is required';
        } else if (!emailRegex.test(formData.email)) {
            newErrors.email = 'Please enter a valid email';
        }
        if (formData.phone && !phoneRegex.test(formData.phone)) {
            newErrors.phone = 'Please enter a valid phone number';
        }
        if (!formData.username.trim()) newErrors.username = 'Username is required';
        if (!formData.password) {
            newErrors.password = 'Password is required';
        } else if (formData.password.length < 8) {
            newErrors.password = 'Password must be at least 8 characters';
        }
        if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!validateForm()) return;
        
        setIsSubmitting(true);
        setErrors({});

        try {
            const registrationData = {
                username: formData.username,
                password: formData.password,
                personalDetails: {
                    firstName: formData.firstName,
                    lastName: formData.lastName,
                    email: formData.email,
                    phone: formData.phone
                }
            };

            await api.register(registrationData);
            navigate('/login', { 
                state: { 
                    successMessage: 'Registration successful! Please log in.' 
                } 
            });
        } catch (err) {
            setErrors({
                ...errors,
                form: err.response?.data?.message || 'Registration failed. Please try again.'
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-card">
                <div className="auth-header">
                    <h2>Create Account</h2>
                    <p>Join us to start your journey</p>
                </div>
                
                {errors.form && <div className="alert error">{errors.form}</div>}

                <form className="auth-form" onSubmit={handleSubmit} noValidate>
                    <div className="form-row">
                        <div className={`form-group ${errors.firstName ? 'error' : ''}`}>
                            <label htmlFor="firstName">First Name</label>
                            <input
                                type="text"
                                id="firstName"
                                name="firstName"
                                value={formData.firstName}
                                onChange={handleChange}
                                required
                            />
                            {errors.firstName && <span className="error-message">{errors.firstName}</span>}
                        </div>
                        <div className={`form-group ${errors.lastName ? 'error' : ''}`}>
                            <label htmlFor="lastName">Last Name</label>
                            <input
                                type="text"
                                id="lastName"
                                name="lastName"
                                value={formData.lastName}
                                onChange={handleChange}
                                required
                            />
                            {errors.lastName && <span className="error-message">{errors.lastName}</span>}
                        </div>
                    </div>

                    <div className={`form-group ${errors.email ? 'error' : ''}`}>
                        <label htmlFor="email">Email</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                        {errors.email && <span className="error-message">{errors.email}</span>}
                    </div>

                    <div className={`form-group ${errors.phone ? 'error' : ''}`}>
                        <label htmlFor="phone">Phone Number (Optional)</label>
                        <input
                            type="tel"
                            id="phone"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            placeholder="+1 (123) 456-7890"
                        />
                        {errors.phone && <span className="error-message">{errors.phone}</span>}
                    </div>

                    <div className={`form-group ${errors.username ? 'error' : ''}`}>
                        <label htmlFor="username">Username</label>
                        <input
                            type="text"
                            id="username"
                            name="username"
                            value={formData.username}
                            onChange={handleChange}
                            required
                        />
                        {errors.username && <span className="error-message">{errors.username}</span>}
                    </div>

                    <div className={`form-group ${errors.password ? 'error' : ''}`}>
                        <label htmlFor="password">Password</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                        />
                        {errors.password && <span className="error-message">{errors.password}</span>}
                        <div className="password-hint">Must be at least 8 characters</div>
                    </div>

                    <div className={`form-group ${errors.confirmPassword ? 'error' : ''}`}>
                        <label htmlFor="confirmPassword">Confirm Password</label>
                        <input
                            type="password"
                            id="confirmPassword"
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            required
                        />
                        {errors.confirmPassword && <span className="error-message">{errors.confirmPassword}</span>}
                    </div>

                    <button 
                        type="submit" 
                        className="auth-button" 
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? 'Creating Account...' : 'Create Account'}
                    </button>
                </form>

                <div className="auth-footer">
                    <p>Already have an account? <Link to="/login" className="auth-link">Sign In</Link></p>
                </div>
            </div>
        </div>
    );
};

export default Register;