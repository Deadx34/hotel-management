const User = require('../models/User');
const jwt = require('jsonwebtoken');
require('dotenv').config();

// Function to generate a JWT for authentication
const generateToken = (id, role) => {
    return jwt.sign({ id, role }, process.env.JWT_SECRET, {
        expiresIn: '1d',
    });
};

// --- Register User Logic ---
const registerUser = async (req, res) => {
    const { username, password, role, personalDetails } = req.body;

    try {
        const userExists = await User.findOne({ username });

        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const user = await User.create({
            username,
            password,
            role: role || 'customer', // Default role is 'customer'
            personalDetails
        });

        if (user) {
            res.status(201).json({
                _id: user._id,
                username: user.username,
                role: user.role,
                token: generateToken(user._id, user.role),
            });
        } else {
            res.status(400).json({ message: 'Invalid user data' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// --- Login User Logic ---
const loginUser = async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await User.findOne({ username });

        if (user && (await user.matchPassword(password))) {
            const userResponse = {
                _id: user._id,
                username: user.username,
                role: user.role,
                personalDetails: user.personalDetails
            };
            
            res.json({
                user: userResponse,
                token: generateToken(user._id, user.role),
            });
        } else {
            res.status(401).json({ message: 'Invalid username or password' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};


module.exports = { registerUser, loginUser };
