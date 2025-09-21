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
const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    aiGeneratedDescription: {
        type: String
    },
    artisan: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Artisan',
        required: true
    },
    category: {
        type: String,
        required: true
    },
    images: [{
        url: String,
        cloudinaryId: String,
        isMain: {
            type: Boolean,
            default: false
        }
    }],
    price: {
        amount: {
            type: Number,
            required: true
        },
        currency: {
            type: String,
            default: 'INR'
        }
    },
    priceRange: {
        min: Number,
        max: Number
    },
    materials: [String],
    dimensions: {
        length: Number,
        width: Number,
        height: Number,
        unit: {
            type: String,
            default: 'cm'
        }
    },
    weight: {
        value: Number,
        unit: {
            type: String,
            default: 'kg'
        }
    },
    availability: {
        type: String,
        enum: ['in-stock', 'out-of-stock', 'made-to-order'],
        default: 'in-stock'
    },
    productionTime: {
        type: Number, // in days
        default: 0
    },
    tags: [String],
    culturalSignificance: String,
    careInstructions: String,
    views: {
        type: Number,
        default: 0
    },
    likes: {
        type: Number,
        default: 0
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

// Add text search index
productSchema.index({ 
    name: 'text', 
    description: 'text', 
    aiGeneratedDescription: 'text',
    tags: 'text' 
});

module.exports = mongoose.model('Product', productSchema);

