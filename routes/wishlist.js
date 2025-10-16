const express = require('express');
const { body, validationResult } = require('express-validator');
const Wishlist = require('../models/Wishlist');
const Gem = require('../models/Gem');
const { protect } = require('../middleware/auth');

const router = express.Router();

// @route   POST /api/wishlist/add
// @desc    Add item to wishlist
// @access  Private
router.post('/add', protect, [
    body('gemId').isMongoId().withMessage('Valid gem ID is required')
], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                message: 'Validation failed',
                errors: errors.array()
            });
        }

        const { gemId } = req.body;

        // Check if gem exists
        const gem = await Gem.findById(gemId);
        if (!gem) {
            return res.status(404).json({
                success: false,
                message: 'Gem not found'
            });
        }

        // Find or create wishlist
        let wishlist = await Wishlist.findOne({ user: req.user._id });

        if (!wishlist) {
            wishlist = new Wishlist({
                user: req.user._id,
                gems: [gemId]
            });
        } else {
            // Check if gem already in wishlist
            if (wishlist.gems.includes(gemId)) {
                return res.status(400).json({
                    success: false,
                    message: 'Item already in wishlist'
                });
            }
            wishlist.gems.push(gemId);
        }

        await wishlist.save();

        res.json({
            success: true,
            message: 'Item added to wishlist'
        });

    } catch (error) {
        console.error('Add to wishlist error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error during adding to wishlist'
        });
    }
});

// @route   GET /api/wishlist
// @desc    Get user's wishlist
// @access  Private
router.get('/', protect, async (req, res) => {
    try {
        const wishlist = await Wishlist.findOne({ user: req.user._id })
            .populate('gems', 'name hindiName price heroImage category availability stock');

        if (!wishlist) {
            return res.json({
                success: true,
                wishlist: []
            });
        }

        res.json({
            success: true,
            wishlist: wishlist.gems
        });

    } catch (error) {
        console.error('Get wishlist error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error during wishlist retrieval'
        });
    }
});

// @route   DELETE /api/wishlist/remove/:gemId
// @desc    Remove item from wishlist
// @access  Private
router.delete('/remove/:gemId', protect, async (req, res) => {
    try {
        const { gemId } = req.params;

        const wishlist = await Wishlist.findOne({ user: req.user._id });

        if (!wishlist) {
            return res.status(404).json({
                success: false,
                message: 'Wishlist not found'
            });
        }

        wishlist.gems = wishlist.gems.filter(id => id.toString() !== gemId);
        await wishlist.save();

        res.json({
            success: true,
            message: 'Item removed from wishlist'
        });

    } catch (error) {
        console.error('Remove from wishlist error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error during wishlist removal'
        });
    }
});

// @route   DELETE /api/wishlist/clear
// @desc    Clear entire wishlist
// @access  Private
router.delete('/clear', protect, async (req, res) => {
    try {
        const wishlist = await Wishlist.findOne({ user: req.user._id });

        if (!wishlist) {
            return res.status(404).json({
                success: false,
                message: 'Wishlist not found'
            });
        }

        wishlist.gems = [];
        await wishlist.save();

        res.json({
            success: true,
            message: 'Wishlist cleared'
        });

    } catch (error) {
        console.error('Clear wishlist error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error during wishlist clearing'
        });
    }
});

// @route   GET /api/wishlist/check/:gemId
// @desc    Check if item is in wishlist
// @access  Private
router.get('/check/:gemId', protect, async (req, res) => {
    try {
        const { gemId } = req.params;

        const wishlist = await Wishlist.findOne({ user: req.user._id });

        const isInWishlist = wishlist && wishlist.gems.includes(gemId);

        res.json({
            success: true,
            isInWishlist
        });

    } catch (error) {
        console.error('Check wishlist error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error during wishlist check'
        });
    }
});

module.exports = router;
