require("dotenv").config();
const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;
const OPENWEATHER_API_KEY = process.env.OPENWEATHER_API_KEY;

// Main Weather Route
app.get("/api/weather", async (req, res) => {
  const { city, units = "metric" } = req.query;

  if (!city) {
    return res.status(400).json({ error: "City required" });
  }

  const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(
    city
  )}&appid=${OPENWEATHER_API_KEY}&units=${units}`;

  try {
    const response = await axios.get(url);
    const data = response.data;
    res.json(data);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Failed to fetch weather data" });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
