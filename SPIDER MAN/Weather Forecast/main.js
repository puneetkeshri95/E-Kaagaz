//const apiKey = "ENTER YOUR OWN API KEY"
function fetchWeather(cityName, latitude, longitude) {
  let url = `https://api.openweathermap.org/data/2.5/weather?appid=${apiKey}&units=metric`;

  if (cityName) {
    url += `&q=${cityName}`;
  } else if (latitude && longitude) {
    url += `&lat=${latitude}&lon=${longitude}`;
  } else {
    return;
  }

  fetch(url)
    .then(response => response.json())
    .then(data => displayCurrentWeather(data))
    .catch(error => console.error("Error fetching current weather:", error));
}
function displayCurrentWeather(data) {
  document.querySelector(".current-weather h2").textContent = `${data.name} (${new Date().toISOString().slice(0, 10)})`;
  document.querySelector(".current-weather h6:nth-of-type(1)").textContent = `Temperature: ${data.main.temp}°C`;
  document.querySelector(".current-weather h6:nth-of-type(2)").textContent = `Wind: ${data.wind.speed} M/S`;
  document.querySelector(".current-weather h6:nth-of-type(3)").textContent = `Humidity: ${data.main.humidity}%`;

  const weatherIcon = data.weather[0].icon;
  const weatherDescription = data.weather[0].description;
  document.querySelector(".current-weather .icon").innerHTML = `
    <img src="https://openweathermap.org/img/wn/${weatherIcon}@4x.png" alt="weather-icon" onerror="this.onerror=null; this.src='default-icon.png';">
    <h6>${weatherDescription}</h6>
  `;
}

function fetchForecast(cityName, latitude, longitude) {
  let url = `https://api.openweathermap.org/data/2.5/forecast?appid=${apiKey}&units=metric`;

  if (cityName) {
    url += `&q=${cityName}`;
  } else if (latitude && longitude) {
    url += `&lat=${latitude}&lon=${longitude}`;
  } else {
    return;
  }

  fetch(url)
    .then(response => response.json())
    .then(data => displayForecast(data))
    .catch(error => console.error("Error fetching forecast:", error));
}
function displayForecast(data) {
  const forecastContainer = document.querySelector(".weather-cards");

  const forecastDays = data.list.filter((_, index) => index % 8 === 0);

  forecastDays.forEach((weatherItem) => {
    const weatherDate = new Date(weatherItem.dt * 1000).toISOString().slice(0, 10);
    const weatherIcon = weatherItem.weather[0].icon;
    const weatherDescription = weatherItem.weather[0].description;

    const card = document.createElement("div");
    card.classList.add("card");

    card.innerHTML = `
      <h3>${weatherDate}</h3>
      <img src="https://openweathermap.org/img/wn/${weatherIcon}@4x.png" alt="weather-icon" onerror="this.onerror=null; this.src='default-icon.png';">
      <h6>Temp: ${weatherItem.main.temp}°C</h6>
      <h6>Wind: ${weatherItem.wind.speed} M/S</h6>
      <h6>Humidity: ${weatherItem.main.humidity}%</h6>
    `;

    forecastContainer.appendChild(card);
  });
}

document.querySelector(".search-btn").addEventListener("click", () => {
  const cityName = document.querySelector(".weather-input input").value;
  fetchWeather(cityName);
  fetchForecast(cityName);
});

document.querySelector(".location-btn").addEventListener("click", () => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition((position) => {
      const { latitude, longitude } = position.coords;
      fetchWeather(null, latitude, longitude);
      fetchForecast(null, latitude, longitude);
    });
  } else {
    alert("Geolocation is not supported by your browser.");
  }
});
