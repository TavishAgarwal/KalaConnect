const express = require('express');
const router = express.Router();
const Artisan = require('../models/artisan');
const Product = require('../models/product');
const geminiAI = require('../services/geminiAI');

// Get all artisans
router.get('/', async (req, res) => {
    try {
        const { city, craftType, verified } = req.query;
        const filter = {};

        if (city) filter['location.city'] = new RegExp(city, 'i');
        if (craftType) filter.craftType = new RegExp(craftType, 'i');
        if (verified !== undefined) filter.verified = verified === 'true';

        const artisans = await Artisan.find(filter)
            .populate('products')
            .sort({ rating: -1, createdAt: -1 });

        res.json({
            success: true,
            count: artisans.length,
            data: artisans
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// Get single artisan
router.get('/:id', async (req, res) => {
    try {
        const artisan = await Artisan.findById(req.params.id)
            .populate('products');

        if (!artisan) {
            return res.status(404).json({
                success: false,
                error: 'Artisan not found'
            });
        }

        res.json({
            success: true,
            data: artisan
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// Create new artisan
router.post('/', async (req, res) => {
    try {
        const artisanData = req.body;

        // Generate AI story for the artisan
        const story = await geminiAI.generateArtisanStory(artisanData);
        artisanData.story = story;

        const artisan = await Artisan.create(artisanData);

        res.status(201).json({
            success: true,
            data: artisan
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            error: error.message
        });
    }
});

// Update artisan
router.put('/:id', async (req, res) => {
    try {
        const artisan = await Artisan.findByIdAndUpdate(
            req.params.id,
            { ...req.body, updatedAt: Date.now() },
            { new: true, runValidators: true }
        );

        if (!artisan) {
            return res.status(404).json({
                success: false,
                error: 'Artisan not found'
            });
        }

        res.json({
            success: true,
            data: artisan
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            error: error.message
        });
    }
});

// Delete artisan
router.delete('/:id', async (req, res) => {
    try {
        const artisan = await Artisan.findById(req.params.id);

        if (!artisan) {
            return res.status(404).json({
                success: false,
                error: 'Artisan not found'
            });
        }

        // Delete all products associated with this artisan
        await Product.deleteMany({ artisan: req.params.id });

        await artisan.remove();

        res.json({
            success: true,
            data: {}
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// Get artisan's products
router.get('/:id/products', async (req, res) => {
    try {
        const products = await Product.find({ artisan: req.params.id })
            .sort({ createdAt: -1 });

        res.json({
            success: true,
            count: products.length,
            data: products
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

module.exports = router;
