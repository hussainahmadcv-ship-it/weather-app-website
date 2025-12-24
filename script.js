 
        /**
         * WEATHER APP LOGIC
         * Using OpenWeatherMap API
         */
        
        // Configuration
        const API_KEY = API_CONFIG.KEY; // Note: In production, never expose keys. Use a proxy/backend.
        const BASE_URL = 'https://api.openweathermap.org/data/2.5/weather';

        // DOM Elements
        const searchForm = document.getElementById('search-form');
        const cityInput = document.getElementById('city-input');
        const weatherContent = document.getElementById('weather-content');
        const loader = document.getElementById('loader');
        const errorDiv = document.getElementById('error');
        const placeholder = document.getElementById('placeholder');

        // Logic for handling the search
        searchForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const city = cityInput.value.trim();
            
            if (city) {
                fetchWeather(city);
            }
        });

        // Core Fetch Function
        async function fetchWeather(city) {
            // Reset UI states
            showLoading(true);
            hideError();
            weatherContent.classList.add('hidden');
            placeholder.classList.add('hidden');

            try {
                // Fetching data with metric units for Celsius
                const response = await fetch(`${BASE_URL}?q=${city}&appid=${API_KEY}&units=metric`);
                
                if (!response.ok) {
                    throw new Error(response.status === 404 ? 'City not found' : 'Network error occurred');
                }

                const data = await response.json();
                updateUI(data);
                
            } catch (err) {
                showError(err.message);
            } finally {
                showLoading(false);
            }
        }

        // Update the DOM with fetched data
        function updateUI(data) {
            document.getElementById('city-name').textContent = `${data.name}, ${data.sys.country}`;
            document.getElementById('temp-value').textContent = Math.round(data.main.temp);
            document.getElementById('weather-desc').textContent = data.weather[0].description;
            document.getElementById('humidity-value').textContent = `${data.main.humidity}%`;
            document.getElementById('wind-value').textContent = `${data.wind.speed} m/s`;

            weatherContent.classList.remove('hidden');
        }

        // UI Helper Functions
        function showLoading(state) {
            state ? loader.classList.remove('hidden') : loader.classList.add('hidden');
        }

        function showError(msg) {
            errorDiv.textContent = msg;
            errorDiv.classList.remove('hidden');
        }

        function hideError() {
            errorDiv.classList.add('hidden');
        }
    