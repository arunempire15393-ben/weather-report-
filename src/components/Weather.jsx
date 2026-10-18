
import { useState } from "react";
import axios from "axios";
import "./Weather.css";

function Weather() {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const API_KEY = import.meta.env.VITE_WEATHER_API_KEY;

  const searchWeather = async (event) => {
    event.preventDefault();

    if (!city.trim()) {
      setError("Please enter a city name.");
      setWeather(null);
      return;
    }

    if (!API_KEY) {
      setError("API key missing. Check your .env file.");
      return;
    }

    setLoading(true);
    setError("");
    setWeather(null);

    try {
      const response = await axios.get(
        "   https://api.openweathermap.org/data/2.5/weather",
        {
          params: {
            q: city.trim(),
            appid: API_KEY,
            units: "metric",
          },
        }
      );

      setWeather(response.data);
    } 
    catch (err) {
  console.log("Weather API error:", err.response?.data || err.message);

  if (err.response?.status === 404) {
    setError("City not found. Please try another city.");
  } else if (err.response?.status === 401) {
    setError("Invalid API key. Check your OpenWeatherMap key.");
  } else if (err.response?.data?.message) {
    setError(err.response.data.message);
  } else {
    setError(err.message || "Unable to fetch weather.");
  }
} finally {
  setLoading(false);
}
  };

  return (
    <main className="weather-page">
      <section className="weather-container">
        <header className="weather-header">
          <span className="weather-logo">🌤️</span>
          <h1>Weather<span>ly</span></h1>
          <p>Discover the weather around you.</p>
        </header>

        <form className="search-form" onSubmit={searchWeather}>
          <input
            type="text"
            placeholder="Enter city name..."
            value={city}
            onChange={(event) => setCity(event.target.value)}
            aria-label="City name"
          />

          <button type="submit" disabled={loading}>
            {loading ? "Loading..." : "Search"}
          </button>
        </form>

        {error && (
          <p className="error-message" role="alert">
            {error}
          </p>
        )}

        {loading && (
          <p className="loading-message">Getting your weather...</p>
        )}

        {weather && !loading && (
          <article className="weather-card">
            <h2>
              {weather.name}, {weather.sys.country}
            </h2>

            <img
              src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
              alt={weather.weather[0].description}
            />

            <h3>{Math.round(weather.main.temp)}°C</h3>

            <p className="condition">
              {weather.weather[0].description}
            </p>

            <p>
              Feels like {Math.round(weather.main.feels_like)}°C
            </p>

            <div className="weather-details">
              <div className="detail">
                <span>💧</span>
                <p>Humidity</p>
                <strong>{weather.main.humidity}%</strong>
              </div>

              <div className="detail">
                <span>🌬️</span>
                <p>Wind Speed</p>
                <strong>{weather.wind.speed} m/s</strong>
              </div>

              <div className="detail">
                <span>🌡️</span>
                <p>Pressure</p>
                <strong>{weather.main.pressure} hPa</strong>
              </div>
            </div>
          </article>
        )}

        {!weather && !loading && !error && (
          <div className="empty-state">
            <span>🌍</span>
            <h2>Explore the weather</h2>
            <p>Search any city to see its current weather report.</p>
          </div>
        )}

        <footer>Powered by OpenWeatherMap</footer>
      </section>
    </main>
  );
}

export default Weather;
