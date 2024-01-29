import React, { useState } from 'react';
import './App.css';

function App() {
  const [input, setInput] = useState('');
  const [weatherData, setWeatherData] = useState(null);

  const API_KEY = 'cf002751564a4c78f5f7ed479f1b9ba3';

  const handleInputChange = (e) => {
    setInput(e.target.value);
  };

  const getWeatherData = async () => {
    try {
      let endpoint;

      // Check if the input looks like a zip code or GPS coordinates
      if (/^\d+$/.test(input)) {
        endpoint = `https://api.openweathermap.org/data/2.5/weather?zip=${input}&appid=${API_KEY}`;

      } else if (/^-?(\d+(\.\d+)?),\s*(-?\d+(\.\d+)?)$/.test(input)) {
        const [lat, lon] = input.split(',').map((coord) => parseFloat(coord.trim()));
        endpoint = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}`;

      } else {
        // Assume the input is a city name
        //This can be changed to accomodate additional search params
        endpoint = `https://api.openweathermap.org/data/2.5/weather?q=${input}&appid=${API_KEY}`;
      }

      const response = await fetch(endpoint);
      if(!response.ok){
        throw new Error(`HTTP error Status: ${response.status}`);
      }
      const data = await response.json();
      console.log(data);

      setWeatherData(data);

    } catch (error) {
      console.error('Error fetching weather data:', error);
      setWeatherData(null);
    }
  };
  const kelvinToFahrenheit = (kelvin) => {
    return (kelvin - 273.15) * 9/5 + 32;
  };
  
  return (
    <div className='main'>
      <div>
        <h1>Weather App</h1>
        <div>
          <label>
            Enter City, Zip Code, or GPS Coordinates:
            <br />
            <input type="text" value={input} onChange={handleInputChange} />
          </label>
          <br />
          <button onClick={getWeatherData}>Get Weather</button>
        </div>

        {weatherData && (
          <div>
            <h2>Weather in {weatherData.name}</h2>
            <div className='weather'>
              <div className='weather-data'>             
                <h3>Current Temperature: </h3>
                <p>{Math.round(kelvinToFahrenheit(weatherData.main.temp))} °F</p>
              </div>
              <div className='weather-data'>
                <h3>High/Low: </h3>
                <p>{Math.round(kelvinToFahrenheit(weatherData.main.temp_max))} °F / {Math.round(kelvinToFahrenheit(weatherData.main.temp_min))} °F</p>
              </div>
              <div className='weather-data'>
                <h3>Conditions: </h3>
                <p>{weatherData.weather[0].description}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
