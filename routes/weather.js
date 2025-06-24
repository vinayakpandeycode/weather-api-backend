const express = require('express');
const axios = require('axios');
const router = express.Router();

const OPENWEATHER_API_KEY = process.env.OPENWEATHER_API_KEY;

// Route to get weather by city name (main one)
router.get('/', async (req, res) => {
  const { city, units = 'metric', lat, lon } = req.query;

  if (!city && (!lat || !lon)) {
    return res.status(400).json({ error: 'City or coordinates required' });
  }

  let url = '';

  // Build URL based on query
  if (city) {
    url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${OPENWEATHER_API_KEY}&units=${units}`;
  } else {
    url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${OPENWEATHER_API_KEY}&units=${units}`;
  }

  try {
    const response = await axios.get(url);
    const data = response.data;
    data.units = units; // include units in response for frontend
    res.json(data);
  } catch (error) {
    if (error.response?.status === 404) {
      res.status(404).json({ error: 'City not found' });
    } else {
      res.status(500).json({ error: 'Failed to fetch weather data' });
    }
  }
});

module.exports = router;
