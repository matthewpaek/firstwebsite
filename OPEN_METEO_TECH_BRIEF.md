# Open-Meteo Weather API - Technical Brief

## Overview

Open-Meteo is a free, open-source weather API that provides accurate weather data without requiring an API key. It's ideal for small to medium-sized web projects.

## Why Open-Meteo?

### Advantages
- ✅ **Completely free** - No API key required, no rate limits for reasonable usage
- ✅ **No registration** - Start using immediately
- ✅ **Open-source** - Transparent and community-driven
- ✅ **Fast & reliable** - Good uptime and response times
- ✅ **Global coverage** - Weather data for anywhere in the world
- ✅ **CORS-enabled** - Works directly from browser JavaScript
- ✅ **Privacy-focused** - No tracking or data collection

### Limitations
- Not suitable for commercial high-traffic applications
- Limited historical data compared to paid services
- Basic feature set (but covers most common use cases)

## Technical Specifications

### Base Endpoint
```
https://api.open-meteo.com/v1/forecast
```

### Key Parameters

| Parameter | Type | Description | Example |
|-----------|------|-------------|---------|
| `latitude` | float | Latitude coordinate | `47.6062` |
| `longitude` | float | Longitude coordinate | `-122.3321` |
| `current_weather` | boolean | Include current weather | `true` |
| `temperature_unit` | string | `fahrenheit` or `celsius` | `fahrenheit` |
| `windspeed_unit` | string | `mph`, `kmh`, `ms`, `kn` | `mph` |
| `timezone` | string | Timezone for dates | `America/New_York` |

### Response Format

**Example Request:**
```
https://api.open-meteo.com/v1/forecast?latitude=47.6062&longitude=-122.3321&current_weather=true&temperature_unit=fahrenheit
```

**Example Response:**
```json
{
  "latitude": 47.6,
  "longitude": -122.34,
  "current_weather": {
    "temperature": 52.5,
    "windspeed": 8.2,
    "winddirection": 245,
    "weathercode": 1,
    "time": "2026-03-05T12:00"
  }
}
```

### Weather Codes

| Code | Condition |
|------|-----------|
| 0 | Clear sky |
| 1, 2, 3 | Mainly clear, partly cloudy, overcast |
| 45, 48 | Fog |
| 51, 53, 55 | Drizzle (light, moderate, dense) |
| 61, 63, 65 | Rain (slight, moderate, heavy) |
| 71, 73, 75 | Snow fall (slight, moderate, heavy) |
| 95 | Thunderstorm |
| 96, 99 | Thunderstorm with hail |

## Step-by-Step Implementation Plan

### Phase 1: Basic Setup
**Goal:** Display current temperature

1. **Get user's location**
   - Use browser's `navigator.geolocation.getCurrentPosition()`
   - Handle permission denied scenario
   - Set timeout (10 seconds recommended)

2. **Fetch weather data**
   - Make GET request to Open-Meteo API with lat/lon
   - Parse JSON response
   - Extract temperature from `current_weather.temperature`

3. **Display temperature**
   - Update DOM element with temperature value
   - Add unit symbol (°F or °C)

**Estimated Time:** 30 minutes

### Phase 2: Enhanced Weather Display
**Goal:** Show weather icon and conditions

1. **Map weather codes to icons**
   - Create mapping object for weathercode → emoji/icon
   - Handle all common weather codes (clear, cloudy, rain, snow, etc.)
   
2. **Update UI**
   - Display weather icon
   - Show descriptive text (optional)

**Estimated Time:** 20 minutes

### Phase 3: Location Name
**Goal:** Display city/location name

1. **Implement reverse geocoding**
   - Use OpenStreetMap Nominatim API (free)
   - Endpoint: `https://nominatim.openstreetmap.org/reverse`
   - Extract city/town from response

