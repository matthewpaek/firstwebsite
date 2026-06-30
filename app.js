// Fetch weather data
async function getWeather() {
  try {
    // Get user's location with timeout test
    navigator.geolocation.getCurrentPosition(async (position) => {
      const lat = position.coords.latitude;
      const lon = position.coords.longitude;
      
      try {
        // Fetch weather data from Open-Meteo (free, no API key needed)
        const weatherResponse = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&temperature_unit=fahrenheit`
        );
        const weatherData = await weatherResponse.json();
        
        // Update weather display
        const temp = Math.round(weatherData.current_weather.temperature);
        const weatherCode = weatherData.current_weather.weathercode;
        
        document.getElementById('weather-temp').textContent = `${temp}°F`;
        document.getElementById('weather-icon').textContent = getWeatherIcon(weatherCode);
        
        // Fetch location in background (don't block weather display)
        fetchLocation(lat, lon);
      } catch (error) {
        console.error('Weather fetch error:', error);
        document.getElementById('weather-location').textContent = 'Weather unavailable';
        document.getElementById('weather-temp').textContent = '';
      }
    }, (error) => {
      // If location access denied, show default message
      document.getElementById('weather-location').textContent = 'Enable location to see your weather.';
      document.getElementById('weather-temp').textContent = '';
    }, {
      timeout: 10000, // 10 second timeout
      enableHighAccuracy: false
    });
  } catch (error) {
    console.error('Geolocation error:', error);
    document.getElementById('weather-location').textContent = 'Weather unavailable';
  }
}

// Fetch location name separately (async)
async function fetchLocation(lat, lon) {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`
    );
    const data = await response.json();
    
    const city = data.address?.city || data.address?.town || data.address?.village || 'Your Location';
    document.getElementById('weather-location').textContent = city;
  } catch (error) {
    console.error('Location fetch error:', error);
    document.getElementById('weather-location').textContent = 'Current Weather';
  }
}

// Map weather codes to emoji icons
function getWeatherIcon(code) {
  const icons = {
    0: '☀️',     // Clear
    1: '🌤️',    // Mainly clear
    2: '⛅',    // Partly cloudy
    3: '☁️',     // Overcast
    45: '🌫️',   // Fog
    48: '🌫️',   // Fog
    51: '🌦️',   // Drizzle
    61: '🌧️',   // Rain
    63: '🌧️',   // Rain
    65: '🌧️',   // Rain
    71: '🌨️',   // Snow
    73: '🌨️',   // Snow
    75: '🌨️',   // Snow
    95: '⛈️',   // Thunderstorm
  };
  return icons[code] || '🌤️';
}

// Load weather on page load
getWeather();

// Dark Mode Toggle
const darkModeToggle = document.getElementById('darkModeToggle');
const toggleIcon = document.querySelector('.toggle-icon');

// Check for saved dark mode preference or default to light mode
const isDarkMode = localStorage.getItem('darkMode') === 'true';
if (isDarkMode) {
  document.body.classList.add('dark-mode');
  updateToggleIcon();
}

// Toggle dark mode on button click
darkModeToggle.addEventListener('click', () => {
  document.body.classList.toggle('dark-mode');
  const isDark = document.body.classList.contains('dark-mode');
  localStorage.setItem('darkMode', isDark);
  updateToggleIcon();
});

// Update toggle icon based on mode
function updateToggleIcon() {
  const isDark = document.body.classList.contains('dark-mode');
  toggleIcon.textContent = isDark ? '☀️' : '🌙';
}

// ============================================================================
// DARK MODE FUNCTIONALITY
// ============================================================================

/**
 * Initialize dark mode on page load
 * Checks localStorage for saved preference
 */
function initializeDarkMode() {
  const isDarkMode = localStorage.getItem('darkMode') === 'true';
  if (isDarkMode) {
    document.body.classList.add('dark-mode');
  }
  updateToggleIcon();
}

/**
 * Update toggle icon based on current mode
 * Shows moon in light mode, sun in dark mode
 */
function updateToggleIcon() {
  const isDark = document.body.classList.contains('dark-mode');
  toggleIcon.textContent = isDark ? '☀️' : '🌙';
}

/**
 * Toggle dark mode and save preference
 */
darkModeToggle.addEventListener('click', () => {
  document.body.classList.toggle('dark-mode');
  const isDark = document.body.classList.contains('dark-mode');
  localStorage.setItem('darkMode', isDark);
  updateToggleIcon();
});

// ============================================================================
// WEATHER FUNCTIONALITY
// ============================================================================

/**
 * Fetch user's current weather data
 * Uses Open-Meteo API (free, no API key needed)
 */
async function getWeather() {
  try {
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        await fetchWeatherData(position.coords.latitude, position.coords.longitude);
      },
      (error) => {
        handleLocationError();
      },
      {
        timeout: 10000,
        enableHighAccuracy: false
      }
    );
  } catch (error) {
    console.error('Geolocation error:', error);
    handleWeatherError('Weather unavailable');
  }
}

