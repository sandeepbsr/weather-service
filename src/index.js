const express = require('express');
const axios = require('axios');
const path = require('path');
const app = express();
const port = 3000;

const WEATHERSTACK_API_KEY = 'YOUR_API_KEY';
const WEATHERSTACK_URL = 'http://api.weatherstack.com/current';

app.use(express.static(path.join(__dirname, '../public')));
app.use(express.json());

app.get('/weather', async (req, res) => {
    const { city } = req.query;
    
    if (!city) {
        return res.status(400).json({ error: 'City is required' });
    }

    try {
        const response = await axios.get(WEATHERSTACK_URL, {
            params: {
                access_key: WEATHERSTACK_API_KEY,
                query: city
            }
        });

        const weatherData = response.data;
        if (weatherData.error) {
            return res.status(400).json({ error: weatherData.error.info });
        }

        const { location, current } = weatherData;
        res.json({
            city: location.name,
            country: location.country,
            temperature: current.temperature,
            weather_descriptions: current.weather_descriptions[0],
            wind_speed: current.wind_speed,
            humidity: current.humidity
        });
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch weather data' });
    }
});

app.listen(port, () => {
    console.log(`Weather service running on http://localhost:${port}`);
});
