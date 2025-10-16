const express = require('express');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const { protect } = require('../middleware/auth');
const { checkRole } = require('../middleware/role');

const router = express.Router();

// @route   GET /api/user/profile
// @desc    Get user profile
// @access  Private
router.get('/profile', protect, async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select('-password').lean();

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        res.status(200).json({
            success: true,
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                phoneNumber: user.phoneNumber || user.phone || '',
                role: user.role,
                address: user.address || {},
                isEmailVerified: user.emailVerified || false,
                createdAt: user.createdAt,
                updatedAt: user.updatedAt
            }
        });

    } catch (error) {
        console.error('Get user profile error:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Server error during profile retrieval'
        });
    }
});

// @route   PUT /api/user/profile
// @desc    Update user profile
// @access  Private
router.put('/profile', protect, async (req, res) => {
    try {
        const { name, phoneNumber, phone, address } = req.body;

        // Validation
        if (name !== undefined && (!name || name.trim() === '')) {
            return res.status(400).json({
                success: false,
                message: 'Name is required'
            });
        }

        if (name && name.length < 2) {
            return res.status(400).json({
                success: false,
                message: 'Name must be at least 2 characters'
            });
        }

        // Validate phone number format if provided
        const phoneValue = phoneNumber || phone;
        if (phoneValue && !/^\d{10}$/.test(phoneValue.replace(/\D/g, ''))) {
            return res.status(400).json({
                success: false,
                message: 'Invalid phone number format (must be 10 digits)'
            });
        }

        // Validate pincode if provided
        if (address?.pincode && !/^\d{6}$/.test(address.pincode)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid pincode format (must be 6 digits)'
            });
        }

        const updateData = {};
        if (name) updateData.name = name.trim();
        if (phoneValue) {
            updateData.phoneNumber = phoneValue;
            updateData.phone = phoneValue; // Keep both fields in sync
        }
        if (address) updateData.address = address;
        updateData.updatedAt = new Date();

        const user = await User.findByIdAndUpdate(
            req.user._id,
            updateData,
            { new: true, runValidators: true }
        ).select('-password');

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Profile updated successfully',
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                phoneNumber: user.phoneNumber || user.phone || '',
                role: user.role,
                address: user.address || {},
                isEmailVerified: user.emailVerified || false,
                updatedAt: user.updatedAt
            }
        });

    } catch (error) {
        console.error('Update user profile error:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Server error during profile update'
        });
    }
});

module.exports = router;

