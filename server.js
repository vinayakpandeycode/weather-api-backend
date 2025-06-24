require('dotenv').config();
const express = require('express');
const cors = require('cors');
const axios = require('axios');
const weatherRoute = require('./routes/weather');

const app = express();

// Enable CORS
app.use(cors());
app.use(express.json());

// Weather route (your existing route)
app.use('/api/weather', weatherRoute);

// 🔁 Proxy route to bypass CORS error
app.get('/api/proxy', async (req, res) => {
  const { url } = req.query;

  if (!url) {
    return res.status(400).json({ error: 'URL is required' });
  }

  // (Optional) Security: Allow only specific URLs
  if (!url.startsWith("https://sijju.pythonanywhere.com")) {
    return res.status(403).json({ error: 'Forbidden target URL' });
  }

  try {
    const response = await axios.get(url);
    res.json(response.data);
  } catch (error) {
    console.error("Proxy fetch error:", error.message);
    res.status(500).json({ error: 'Failed to fetch from target URL' });
  }
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
