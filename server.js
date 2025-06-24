require('dotenv').config();
console.log("API Key:", process.env.OPENWEATHER_API_KEY);
const express = require('express');
const cors = require('cors');
const weatherRoute = require('./routes/weather');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/weather', weatherRoute);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
