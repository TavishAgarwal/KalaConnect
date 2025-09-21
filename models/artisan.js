const mongoose = require('mongoose');

const artisanSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: false
    },
    phone: {
        type: String,
        required: false
    },
    location: {
        city: {
            type: String,
            required: true
        },
        state: String,
        coordinates: {
            lat: Number,
            lng: Number
        }
    },
    craftType: {
        type: String,
        required: true
    },
    experience: {
        type: Number,
        default: 0
    },
    story: {
        type: String
    },
    verified: {
        type: Boolean,
        default: false
    },
    rating: {
        type: Number,
        default: 0,
        min: 0,
        max: 5
    },
    products: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product'
    }],
    socialMedia: {
        instagram: String,
        facebook: String,
        website: String
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Artisan', artisanSchema);

// === models/product.js ===
