const express = require('express');
const { body, validationResult } = require('express-validator');
const Gem = require('../models/Gem');
const { protect } = require('../middleware/auth');
const { checkRole } = require('../middleware/role');

const router = express.Router();

// @route   POST /api/gems
// @desc    Add a new gem (SELLER ONLY)
// @access  Private (Seller)
router.post('/', protect, checkRole('seller'), [
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('hindiName').trim().notEmpty().withMessage('Hindi name is required'),
    body('planet').trim().notEmpty().withMessage('Planet is required'),
    body('color').trim().notEmpty().withMessage('Color is required'),
    body('description').trim().notEmpty().withMessage('Description is required'),
    body('benefits').isArray({ min: 1 }).withMessage('At least one benefit is required'),
    body('suitableFor').isArray({ min: 1 }).withMessage('Suitable for information is required'),
    body('price').isNumeric().isFloat({ min: 0 }).withMessage('Valid price is required'),
    body('sizeWeight').isNumeric().isFloat({ min: 0 }).withMessage('Valid size/weight is required'),
    body('sizeUnit').isIn(['carat', 'gram', 'ounce']).withMessage('Valid size unit is required'),
    body('certification').trim().notEmpty().withMessage('Certification is required'),
    body('origin').trim().notEmpty().withMessage('Origin is required'),
    body('deliveryDays').isInt({ min: 1 }).withMessage('Valid delivery days required'),
    body('heroImage').trim().notEmpty().withMessage('Hero image is required')
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

        const gemData = { ...req.body, seller: req.user._id };
        const gem = new Gem(gemData);
        await gem.save();

        res.status(201).json({
            success: true,
            message: 'Gem added successfully',
            gem: {
                _id: gem._id,
                name: gem.name,
                hindiName: gem.hindiName,
                price: gem.price,
                heroImage: gem.heroImage,
                seller: gem.seller,
                createdAt: gem.createdAt
            }
        });

    } catch (error) {
        console.error('Add gem error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error during gem creation'
        });
    }
});

// @route   GET /api/gems
// @desc    Get all gems with filters, search, sort, and pagination (PUBLIC)
// @access  Public
router.get('/', async (req, res) => {
    try {
        // Extract query parameters
        const {
            page = 1,
            limit = 12,
            search = '',
            category = '',
            zodiac = '',
            planet = '',
            minPrice = '',
            maxPrice = '',
            sort = 'newest',
            availability
        } = req.query;

        // Build query object
        let query = {};

        // 1. SEARCH FILTER (searches in name, hindiName, description)
        if (search) {
            query.$or = [
                { name: { $regex: search, $options: 'i' } },
                { hindiName: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } }
            ];
        }

        // 2. CATEGORY FILTER (multiple categories comma-separated)
        if (category) {
            const categories = category.split(',').map(cat => cat.trim());
            // Search in name field (gem names are like "Ruby", "Emerald", etc.)
            query.name = { $in: categories };
        }

        // 3. ZODIAC FILTER (searches in suitableFor array)
        if (zodiac) {
            query.suitableFor = { $regex: zodiac, $options: 'i' };
        }

        // 4. PLANET FILTER
        if (planet) {
            query.planet = { $regex: planet, $options: 'i' };
        }

        // 5. PRICE RANGE FILTER
        if (minPrice || maxPrice) {
            query.price = {};
            if (minPrice) query.price.$gte = Number(minPrice);
            if (maxPrice) query.price.$lte = Number(maxPrice);
        }

        // 6. AVAILABILITY FILTER
        if (availability !== undefined) {
            query.availability = availability === 'true';
        }

        // 7. BUILD SORT OPTION
        let sortOption = {};
        switch (sort) {
            case 'oldest':
                sortOption.createdAt = 1; // Ascending (oldest first)
                break;
            case 'price-low':
                sortOption.price = 1; // Low to High
                break;
            case 'price-high':
                sortOption.price = -1; // High to Low
                break;
            case 'name':
                sortOption.name = 1; // A-Z
                break;
            case 'newest':
            default:
                sortOption.createdAt = -1; // Descending (newest first)
                break;
        }

        // 8. PAGINATION
        const skip = (Number(page) - 1) * Number(limit);
        const total = await Gem.countDocuments(query);
        const totalPages = Math.ceil(total / Number(limit));

        // 9. FETCH GEMS with seller details
        const Seller = require('../models/Seller');
        const gems = await Gem.find(query)
            .populate('seller', 'name email phone')
            .sort(sortOption)
            .skip(skip)
            .limit(Number(limit));

        // 10. Get seller profiles for each gem
        const gemsWithSellerInfo = await Promise.all(
            gems.map(async (gem) => {
                // Check if seller exists
                if (!gem.seller || !gem.seller._id) {
                    return {
                        ...gem.toObject(),
                        seller: {
                            _id: null,
                            fullName: 'Unknown Seller',
                            shopName: 'Gem Store',
                            isVerified: false
                        }
                    };
                }

                const sellerProfile = await Seller.findOne({ user: gem.seller._id });
                return {
                    ...gem.toObject(),
                    seller: sellerProfile ? {
                        _id: sellerProfile._id,
                        fullName: sellerProfile.fullName,
                        shopName: sellerProfile.shopName,
                        isVerified: sellerProfile.isVerified
                    } : {
                        _id: gem.seller._id,
                        fullName: gem.seller.name || 'Seller',
                        shopName: 'Gem Store',
                        isVerified: false
                    }
                };
            })
        );

        // 11. SEND RESPONSE
        res.json({
            success: true,
            gems: gemsWithSellerInfo,
            pagination: {
                currentPage: Number(page),
                totalPages,
                totalItems: total,
                limit: Number(limit),
                hasNext: Number(page) < totalPages,
                hasPrev: Number(page) > 1
            }
        });

    } catch (error) {
        console.error('Get gems error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching gems',
            error: error.message
        });
    }
});

