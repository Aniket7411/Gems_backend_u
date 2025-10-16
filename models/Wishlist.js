const mongoose = require('mongoose');

const wishlistSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    gems: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Gem'
    }]
}, {
    timestamps: true
});

// Compound index to ensure one wishlist per user
wishlistSchema.index({ user: 1 }, { unique: true });

module.exports = mongoose.model('Wishlist', wishlistSchema);
