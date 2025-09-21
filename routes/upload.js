const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');
const cloudStorage = require('../services/cloudStorage');
const geminiAI = require('../services/geminiAI');
const Product = require('../models/product');
const Artisan = require('../models/artisan');

// Upload product image and generate AI description
router.post('/product', upload.single('image'), async (req, res) => {
    try {
        const { artisanId, productName, craftType } = req.body;
        
        if (!req.file) {
            return res.status(400).json({
                success: false,
                error: 'Please upload an image'
            });
        }

        // Upload to Google Cloud Storage
        const uploadResult = await cloudStorage.uploadFile(req.file, 'products');

        // Generate AI description
        const aiDescription = await geminiAI.generateProductDescription(
            req.file.buffer,
            productName,
            craftType
        );

        // Extract tags from image
        const { tags, primaryCategory } = await geminiAI.extractImageTags(req.file.buffer);

        // Create product
        const product = await Product.create({
            name: productName,
            description: req.body.description || 'Handcrafted with love',
            aiGeneratedDescription: aiDescription,
            artisan: artisanId,
            category: primaryCategory,
            images: [{
                url: uploadResult.url,
                cloudinaryId: uploadResult.fileName,
                isMain: true
            }],
            price: {
                amount: req.body.price || 0
            },
            tags: tags,
            craftType: craftType
        });

        // Add product to artisan's products array
        await Artisan.findByIdAndUpdate(
            artisanId,
            { $push: { products: product._id } }
        );

        // Generate SEO content
        const seoContent = await geminiAI.generateSEOContent(product);

        res.status(201).json({
            success: true,
            data: {
                product,
                seoContent
            }
        });
    } catch (error) {
        console.error('Upload error:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// Upload multiple images for a product
router.post('/product/:productId/images', upload.array('images', 5), async (req, res) => {
    try {
        const { productId } = req.params;
        
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({
                success: false,
                error: 'Product not found'
            });
        }

        const uploadPromises = req.files.map(file => 
            cloudStorage.uploadFile(file, 'products')
        );

        const uploadResults = await Promise.all(uploadPromises);

        const newImages = uploadResults.map(result => ({
            url: result.url,
            cloudinaryId: result.fileName,
            isMain: false
        }));

        product.images.push(...newImages);
        await product.save();

        res.json({
            success: true,
            data: product
        });
    } catch (error) {
        console.error('Multiple upload error:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

module.exports = router;