// @route   GET /api/gems/categories
// @desc    Get unique gem categories/names for filter dropdown (PUBLIC)
// @access  Public
router.get('/categories', async (req, res) => {
    try {
        // Get distinct gem names (these act as categories)
        const categories = await Gem.distinct('name');

        res.json({
            success: true,
            data: categories.sort()
        });

    } catch (error) {
        console.error('Get categories error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching categories',
            error: error.message
        });
    }
});

// @route   GET /api/gems/search-suggestions
// @desc    Get search suggestions for autocomplete (PUBLIC)
// @access  Public
router.get('/search-suggestions', async (req, res) => {
    try {
        const { q } = req.query;

        if (!q || q.length < 2) {
            return res.json({
                success: true,
                suggestions: []
            });
        }

        // Search in name, hindiName, planet, and suitableFor
        const gems = await Gem.find({
            $or: [
                { name: { $regex: q, $options: 'i' } },
                { hindiName: { $regex: q, $options: 'i' } },
                { planet: { $regex: q, $options: 'i' } },
                { suitableFor: { $regex: q, $options: 'i' } }
            ],
            availability: true
        })
            .select('name hindiName planet suitableFor')
            .limit(10);

        // Create unique suggestions
        const suggestions = [];
        const added = new Set();

        gems.forEach(gem => {
            // Add gem name
            if (gem.name.toLowerCase().includes(q.toLowerCase()) && !added.has(gem.name.toLowerCase())) {
                suggestions.push({
                    type: 'name',
                    value: gem.name,
                    label: `${gem.name} (${gem.hindiName})`,
                    gemId: gem._id
                });
                added.add(gem.name.toLowerCase());
            }

            // Add planet
            if (gem.planet.toLowerCase().includes(q.toLowerCase()) && !added.has(gem.planet.toLowerCase())) {
                suggestions.push({
                    type: 'planet',
                    value: gem.planet,
                    label: `Planet: ${gem.planet}`,
                    icon: '🪐'
                });
                added.add(gem.planet.toLowerCase());
            }

            // Add zodiac signs from suitableFor
            gem.suitableFor.forEach(zodiac => {
                const zodiacLower = zodiac.toLowerCase();
                const zodiacList = ['aries', 'taurus', 'gemini', 'cancer', 'leo', 'virgo',
                    'libra', 'scorpio', 'sagittarius', 'capricorn', 'aquarius', 'pisces'];

                if (zodiacList.includes(zodiacLower) &&
                    zodiacLower.includes(q.toLowerCase()) &&
                    !added.has(zodiacLower)) {
                    suggestions.push({
                        type: 'zodiac',
                        value: zodiac,
                        label: `Zodiac: ${zodiac}`,
                        icon: '♈'
                    });
                    added.add(zodiacLower);
                }
            });
        });

        res.json({
            success: true,
            suggestions: suggestions.slice(0, 8) // Limit to 8 suggestions
        });

    } catch (error) {
        console.error('Search suggestions error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error during search suggestions'
        });
    }
});

// @route   GET /api/gems/my-gems
// @desc    Get seller's own gems (SELLER ONLY)
// @access  Private (Seller)
router.get('/my-gems', protect, checkRole('seller'), async (req, res) => {
    try {
        const gems = await Gem.find({ seller: req.user._id })
            .sort({ createdAt: -1 });

        res.json({
            success: true,
            count: gems.length,
            gems
        });

    } catch (error) {
        console.error('Get my gems error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error during gems retrieval'
        });
    }
});

