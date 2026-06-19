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
      document.getElementById('weather-temperature').textContent = '';
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