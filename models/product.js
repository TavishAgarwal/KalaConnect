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