// @route   GET /api/gems/:id
// @desc    Get single gem by ID with full details including seller info (PUBLIC)
// @access  Public
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;

        // Validate MongoDB ObjectID
        if (!id.match(/^[0-9a-fA-F]{24}$/)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid gem ID format'
            });
        }

        // Fetch gem with basic seller info
        const gem = await Gem.findById(id)
            .populate('seller', 'name email phone');

        if (!gem) {
            return res.status(404).json({
                success: false,
                message: 'Gem not found'
            });
        }

        // Get full seller profile
        const Seller = require('../models/Seller');
        const sellerProfile = await Seller.findOne({ user: gem.seller._id });

        // Build gem response with full seller details
        const gemResponse = {
            ...gem.toObject(),
            seller: sellerProfile ? {
                _id: sellerProfile._id,
                fullName: sellerProfile.fullName,
                email: sellerProfile.email,
                phone: sellerProfile.phone,
                shopName: sellerProfile.shopName,
                isVerified: sellerProfile.isVerified,
                rating: 4.8 // Placeholder - can be calculated from reviews later
            } : {
                _id: gem.seller._id,
                fullName: gem.seller.name,
                email: gem.seller.email,
                phone: gem.seller.phone,
                shopName: 'Gem Store',
                isVerified: false,
                rating: 0
            },
            reviews: [], // Placeholder for future review implementation
            averageRating: 0, // Placeholder
            totalReviews: 0 // Placeholder
        };

        res.json({
            success: true,
            gem: gemResponse
        });

    } catch (error) {
        console.error('Get gem error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error during gem retrieval',
            error: error.message
        });
    }
});

// @route   PUT /api/gems/:id
// @desc    Update gem (SELLER ONLY - Own gems)
// @access  Private (Seller)
router.put('/:id', protect, checkRole('seller'), async (req, res) => {
    try {
        // Find gem and check ownership
        const gem = await Gem.findById(req.params.id);

        if (!gem) {
            return res.status(404).json({
                success: false,
                message: 'Gem not found'
            });
        }

        // Check if user owns this gem
        if (gem.seller.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to update this gem'
            });
        }

        // Update gem
        const updatedGem = await Gem.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        res.json({
            success: true,
            message: 'Gem updated successfully',
            gem: updatedGem
        });

    } catch (error) {
        console.error('Update gem error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error during gem update'
        });
    }
});

// @route   DELETE /api/gems/:id
// @desc    Delete gem (SELLER ONLY - Own gems)
// @access  Private (Seller)
router.delete('/:id', protect, checkRole('seller'), async (req, res) => {
    try {
        // Find gem and check ownership
        const gem = await Gem.findById(req.params.id);

        if (!gem) {
            return res.status(404).json({
                success: false,
                message: 'Gem not found'
            });
        }

        // Check if user owns this gem
        if (gem.seller.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to delete this gem'
            });
        }

        await Gem.findByIdAndDelete(req.params.id);

        res.json({
            success: true,
            message: 'Gem deleted successfully'
        });

    } catch (error) {
        console.error('Delete gem error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error during gem deletion'
        });
    }
});

// @route   GET /api/gems/filter/zodiac/:zodiacSign
// @desc    Get gems by zodiac sign (PUBLIC)
// @access  Public
router.get('/filter/zodiac/:zodiacSign', async (req, res) => {
    try {
        const { zodiacSign } = req.params;
        const { page = 1, limit = 12 } = req.query;

        const skip = (parseInt(page) - 1) * parseInt(limit);

        const gems = await Gem.find({
            suitableFor: { $regex: zodiacSign, $options: 'i' },
            availability: true
        })
            .populate('seller', 'name')
            .skip(skip)
            .limit(parseInt(limit))
            .sort({ createdAt: -1 });

        const count = await Gem.countDocuments({
            suitableFor: { $regex: zodiacSign, $options: 'i' },
            availability: true
        });

        const totalPages = Math.ceil(count / parseInt(limit));

        res.json({
            success: true,
            count,
            totalPages,
            currentPage: parseInt(page),
            zodiacSign,
            gems
        });

    } catch (error) {
        console.error('Get gems by zodiac error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error during gems retrieval'
        });
    }
});

// @route   GET /api/gems/filter/planet/:planet
// @desc    Get gems by planet (PUBLIC)
// @access  Public
router.get('/filter/planet/:planet', async (req, res) => {
    try {
        const { planet } = req.params;
        const { page = 1, limit = 12 } = req.query;

        const skip = (parseInt(page) - 1) * parseInt(limit);

        const gems = await Gem.find({
            planet: { $regex: planet, $options: 'i' },
            availability: true
        })
            .populate('seller', 'name')
            .skip(skip)
            .limit(parseInt(limit))
            .sort({ createdAt: -1 });

        const count = await Gem.countDocuments({
            planet: { $regex: planet, $options: 'i' },
            availability: true
        });

        const totalPages = Math.ceil(count / parseInt(limit));

        res.json({
            success: true,
            count,
            totalPages,
            currentPage: parseInt(page),
            planet,
            gems
        });

    } catch (error) {
        console.error('Get gems by planet error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error during gems retrieval'
        });
    }
});

module.exports = router;