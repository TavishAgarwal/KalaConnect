const { GoogleGenerativeAI } = require('@google/generative-ai');
const vision = require('@google-cloud/vision');

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Initialize Vision API client
const visionClient = new vision.ImageAnnotatorClient({
    keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS
});

class GeminiAIService {
    constructor() {
        this.model = genAI.getGenerativeModel({ model: "gemini-pro" });
        this.visionModel = genAI.getGenerativeModel({ model: "gemini-pro-vision" });
    }

    // Generate product description from image
    async generateProductDescription(imageBuffer, productName, craftType) {
        try {
            const prompt = `
                You are an expert in Indian handicrafts and traditional arts. 
                Analyze this image of a ${craftType} craft item called "${productName}".
                
                Generate a compelling product description that includes:
                1. Detailed description of the visual elements and craftsmanship
                2. Cultural significance and heritage value
                3. Materials and techniques likely used
                4. Suggested use cases or occasions
                5. What makes this piece unique and special
                6. Target audience who would appreciate this craft
                
                Make the description engaging, informative, and suitable for e-commerce.
                Keep it between 150-250 words.
            `;

            const imagePart = {
                inlineData: {
                    data: imageBuffer.toString('base64'),
                    mimeType: 'image/jpeg'
                }
            };

            const result = await this.visionModel.generateContent([prompt, imagePart]);
            const response = await result.response;
            return response.text();
        } catch (error) {
            console.error('Error generating product description:', error);
            throw error;
        }
    }

    // Generate artisan story
    async generateArtisanStory(artisanData) {
        try {
            const prompt = `
                Create a compelling artisan story based on the following information:
                Name: ${artisanData.name}
                Craft: ${artisanData.craftType}
                Location: ${artisanData.location}
                Experience: ${artisanData.experience} years
                
                Generate a 100-150 word story that:
                1. Highlights their journey and passion for the craft
                2. Mentions the traditional techniques they preserve
                3. Describes their contribution to local culture
                4. Inspires customers to support their work
                
                Make it personal, authentic, and emotionally engaging.
            `;

            const result = await this.model.generateContent(prompt);
            const response = await result.response;
            return response.text();
        } catch (error) {
            console.error('Error generating artisan story:', error);
            throw error;
        }
    }

    // Extract tags and categories from image
    async extractImageTags(imageBuffer) {
        try {
            const [result] = await visionClient.labelDetection({
                image: {
                    content: imageBuffer
                }
            });
            
            const labels = result.labelAnnotations || [];
            const tags = labels.map(label => label.description.toLowerCase());
            
            // Also detect colors
            const [colorResult] = await visionClient.imageProperties({
                image: {
                    content: imageBuffer
                }
            });
            
            const colors = colorResult.imagePropertiesAnnotation?.dominantColors?.colors || [];
            const colorTags = colors.slice(0, 3).map(color => {
                const rgb = color.color;
                return this.rgbToColorName(rgb.red, rgb.green, rgb.blue);
            });
            
            return {
                tags: [...tags, ...colorTags],
                primaryCategory: this.determinCategory(tags)
            };
        } catch (error) {
            console.error('Error extracting image tags:', error);
            throw error;
        }
    }

    // Generate SEO-friendly content
    async generateSEOContent(product) {
        try {
            const prompt = `
                Generate SEO-optimized content for an Indian handicraft product:
                Product: ${product.name}
                Category: ${product.category}
                Description: ${product.description}
                
                Provide:
                1. Meta title (60 characters max)
                2. Meta description (160 characters max)
                3. 10 relevant keywords/tags
                4. 3 long-tail keywords
                
                Format as JSON.
            `;

            const result = await this.model.generateContent(prompt);
            const response = await result.response;
            return JSON.parse(response.text());
        } catch (error) {
            console.error('Error generating SEO content:', error);
            throw error;
        }
    }

    // Helper function to convert RGB to color name
    rgbToColorName(r, g, b) {
        const colors = {
            'red': [255, 0, 0],
            'blue': [0, 0, 255],
            'green': [0, 128, 0],
            'yellow': [255, 255, 0],
            'orange': [255, 165, 0],
            'purple': [128, 0, 128],
            'pink': [255, 192, 203],
            'brown': [165, 42, 42],
            'gold': [255, 215, 0],
            'silver': [192, 192, 192]
        };

        let minDistance = Infinity;
        let closestColor = 'multicolor';

        for (const [name, rgb] of Object.entries(colors)) {
            const distance = Math.sqrt(
                Math.pow(r - rgb[0], 2) +
                Math.pow(g - rgb[1], 2) +
                Math.pow(b - rgb[2], 2)
            );
            
            if (distance < minDistance) {
                minDistance = distance;
                closestColor = name;
            }
        }

        return closestColor;
    }

    // Determine category from tags
    determinCategory(tags) {
        const categories = {
            'textile': ['fabric', 'cloth', 'saree', 'silk', 'cotton', 'weaving', 'embroidery'],
            'pottery': ['clay', 'ceramic', 'pottery', 'earthenware', 'terracotta'],
            'jewelry': ['jewelry', 'necklace', 'ring', 'bracelet', 'earring', 'gold', 'silver'],
            'woodwork': ['wood', 'carving', 'furniture', 'wooden'],
            'metalwork': ['metal', 'brass', 'copper', 'bronze', 'iron'],
            'painting': ['painting', 'art', 'canvas', 'mural'],
            'leather': ['leather', 'bag', 'shoe', 'wallet']
        };

        for (const [category, keywords] of Object.entries(categories)) {
            if (tags.some(tag => keywords.some(keyword => tag.includes(keyword)))) {
                return category;
            }
        }

        return 'handicraft';
    }
}

module.exports = new GeminiAIService();
