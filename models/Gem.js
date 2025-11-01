const mongoose = require('mongoose');

const gemSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Gem name is required'],
        trim: true,
        maxlength: [255, 'Name cannot be more than 255 characters']
    },
    hindiName: {
        type: String,
        required: [true, 'Hindi name is required'],
        trim: true,
        maxlength: [255, 'Hindi name cannot be more than 255 characters']
    },
    planet: {
        type: String,
        required: [true, 'Planet is required'],
        trim: true,
        maxlength: [100, 'Planet name cannot be more than 100 characters']
    },
    planetHindi: {
        type: String,
        trim: true,
        maxlength: [100, 'Planet Hindi name cannot be more than 100 characters']
    },
    color: {
        type: String,
        required: [true, 'Color is required'],
        trim: true,
        maxlength: [100, 'Color cannot be more than 100 characters']
    },
    description: {
        type: String,
        required: [true, 'Description is required'],
        trim: true
    },
    benefits: {
        type: [String],
        required: [true, 'Benefits are required'],
        default: []
    },
    suitableFor: {
        type: [String],
        required: [true, 'Suitable for information is required'],
        default: []
    },
    category: {
        type: String,
        trim: true,
        maxlength: [100, 'Category cannot be more than 100 characters']
    },
    whomToUse: {
        type: [String],
        default: []
    },
    price: {
        type: Number,
        required: [true, 'Price is required'],
        min: [0, 'Price cannot be negative']
    },
    discount: {
        type: Number,
        default: 0,
        min: [0, 'Discount cannot be negative']
    },
    discountType: {
        type: String,
        enum: ['percentage', 'fixed'],
        default: 'percentage'
    },
    sizeWeight: {
        type: Number,
        required: [true, 'Size/Weight is required'],
        min: [0, 'Size/Weight cannot be negative']
    },
    sizeUnit: {
        type: String,
        required: [true, 'Size unit is required'],
        enum: ['carat', 'gram', 'ounce'],
        default: 'carat'
    },
    stock: {
        type: Number,
        default: 0,
        min: [0, 'Stock cannot be negative']
    },
    images: {
        type: [String],
        default: []
    },
    allImages: {
        type: [String],
        default: []
    },
    availability: {
        type: Boolean,
        default: true
    },
    certification: {
        type: String,
        required: [true, 'Certification is required'],
        trim: true,
        maxlength: [255, 'Certification cannot be more than 255 characters']
    },
    origin: {
        type: String,
        required: [true, 'Origin is required'],
        trim: true,
        maxlength: [255, 'Origin cannot be more than 255 characters']
    },
    deliveryDays: {
        type: Number,
        required: [true, 'Delivery days is required'],
        min: [1, 'Delivery days must be at least 1']
    },
    heroImage: {
        type: String,
        required: [true, 'Hero image is required'],
        trim: true
    },
    additionalImages: {
        type: [String],
        default: []
    },
    seller: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'Seller is required']
    },
    lowStockThreshold: {
        type: Number,
        default: 5
    },
    views: {
        type: Number,
        default: 0
    },
    sales: {
        type: Number,
        default: 0
    },
    rating: {
        type: Number,
        default: 0
    },
    reviews: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true
});

// Automatic availability update based on stock
gemSchema.pre('save', function (next) {
    if (this.stock === 0) {
        this.availability = false;
    } else if (this.stock > 0 && !this.availability) {
        this.availability = true;
    }
    next();
});

// Indexes for better search performance
// Text search index (for full-text search)
gemSchema.index({ name: 'text', description: 'text', hindiName: 'text', planet: 'text', color: 'text' });

// Single field indexes for filtering and sorting
gemSchema.index({ name: 1 }); // Case-insensitive search
gemSchema.index({ hindiName: 1 }); // Hindi name search
gemSchema.index({ planet: 1 }); // Planet filter
gemSchema.index({ color: 1 }); // Color filter
gemSchema.index({ price: 1 }); // Price sorting
gemSchema.index({ availability: 1 }); // Availability filter
gemSchema.index({ seller: 1 }); // Seller filter
gemSchema.index({ createdAt: -1 }); // Newest first sorting
gemSchema.index({ stock: 1 }); // Stock filter

// Compound indexes for common query patterns
gemSchema.index({ availability: 1, name: 1 }); // Available gems by name
gemSchema.index({ availability: 1, price: 1 }); // Available gems by price
gemSchema.index({ availability: 1, planet: 1 }); // Available gems by planet

module.exports = mongoose.model('Gem', gemSchema);