2. **Optimize loading**
   - Fetch location name asynchronously (don't block weather display)
   - Show "Loading..." initially, update when ready
   - Fallback to "Your Location" if fetch fails

**Estimated Time:** 30 minutes

### Phase 4: Error Handling & Polish
**Goal:** Production-ready implementation

1. **Error handling**
   - Network request failures
   - Geolocation errors
   - Invalid API responses
   - Display user-friendly error messages

2. **Loading states**
   - Show loading indicator
   - Handle slow network conditions
   - Implement timeouts

3. **Styling**
   - Design weather widget UI
   - Responsive design for mobile
   - Accessibility considerations

**Estimated Time:** 1 hour

### Phase 5: Advanced Features (Optional)
**Goal:** Enhanced functionality

1. **Extended forecast**
   - Add `daily=temperature_2m_max,temperature_2m_min` parameter
   - Display 7-day forecast

2. **Additional metrics**
   - Wind speed and direction
   - Humidity
   - Precipitation probability

3. **User preferences**
   - Toggle between Fahrenheit/Celsius
   - Save location preference
   - Manual location search

**Estimated Time:** 2-3 hours

## Code Implementation

### Minimal Example (Phase 1)
```javascript
async function getWeather() {
  navigator.geolocation.getCurrentPosition(async (position) => {
    const lat = position.coords.latitude;
    const lon = position.coords.longitude;
    
    const response = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&temperature_unit=fahrenheit`
    );
    const data = await response.json();
    
    const temp = Math.round(data.current_weather.temperature);
    document.getElementById('temperature').textContent = `${temp}°F`;
  });
}
```

### Production Example (Phases 1-4)
```javascript
async function getWeather() {
  try {
    navigator.geolocation.getCurrentPosition(async (position) => {
      const lat = position.coords.latitude;
      const lon = position.coords.longitude;
      
      try {
        // Fetch weather
        const weatherResponse = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&temperature_unit=fahrenheit`
        );
        const weatherData = await weatherResponse.json();
        
        // Update display
        const temp = Math.round(weatherData.current_weather.temperature);
        const code = weatherData.current_weather.weathercode;
        
        document.getElementById('temp').textContent = `${temp}°F`;
        document.getElementById('icon').textContent = getWeatherIcon(code);
        
        // Fetch location (async)
        fetchLocation(lat, lon);
      } catch (error) {
        console.error('Weather error:', error);
        showError('Weather unavailable');
      }
    }, (error) => {
      showError('Enable location for weather');
    }, {
      timeout: 10000,
      enableHighAccuracy: false
    });
  } catch (error) {
    showError('Weather unavailable');
  }
}

function getWeatherIcon(code) {
  const icons = {
    0: '☀️', 1: '🌤️', 2: '⛅', 3: '☁️',
    45: '🌫️', 48: '🌫️',
    51: '🌦️', 61: '🌧️', 63: '🌧️', 65: '🌧️',
    71: '🌨️', 73: '🌨️', 75: '🌨️',
    95: '⛈️'
  };
  return icons[code] || '🌤️';
}

async function fetchLocation(lat, lon) {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`
    );
    const data = await response.json();
    const city = data.address?.city || data.address?.town || 'Your Location';
    document.getElementById('location').textContent = city;
  } catch (error) {
    document.getElementById('location').textContent = 'Current Weather';
  }
}

function showError(message) {
  document.getElementById('location').textContent = message;
  document.getElementById('temp').textContent = '';
}
```

## Best Practices

1. **Rate Limiting**
   - Implement caching (localStorage) to avoid repeated requests
   - Cache weather data for 10-15 minutes
   - Don't fetch on every page load

2. **User Experience**
   - Always show loading state
   - Fail gracefully with clear error messages
   - Provide fallback for denied location access

3. **Performance**
   - Load weather data asynchronously (don't block page render)
   - Keep API requests minimal
   - Use fetch with timeout

4. **Privacy**
   - Don't store user coordinates
   - Explain why location access is needed
   - Respect user's denial of location

## Testing Checklist

- [ ] Weather displays correctly with location enabled
- [ ] Error handling works when location is denied
- [ ] Handles network failures gracefully
- [ ] Works on mobile devices
- [ ] Loading states are clear
- [ ] Temperature unit is correct
- [ ] Weather icons match conditions
- [ ] Location name displays (if implemented)
- [ ] Works across different browsers
- [ ] Responsive design on all screen sizes

## Resources

- **Open-Meteo Documentation:** https://open-meteo.com/en/docs
- **API Playground:** https://open-meteo.com/en/docs#api-documentation
- **Weather Code Reference:** https://open-meteo.com/en/docs#weathercode
- **Nominatim (Geocoding):** https://nominatim.org/release-docs/latest/api/Reverse/

## Deployment Notes

### Vercel
- No environment variables needed (no API key)
- Works out of the box
- HTTPS enabled by default (required for geolocation)

### Security
- No API keys to secure
- All requests from client-side (acceptable for public data)
- HTTPS required for geolocation API

## Total Estimated Implementation Time

- **Basic (Phases 1-2):** 1 hour
- **Production-ready (Phases 1-4):** 2-3 hours
- **Full-featured (All phases):** 4-6 hours

---

**Last Updated:** March 5, 2026
