// Fetch weather data
async function getWeather() {
  try {
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        await fetchWeatherData(position.coords.latitude, position.coords.longitude);
      },
      () => {
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

function displayWeather(temp, code) {
  const weatherTempElement = document.getElementById('weather-temp');
  const weatherIconElement = document.getElementById('weather-icon');

  if (weatherTempElement) weatherTempElement.textContent = `${temp}°F`;
  if (weatherIconElement) weatherIconElement.textContent = getWeatherIcon(code);
}

async function fetchLocation(lat, lon) {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`
    );
    const data = await response.json();

    const city =
      data.address?.city ||
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

function getWeatherIcon(code) {
  const weatherIcons = {
    0: '☀️',
    1: '🌤️',
    2: '⛅',
    3: '☁️',
    45: '🌫️',
    48: '🌫️',
    51: '🌦️',
    61: '🌧️',
    63: '🌧️',
    65: '🌧️',
    71: '🌨️',
    73: '🌨️',
    75: '🌨️',
    95: '⛈️'
  };

  return weatherIcons[code] || '🌤️';
}

function handleLocationError() {
  const locationElement = document.getElementById('weather-location');
  const tempElement = document.getElementById('weather-temp');

  if (locationElement) locationElement.textContent = 'Enable location to see your weather.';
  if (tempElement) tempElement.textContent = '';
}

function handleWeatherError(message) {
  const locationElement = document.getElementById('weather-location');
  const tempElement = document.getElementById('weather-temp');

  if (locationElement) locationElement.textContent = message;
  if (tempElement) tempElement.textContent = '';
}

// Theme handling
const themeToggle = document.getElementById('theme-toggle');
const themeIcon = themeToggle?.querySelector('.theme-toggle__icon');
const themeLabel = themeToggle?.querySelector('.theme-toggle__label');

function applyTheme(theme) {
  const isDark = theme === 'dark';

  document.body.classList.toggle('dark', isDark);
  document.documentElement.style.colorScheme = isDark ? 'dark' : 'light';

  if (themeToggle) {
    themeToggle.setAttribute('aria-pressed', String(isDark));
  }

  if (themeIcon) {
    themeIcon.textContent = isDark ? '☀️' : '🌙';
  }

  if (themeLabel) {
    themeLabel.textContent = isDark ? 'Light mode' : 'Dark mode';
  }

  localStorage.setItem('theme', theme);
}

function initializeTheme() {
  const storedTheme = localStorage.getItem('theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const initialTheme = storedTheme || (prefersDark ? 'dark' : 'light');
  applyTheme(initialTheme);
}

function initializeApp() {
  initializeTheme();
  getWeather();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeApp);
} else {
  initializeApp();
}

themeToggle?.addEventListener('click', () => {
  const isDark = document.body.classList.contains('dark');
  applyTheme(isDark ? 'light' : 'dark');
});