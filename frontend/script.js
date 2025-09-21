
        // Initialize map
        let map;
        let currentMarker;

        function initMap() {
            map = L.map('map').setView([20.5937, 78.9629], 5); // Center on India
            
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '© OpenStreetMap contributors'
            }).addTo(map);
        }

        // City coordinates
        const cityCoordinates = {
            'jaipur': [26.9124, 75.7873],
            'varanasi': [25.3176, 82.9739],
            'mysore': [12.2958, 76.6394],
            'udaipur': [24.5854, 73.7125],
            'jodhpur': [26.2389, 73.0243],
            'agra': [27.1767, 78.0081],
            'chennai': [13.0827, 80.2707],
            'kolkata': [22.5726, 88.3639],
            'mumbai': [19.0760, 72.8777],
            'delhi': [28.6139, 77.2090]
        };

        // Place information database
        const placeInfo = {
            'jaipur': {
                name: 'Jaipur - The Pink City',
                famousFor: 'Jaipur is renowned for its distinctive pink-colored buildings, magnificent palaces, and vibrant bazaars. The city is a UNESCO World Heritage Site and forms part of the Golden Triangle tourist circuit.',
                mustVisit: [
                    'Amber Fort - Majestic hilltop fort with stunning architecture',
                    'City Palace - Royal residence with museums and courtyards',
                    'Hawa Mahal - Iconic "Palace of Winds" with 953 windows',
                    'Jantar Mantar - Ancient astronomical observatory',
                    'Nahargarh Fort - Offers panoramic views of the city'
                ],
                scamsToAvoid: [
                    'Overpriced gemstone shops - Research prices beforehand',
                    'Fake government emporiums - Verify authenticity',
                    'Inflated rickshaw fares - Always negotiate or use meters',
                    'Pickpockets in crowded markets - Keep valuables secure'
                ],
                localHandicrafts: [
                    'Blue Pottery - Traditional ceramic art with Persian influence',
                    'Block Printing - Hand-printed textiles with intricate patterns',
                    'Kundan Jewelry - Gemstone jewelry with gold foil',
                    'Leather Crafts - Mojari shoes and bags',
                    'Bandhani Textiles - Tie-dye fabrics with vibrant colors'
                ]
            },
            'varanasi': {
                name: 'Varanasi - The Spiritual Capital',
                famousFor: 'Varanasi is one of the oldest living cities in the world, famous for its ghats along the Ganges River, spiritual significance in Hinduism, and rich cultural heritage.',
                mustVisit: [
                    'Dashashwamedh Ghat - Main ghat with evening aarti ceremony',
                    'Kashi Vishwanath Temple - Sacred Shiva temple',
                    'Sarnath - Where Buddha gave his first sermon',
                    'Assi Ghat - Popular sunrise viewing spot',
                    'Ramnagar Fort - 18th-century fort and museum'
                ],
                scamsToAvoid: [
                    'Fake priests demanding donations - Politely decline',
                    'Overpriced boat rides - Negotiate beforehand',
                    'Misleading guides - Hire government-approved guides',
                    'Counterfeit silk - Buy from reputable stores'
                ],
                localHandicrafts: [
                    'Banarasi Silk Sarees - Luxurious handwoven silk with gold/silver threads',
                    'Wooden Toys - Traditional lacquered toys',
                    'Brass Items - Religious idols and decorative pieces',
                    'Glass Beads - Intricate beadwork jewelry',
                    'Musical Instruments - Tabla, sitar, and harmonium'
                ]
            },
            'mysore': {
                name: 'Mysore - City of Palaces',
                famousFor: 'Mysore is famous for its royal heritage, magnificent Mysore Palace, Dasara celebrations, and being a center for yoga, sandalwood, and silk.',
                mustVisit: [
                    'Mysore Palace - Opulent Indo-Saracenic palace',
                    'Chamundi Hills - Temple with city views',
                    'Brindavan Gardens - Musical fountain show',
                    'St. Philomena\'s Cathedral - Neo-Gothic architecture',
                    'Mysore Zoo - One of India\'s oldest zoos'
                ],
                scamsToAvoid: [
                    'Fake sandalwood products - Check government marks',
                    'Overpriced palace guides - Use audio guides instead',
                    'Duplicate silk sarees - Visit government emporiums',
                    'Inflated auto-rickshaw fares - Use app-based cabs'
                ],
                localHandicrafts: [
                    'Mysore Silk Sarees - Pure silk with gold zari work',
                    'Sandalwood Carvings - Intricate sculptures and artifacts',
                    'Rosewood Inlay Work - Decorative furniture and items',
                    'Mysore Paintings - Traditional gesso work with gold leaf',
                    'Channapatna Toys - Colorful wooden toys'
                ]
            }
        };

        // Sample artisan data
        const artisansData = {
            'jaipur': [
                {
                    name: 'Rajesh Kumar',
                    craft: 'Blue Pottery Master',
                    description: 'Third-generation potter specializing in traditional Jaipur blue pottery with modern designs.',
                    price: '₹500 - ₹5,000',
                    image: 'https://via.placeholder.com/300x200/4A90E2/FFFFFF?text=Blue+Pottery'
                },
                {
                    name: 'Meera Devi',
                    craft: 'Block Printing Artist',
                    description: 'Expert in traditional Bagru and Sanganer block printing techniques on organic fabrics.',
                    price: '₹800 - ₹3,000',
                    image: 'https://via.placeholder.com/300x200/E74C3C/FFFFFF?text=Block+Printing'
                },
                {
                    name: 'Abdul Rahman',
                    craft: 'Kundan Jewelry Maker',
                    description: 'Creating exquisite Kundan and Meenakari jewelry using age-old techniques.',
                    price: '₹2,000 - ₹50,000',
                    image: 'https://via.placeholder.com/300x200/F39C12/FFFFFF?text=Kundan+Jewelry'
                }
            ],
            'varanasi': [
                {
                    name: 'Shyam Lal',
                    craft: 'Banarasi Weaver',
                    description: 'Master weaver creating authentic Banarasi silk sarees with intricate zari work.',
                    price: '₹5,000 - ₹100,000',
                    image: 'https://via.placeholder.com/300x200/9B59B6/FFFFFF?text=Banarasi+Silk'
                },
                {
                    name: 'Ramesh Pandey',
                    craft: 'Brass Artisan',
                    description: 'Specializing in traditional brass idols and decorative items for temples and homes.',
                    price: '₹300 - ₹10,000',
                    image: 'https://via.placeholder.com/300x200/D4AC0D/FFFFFF?text=Brass+Work'
                }
            ],
            'mysore': [
                {
                    name: 'Lakshmi Amma',
                    craft: 'Mysore Silk Weaver',
                    description: 'Expert in weaving pure Mysore silk sarees with traditional motifs and borders.',
                    price: '₹3,000 - ₹25,000',
                    image: 'https://via.placeholder.com/300x200/E91E63/FFFFFF?text=Mysore+Silk'
                },
                {
                    name: 'Venkatesh',
                    craft: 'Sandalwood Carver',
                    description: 'Creating intricate sandalwood sculptures and decorative pieces.',
                    price: '₹1,000 - ₹20,000',
                    image: 'https://via.placeholder.com/300x200/8D6E63/FFFFFF?text=Sandalwood+Art'
                }
            ]
        };

        // Search functionality
        function searchPlace() {
            const searchInput = document.getElementById('searchInput');
            const placeName = searchInput.value.toLowerCase().trim();
            
            if (!placeName) {
                alert('Please enter a city name');
                return;
            }

            // Show place info
            const placeInfoDiv = document.getElementById('placeInfo');
            const info = placeInfo[placeName];
            
            if (info) {
                document.getElementById('placeName').textContent = info.name;
                document.getElementById('famousFor').textContent = info.famousFor;
                
                // Update lists
                updateList('mustVisit', info.mustVisit);
                updateList('scamsToAvoid', info.scamsToAvoid);
                updateList('localHandicrafts', info.localHandicrafts);
                
                placeInfoDiv.classList.add('active');
                
                // Update map
                if (cityCoordinates[placeName]) {
                    const coords = cityCoordinates[placeName];
                    map.flyTo(coords, 12, {
                        duration: 2
                    });
                    
                    // Add marker
                    if (currentMarker) {
                        map.removeLayer(currentMarker);
                    }
                    currentMarker = L.marker(coords).addTo(map)
                        .bindPopup(`<strong>${info.name}</strong>`)
                        .openPopup();
                    
                    // Increase map opacity
                    document.getElementById('mapBackground').classList.add('focused');
                }
            } else {
                alert('City information not available. Try Jaipur, Varanasi, or Mysore.');
            }
        }

        function updateList(elementId, items) {
            const element = document.getElementById(elementId);
            element.innerHTML = items.map(item => `<li>${item}</li>`).join('');
        }

        // Show artisans
        function showArtisans() {
            const searchInput = document.getElementById('searchInput');
            const placeName = searchInput.value.toLowerCase().trim();
            const artisanSection = document.getElementById('artisanSection');
            const artisanGrid = document.getElementById('artisanGrid');
            
            const artisans = artisansData[placeName] || [];
            
            artisanGrid.innerHTML = artisans.map(artisan => `
                <div class="artisan-card">
                    <img src="${artisan.image}" alt="${artisan.craft}" class="artisan-image">
                    <div class="artisan-info">
                        <h3 class="artisan-name">${artisan.name}</h3>
                        <p class="craft-type">${artisan.craft}</p>
                        <p class="artisan-description">${artisan.description}</p>
                        <p class="price">${artisan.price}</p>
                    </div>
                </div>
            `).join('');
            
            artisanSection.classList.add('active');
            artisanSection.scrollIntoView({ behavior: 'smooth' });
        }

        // Modal functions
        function openUploadModal() {
            document.getElementById('uploadModal').classList.add('active');
        }

        function closeUploadModal() {
            document.getElementById('uploadModal').classList.remove('active');
        }

        function handleUpload(event) {
            event.preventDefault();
            
            const artisanName = document.getElementById('artisanName').value;
            const craftName = document.getElementById('craftName').value;
            const location = document.getElementById('location').value;
            const imageFile = document.getElementById('craftImage').files[0];
            
            // Here you would normally upload to server
            alert(`Thank you ${artisanName}! Your ${craftName} will be listed after AI processing.`);
            closeUploadModal();
            
            // Reset form
            event.target.reset();
        }

        // Initialize map on load
        window.addEventListener('DOMContentLoaded', initMap);

        // Allow Enter key to search
        document.getElementById('searchInput').addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                searchPlace();
            }
        });