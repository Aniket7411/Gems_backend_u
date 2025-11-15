/**
 * BACKEND GEM MODEL/SCHEMA REFERENCE
 * 
 * This file shows the expected structure for the Gem model in your backend.
 * Update your backend gem model/schema to include the new fields.
 * 
 * Required Backend Changes:
 * 1. Add 'contactForPrice' field (Boolean, default: false)
 * 2. Make 'price' field optional/nullable when contactForPrice is true
 * 3. Update categories list to include all new categories
 */

// Example MongoDB/Mongoose Schema
const gemSchema = {
    // Basic Information
    name: {
        type: String,
        required: true,
        trim: true
    },
    hindiName: {
        type: String,
        required: true,
        trim: true
    },
    category: {
        type: String,
        required: true,
        // Updated categories list (see below)
        enum: [
            // Navratna
            'Blue Sapphire (Neelam)',
            'Yellow Sapphire (Pukhraj)',
            'Ruby (Manik)',
            'Emerald (Panna)',
            'Diamond (Heera)',
            'Pearl (Moti)',
            'Cat\'s Eye (Lehsunia)',
            'Hessonite (Gomed)',
            'Coral (Moonga)',
            // Exclusive Gemstones
            'Alexandrite',
            'Basra Pearl',
            'Burma Ruby',
            'Colombian Emerald',
            'Cornflower Blue Sapphire',
            'Kashmir Blue Sapphire',
            'No-Oil Emerald',
            'Padparadscha Sapphire',
            'Panjshir Emerald',
            'Swat Emerald',
            'Pigeon Blood Ruby',
            'Royal Blue Sapphire',
            // Sapphire
            'Sapphire',
            'Bi-Colour Sapphire (Pitambari)',
            'Blue Sapphire (Neelam)',
            'Color Change Sapphire',
            'Green Sapphire',
            'Pink Sapphire',
            'Padparadscha Sapphire',
            'Peach Sapphire',
            'Purple Sapphire (Khooni Neelam)',
            'White Sapphire',
            'Yellow Sapphire (Pukhraj)',
            // More Vedic Ratna (Upratan)
            'Amethyst',
            'Aquamarine',
            'Blue Topaz',
            'Citrine Stone (Sunela)',
            'Tourmaline',
            'Opal',
            'Tanzanite',
            'Iolite (Neeli)',
            'Jasper (Mahe Mariyam)',
            'Lapis',
            // Legacy categories (for backward compatibility)
            'Emerald',
            'Ruby',
            'Pearl',
            'Red Coral',
            'Gomed (Hessonite)',
            'Diamond',
            'Cat\'s Eye',
            'Moonstone',
            'Turquoise'
        ]
    },
    
    // Astrological Information
    planet: {
        type: String,
        required: true
    },
    planetHindi: {
        type: String,
        required: true
    },
    color: {
        type: String,
        required: true
    },
    
    // Description
    description: {
        type: String,
        required: true
    },
    benefits: [{
        type: String
    }],
    suitableFor: [{
        type: String
    }],
    
    // Pricing - NEW: contactForPrice field added
    price: {
        type: Number,
        required: function() {
            // Price is required only if contactForPrice is false
            return !this.contactForPrice;
        },
        min: 0,
        default: null
    },
    contactForPrice: {
        type: Boolean,
        default: false,
        required: true
    },
    discount: {
        type: Number,
        default: 0,
        min: 0
    },
    discountType: {
        type: String,
        enum: ['percentage', 'fixed'],
        default: 'percentage'
    },
    
    // Physical Properties
    sizeWeight: {
        type: Number,
        required: true,
        min: 0
    },
    sizeUnit: {
        type: String,
        enum: ['carat', 'gram', 'ounce', 'ratti'],
        default: 'carat'
    },
    
    // Inventory
    stock: {
        type: Number,
        default: 0,
        min: 0
    },
    availability: {
        type: Boolean,
        default: true
    },
    
    // Certification & Origin
    certification: {
        type: String,
        required: true
    },
    origin: {
        type: String,
        required: true
    },
    
    // Delivery
    deliveryDays: {
        type: Number,
        required: true,
        min: 1
    },
    
    // Images
    heroImage: {
        type: String,
        required: true
    },
    additionalImages: [{
        type: String
    }],
    
    // Seller Information
    seller: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    
    // Timestamps
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
};

/**
 * IMPORTANT BACKEND VALIDATION RULES:
 * 
 * 1. When contactForPrice is true:
 *    - price can be null/undefined
 *    - price should not be required in validation
 * 
 * 2. When contactForPrice is false:
 *    - price must be provided and > 0
 * 
 * 3. Update your API endpoints to handle:
 *    - GET /gems - should return contactForPrice field
 *    - GET /gems/:id - should return contactForPrice field
 *    - POST /gems - should accept contactForPrice field
 *    - PUT /gems/:id - should accept contactForPrice field
 * 
 * 4. Update filtering/search logic:
 *    - Gems with contactForPrice: true should still appear in search results
 *    - Price filters should exclude contactForPrice gems or handle them separately
 */

// Example validation middleware (if using Mongoose)
gemSchema.pre('validate', function(next) {
    if (this.contactForPrice && this.price !== null && this.price !== undefined) {
        // If contactForPrice is true, set price to null
        this.price = null;
    }
    if (!this.contactForPrice && (!this.price || this.price <= 0)) {
        // If contactForPrice is false, price is required
        return next(new Error('Price is required when contactForPrice is false'));
    }
    next();
});

// Example API Response Format
const exampleGemResponse = {
    _id: "507f1f77bcf86cd799439011",
    name: "Kashmir Blue Sapphire",
    category: "Kashmir Blue Sapphire",
    contactForPrice: true,  // NEW FIELD
    price: null,  // Can be null when contactForPrice is true
    sizeWeight: 5,
    sizeUnit: "carat",
    // ... other fields
};

module.exports = gemSchema;

