const express = require('express');
const { body, validationResult } = require('express-validator');
const Cart = require('../models/Cart');
const Gem = require('../models/Gem');
const { protect } = require('../middleware/auth');
const { checkRole } = require('../middleware/role');

const router = express.Router();

// @route   POST /api/cart
// @desc    Add item to cart (BUYER ONLY)
// @access  Private (Buyer)
router.post('/', protect, checkRole('buyer'), [
    body('gemId').isMongoId().withMessage('Valid gem ID is required'),
    body('quantity').isInt({ min: 1 }).withMessage('Quantity must be at least 1')
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

        const { gemId, quantity } = req.body;
        const userId = req.user._id;

        // Check if gem exists
        const gem = await Gem.findById(gemId);
        if (!gem) {
            return res.status(404).json({
                success: false,
                message: 'Gem not found'
            });
        }

        // Check availability and stock
        if (!gem.availability || gem.stock < quantity) {
            return res.status(400).json({
                success: false,
                message: 'Gem is not available or insufficient stock'
            });
        }

        // Find or create cart
        let cart = await Cart.findOne({ user: userId });

        if (!cart) {
            cart = new Cart({ user: userId, items: [] });
        }

        // Check if gem already in cart
        const existingItemIndex = cart.items.findIndex(
            item => item.gem.toString() === gemId
        );

        if (existingItemIndex > -1) {
            // Update quantity
            cart.items[existingItemIndex].quantity += quantity;
        } else {
            // Add new item
            cart.items.push({
                gem: gemId,
                quantity,
                price: gem.price
            });
        }

        await cart.save();

        // Populate cart for response
        await cart.populate('items.gem', 'name price heroImage');

        // Calculate totals
        const totalItems = cart.items.reduce((sum, item) => sum + item.quantity, 0);
        const totalPrice = cart.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

        await cart.populate('items.gem', 'name price heroImage stock availability');

        res.json({
            success: true,
            message: 'Item added to cart',
            cart: {
                items: cart.items,
                totalItems,
                totalPrice
            }
        });

    } catch (error) {
        console.error('Add to cart error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error during adding to cart'
        });
    }
});

// @route   GET /api/cart
// @desc    Get user's cart (BUYER ONLY)
// @access  Private (Buyer)
router.get('/', protect, checkRole('buyer'), async (req, res) => {
    try {
        const cart = await Cart.findOne({ user: req.user._id })
            .populate('items.gem', 'name hindiName price heroImage availability stock sizeWeight sizeUnit deliveryDays');

        if (!cart || cart.items.length === 0) {
            return res.json({
                success: true,
                cart: {
                    items: [],
                    totalItems: 0,
                    totalPrice: 0
                }
            });
        }

        // Calculate totals
        const totalItems = cart.items.reduce((sum, item) => sum + item.quantity, 0);
        const totalPrice = cart.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

        res.json({
            success: true,
            cart: {
                items: cart.items,
                totalItems,
                totalPrice
            }
        });

    } catch (error) {
        console.error('Get cart error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error during cart retrieval'
        });
    }
});

// @route   PUT /api/cart/:itemId
// @desc    Update cart item quantity
// @access  Private (Buyer)
router.put('/:itemId', protect, checkRole('buyer'), [
    body('quantity').isInt({ min: 1 }).withMessage('Quantity must be at least 1')
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

        const { quantity } = req.body;
        const { itemId } = req.params;

        const cart = await Cart.findOne({ user: req.user._id });

        if (!cart) {
            return res.status(404).json({
                success: false,
                message: 'Cart not found'
            });
        }

        const itemIndex = cart.items.findIndex(item => item._id.toString() === itemId);

        if (itemIndex === -1) {
            return res.status(404).json({
                success: false,
                message: 'Item not found in cart'
            });
        }

        // Check gem availability
        const gem = await Gem.findById(cart.items[itemIndex].gem);
        if (!gem || !gem.availability || gem.stock < quantity) {
            return res.status(400).json({
                success: false,
                message: 'Gem is not available or insufficient stock'
            });
        }

        cart.items[itemIndex].quantity = quantity;
        await cart.save();

        res.json({
            success: true,
            message: 'Cart item updated'
        });

    } catch (error) {
        console.error('Update cart error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error during cart update'
        });
    }
});

// @route   DELETE /api/cart/:itemId
// @desc    Remove item from cart
// @access  Private (Buyer)
router.delete('/:itemId', protect, checkRole('buyer'), async (req, res) => {
    try {
        const { itemId } = req.params;

        const cart = await Cart.findOne({ user: req.user._id });

        if (!cart) {
            return res.status(404).json({
                success: false,
                message: 'Cart not found'
            });
        }

        cart.items = cart.items.filter(item => item._id.toString() !== itemId);
        await cart.save();

        res.json({
            success: true,
            message: 'Item removed from cart'
        });

    } catch (error) {
        console.error('Remove from cart error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error during item removal'
        });
    }
});

// @route   DELETE /api/cart
// @desc    Clear cart
// @access  Private (Buyer)
router.delete('/', protect, checkRole('buyer'), async (req, res) => {
    try {
        const cart = await Cart.findOne({ user: req.user._id });

        if (!cart) {
            return res.status(404).json({
                success: false,
                message: 'Cart not found'
            });
        }

        cart.items = [];
        await cart.save();

        res.json({
            success: true,
            message: 'Cart cleared'
        });

    } catch (error) {
        console.error('Clear cart error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error during cart clearing'
        });
    }
});

module.exports = router;