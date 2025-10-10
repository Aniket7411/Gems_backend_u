const express = require('express');
const { body, validationResult } = require('express-validator');
const Seller = require('../models/Seller');
const { protect } = require('../middleware/auth');
const { checkRole } = require('../middleware/role');

const router = express.Router();

// @route   GET /api/seller/profile
// @desc    Get seller profile
// @access  Private (Seller only)
router.get('/profile', protect, checkRole('seller'), async (req, res) => {
    try {
        const seller = await Seller.findOne({ user: req.user._id });

        if (!seller) {
            return res.status(404).json({
                success: false,
                message: 'Seller profile not found'
            });
        }

        res.json({
            success: true,
            seller
        });

    } catch (error) {
        console.error('Get seller profile error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error during profile retrieval'
        });
    }
});

// @route   PUT /api/seller/profile
// @desc    Update seller profile
// @access  Private (Seller only)
router.put('/profile', protect, checkRole('seller'), async (req, res) => {
    try {
        const seller = await Seller.findOne({ user: req.user._id });

        if (!seller) {
            // Create new seller profile if doesn't exist
            const newSeller = new Seller({
                user: req.user._id,
                email: req.user.email,
                ...req.body
            });
            await newSeller.save();

            return res.json({
                success: true,
                message: 'Profile created successfully',
                seller: newSeller
            });
        }

        // Update existing seller profile
        const updatedSeller = await Seller.findByIdAndUpdate(
            seller._id,
            req.body,
            { new: true, runValidators: true }
        );

        res.json({
            success: true,
            message: 'Profile updated successfully',
            seller: updatedSeller
        });

    } catch (error) {
        console.error('Update seller profile error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error during profile update'
        });
    }
});

module.exports = router;
