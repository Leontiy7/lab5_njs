// Import required modules
const express = require('express');
const exphbs = require('hbs');
const path = require('path');
const fetch = require('node-fetch');

// Create express app
const app = express();

const viewsPath = path.join(__dirname, '/views');

app.set('view engine', 'hbs');
app.set('views', viewsPath);
app.use(express.static(path.join(__dirname, 'public')));

app.get('/weather/:city', async (req, res) => {
  try {
    const city = req.params.city;

    const apiKey = 'a3ee871a20f0cb0df937b22175c47d4f'; 
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`;
    const response = await fetch(apiUrl);
    const data = await response.json();

    if (!data.main || !data.weather || !data.weather[0]) {
      throw new Error('Failed to fetch weather data');
    }

    const temperature = data.main.temp;
    const humidity = data.main.humidity;
    const pressure = data.main.pressure;
    const description = data.weather[0].description;
    const iconCode = data.weather[0].icon;

    res.render('weather', { city, temperature, humidity, pressure, description, iconCode });
  } catch (err) {
   
    console.error(err);
    res.status(500).send('Failed to fetch weather data');
  }
});

app.get('/', (req, res) => {
   
    if (req.query.city) {
      
      const city = req.query.city;
      const link = `/weather/${city}`;
  
      res.render('main', { cities: [{ name: city, link }], submittedCity: city });
    } else {
      const cities = [
        { name: 'Львів', link: '/weather/Львів' },
        { name: 'Тернопіль', link: '/weather/Тернопіль' },
        { name: 'Одеса', link: '/weather/Одеса' },
        { name: 'Київ', link: '/weather/Київ' },
        { name: 'Черкаси', link: '/weather/Черкаси' },
        { name: 'Обухів', link: '/weather/Обухів' }

        

      ];
  
      res.render('main', { cities });
    }
  });


const port = 3000;
app.listen(port, () => {
  console.log(`Server started on http://localhost:${port}`);
});
