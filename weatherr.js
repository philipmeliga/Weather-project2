 
const apikey = "7ac5b0fab4797b6d7993640487fc489a";
const weatherDataEl = document.getElementById("weather-data");
const forecastDataEl = document.getElementById("forecast-data");
const cityInputEl = document.getElementById("city-input");
const formEl = document.querySelector("form");

formEl.addEventListener("click", (event) => {
    event.preventDefault();
    const cityValue = cityInputEl.value.trim();
    getWeatherData(cityValue);
    getForecastData(cityValue);
});

async function getWeatherData(cityValue) {
    try {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${cityValue}&appid=${apikey}&units=metric`);
        if (!response.ok) {
            throw new Error("Network problem!");
        }
        const data = await response.json();
        const temperature = Math.round(data.main.temp);
        const description = data.weather[0].description;
        const icon = data.weather[0].icon;
        const details = [
            `Feels like: ${Math.round(data.main.feels_like)}`,
            `Humidity: ${data.main.humidity}%`,
            `Wind speed: ${data.wind.speed} m/s`,
        ];
        weatherDataEl.querySelector(".icon").innerHTML = `<img src="http://openweathermap.org/img/wn/${icon}.png" alt="Weather Icon">`;
        weatherDataEl.querySelector(".temperature").textContent = `${temperature}°C`;
        weatherDataEl.querySelector(".description").textContent = description;
        weatherDataEl.querySelector(".details").innerHTML = details.map((detail) => `<div>${detail}</div>`).join("");
    } catch (error) {
        weatherDataEl.querySelector(".icon").innerHTML = "";
        weatherDataEl.querySelector(".temperature").textContent = "";
        weatherDataEl.querySelector(".description").textContent = "City name not found, check the spelling!";
        weatherDataEl.querySelector(".details").innerHTML = "";
    }
}

async function getForecastData(cityValue) {
    try {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${cityValue}&appid=${apikey}&units=metric`);
        if (!response.ok) {
            throw new Error("Network problem!");
        }
        const data = await response.json();
        const forecastList = data.list.filter((forecast, index) => index % 8 === 0).slice(0, 5);
        forecastDataEl.innerHTML = forecastList.map((forecast) => {
            const date = new Date(forecast.dt * 1000);
            const day = date.toLocaleString('en-us', { weekday: 'long' });
            const temperature = Math.round(forecast.main.temp);
            const description = forecast.weather[0].description;
            const icon = forecast.weather[0].icon;
            return `
                <div class="forecast-day">
                    <div class="day">${day}</div>
                    <div class="icon"><img src="http://openweathermap.org/img/wn/${icon}.png" alt="Weather Icon"></div>
                    <div class="temperature">${temperature}°C</div>
                    <div class="description">${description}</div>
                </div>
            `;
        }).join("");
    } catch (error) {
        forecastDataEl.innerHTML = "";
    }
}

