const express = require('express');
const router = express.Router();

// Static data for places (can be moved to database later)
const placesData = {
    'jaipur': {
        name: 'Jaipur - The Pink City',
        coordinates: [26.9124, 75.7873],
        state: 'Rajasthan',
        famousFor: 'Pink-colored buildings, magnificent palaces, and vibrant bazaars',
        mustVisit: [
            'Amber Fort',
            'City Palace',
            'Hawa Mahal',
            'Jantar Mantar',
            'Nahargarh Fort'
        ],
        scamsToAvoid: [
            'Overpriced gemstone shops',
            'Fake government emporiums',
            'Inflated rickshaw fares',
            'Pickpockets in crowded markets'
        ],
        localHandicrafts: [
            'Blue Pottery',
            'Block Printing',
            'Kundan Jewelry',
            'Leather Crafts',
            'Bandhani Textiles'
        ],
        bestTimeToVisit: 'October to March',
        localCuisine: ['Dal Baati Churma', 'Laal Maas', 'Ghewar', 'Pyaaz Kachori']
    },
    // Add more cities...
};

// Get place information
router.get('/:city', async (req, res) => {
    try {
        const city = req.params.city.toLowerCase();
        const placeInfo = placesData[city];

        if (!placeInfo) {
            return res.status(404).json({
                success: false,
                error: 'Place information not found'
            });
        }

        res.json({
            success: true,
            data: placeInfo
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// Get all available places
router.get('/', async (req, res) => {
    try {
        const places = Object.keys(placesData).map(key => ({
            id: key,
            name: placesData[key].name,
            coordinates: placesData[key].coordinates
        }));

        res.json({
            success: true,
            data: places
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

module.exports = router;