/**
 * Fetch weather data from Open-Meteo API
 * @param {number} lat - Latitude coordinate
 * @param {number} lon - Longitude coordinate
 */
async function fetchWeatherData(lat, lon) {
  try {
    const weatherResponse = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&temperature_unit=fahrenheit`
    );
    const weatherData = await weatherResponse.json();

    const temp = Math.round(weatherData.current_weather.temperature);
    const weatherCode = weatherData.current_weather.weathercode;

    displayWeather(temp, weatherCode);
    fetchLocation(lat, lon);
  } catch (error) {
    console.error('Weather fetch error:', error);
    handleWeatherError('Weather unavailable');
  }
}

/**
 * Display weather information on page
 * @param {number} temp - Temperature in Fahrenheit
 * @param {number} code - Weather code for icon mapping
 */
function displayWeather(temp, code) {
  const weatherTempElement = document.getElementById('weather-temp');
  const weatherIconElement = document.getElementById('weather-icon');

  if (weatherTempElement) weatherTempElement.textContent = `${temp}°F`;
  if (weatherIconElement) weatherIconElement.textContent = getWeatherIcon(code);
}

/**
 * Fetch location name from coordinates
 * Uses Nominatim OpenStreetMap API
 * @param {number} lat - Latitude coordinate
 * @param {number} lon - Longitude coordinate
 */
async function fetchLocation(lat, lon) {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`
    );
    const data = await response.json();

    const city = data.address?.city || 
                 data.address?.town || 
                 data.address?.village || 
                 'Your Location';

    const locationElement = document.getElementById('weather-location');
    if (locationElement) locationElement.textContent = city;
  } catch (error) {
    console.error('Location fetch error:', error);
    const locationElement = document.getElementById('weather-location');
    if (locationElement) locationElement.textContent = 'Current Weather';
  }
}

/**
 * Map weather codes to emoji icons
 * @param {number} code - Weather code from API
 * @returns {string} Weather emoji icon
 */
function getWeatherIcon(code) {
  const weatherIcons = {
    0: '☀️',     // Clear
    1: '🌤️',    // Mainly clear
    2: '⛅',    // Partly cloudy
    3: '☁️',     // Overcast
    45: '🌫️',   // Fog
    48: '🌫️',   // Fog
    51: '🌦️',   // Drizzle
    61: '🌧️',   // Rain
    63: '🌧️',   // Rain
    65: '🌧️',   // Rain
    71: '🌨️',   // Snow
    73: '🌨️',   // Snow
    75: '🌨️',   // Snow
    95: '⛈️',   // Thunderstorm
  };
  return weatherIcons[code] || '🌤️';
}

/**
 * Handle location permission denied
 */
function handleLocationError() {
  const locationElement = document.getElementById('weather-location');
  const tempElement = document.getElementById('weather-temp');

  if (locationElement) locationElement.textContent = 'Enable location to see your weather.';
  if (tempElement) tempElement.textContent = '';
}

/**
 * Handle weather API errors
 * @param {string} message - Error message to display
 */
function handleWeatherError(message) {
  const locationElement = document.getElementById('weather-location');
  const tempElement = document.getElementById('weather-temp');

  if (locationElement) locationElement.textContent = message;
  if (tempElement) tempElement.textContent = '';
}

// ============================================================================
// INITIALIZATION
// ============================================================================

/**
 * Initialize all features on page load
 */
function initializeApp() {
  initializeDarkMode();
  getWeather();
}

// Run initialization when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeApp);
} else {
  initializeApp();
}

// Theme toggle button
const toggleButton = document.getElementById('theme-toggle');
const icon = toggleButton?.querySelector('.theme-toggle__icon');
const label = toggleButton?.querySelector('.theme-toggle__label');

const setTheme = (theme) => {
  document.body.classList.toggle('dark', theme === 'dark');
  const isDark = document.body.classList.contains('dark');

  if (toggleButton) {
    toggleButton.setAttribute('aria-pressed', String(isDark));
  }

  if (icon) {
    icon.textContent = isDark ? '☀️' : '🌙';
  }

  if (label) {
    label.textContent = isDark ? 'Light mode' : 'Dark mode';
  }

  localStorage.setItem('theme', theme);
};

const storedTheme = localStorage.getItem('theme');
const preferredTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
setTheme(storedTheme || preferredTheme);

toggleButton?.addEventListener('click', () => {
  const nextTheme = document.body.classList.contains('dark') ? 'light' : 'dark';
  setTheme(nextTheme);
});