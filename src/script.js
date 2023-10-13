/*current time*/

let now = new Date();

let currentDate = document.querySelector("#date-input");
let currentTime = document.querySelector("#time-input");

let days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
let day = days[now.getDay()];
let date = now.getDate();
let months = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];
let month = months[now.getMonth()];
let hours = now.getHours().toString().padStart(2, "0");
let minutes = now.getMinutes().toString().padStart(2, "0");

currentDate.innerHTML = `${day} | ${date} ${month}`;
currentTime.innerHTML = `${hours}:${minutes}`;

function formatDay(timestamp) {
  let date = new Date(timestamp * 1000);
  let day = date.getDay();
  let days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return days[day];
}

function displayForecast(response) {
  let forecast = response.data.daily;

  let forecastElement = document.querySelector("#forecast");

  let forecastHTML = `<div class="row">`;

  for (let index = 1; index < 7; index++) {
    forecastHTML =
      forecastHTML +
      `
  <div class="col-2">
        <div class="weather-forecast-date">${formatDay(
          forecast[index].dt
        )}</div>
        <img src="http://openweathermap.org/img/wn/${
          forecast[index].weather[0].icon
        }@2x.png" alt="" width="42" />
        <div class="weather-forecast-temperatures">
          <span class="weather-forecast-temperature-max">${Math.round(
            forecast[index].temp.max
          )}°</span>
          <span class="weather-forecast-temperature-min">${Math.round(
            forecast[index].temp.min
          )}°</span>
        </div>
      </div>
  `;
  }
  forecastHTML = forecastHTML + `</div>`;

  forecastElement.innerHTML = forecastHTML;
}

function getForecast(coordinates) {
  let apiKey = "6d68aadfacdd4f5163bc273049a0cf2d";
  let apiUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${apiKey}&units=metric`;
  axios.get(apiUrl).then(displayForecast);
}

/*current location*/

function currentLocation(event) {
  event.preventDefault();
  let locationTextInput = document.querySelector("#search-input");
  let cityInputResult = document.querySelector("#city-input");
  cityInputResult.innerHTML = locationTextInput.value;
}
let form = document.querySelector("#form-input");
form.addEventListener("submit", currentLocation);

/*click temperature unit*/

function degreeUnitClick(event) {
  event.preventDefault();
  degreeClick.classList.add("active");
  fahrenheitClick.classList.remove("active");
  let degreeClickResult = document.querySelector("#temperature-reading");
  degreeClickResult.innerHTML = Math.round(celsiusTemperature);
}
let degreeClick = document.querySelector("#degreeCelcius-symbol");
degreeClick.addEventListener("click", degreeUnitClick);

function fahrenheitUnitClick(event) {
  event.preventDefault();
  degreeClick.classList.remove("active");
  fahrenheitClick.classList.add("active");
  let fahrenheitConvert = (celsiusTemperature * 9) / 5 + 32;
  let fahrenheitClickResult = document.querySelector("#temperature-reading");
  fahrenheitClickResult.innerHTML = Math.round(fahrenheitConvert);
}
let fahrenheitClick = document.querySelector("#fahrenheit-symbol");
fahrenheitClick.addEventListener("click", fahrenheitUnitClick);

let celsiusTemperature = null;

function showTemperature(response) {
  let temperatureElement = document.querySelector("#temperature-reading");
  let cityElement = document.querySelector("#city-input");
  let descriptionElement = document.querySelector("#description");
  let humidityElement = document.querySelector("#humidity");
  let windElement = document.querySelector("#wind");
  let emojiElement = document.querySelector("#emoji");

  celsiusTemperature = response.data.main.temp;

  temperatureElement.innerHTML = Math.round(response.data.main.temp);
  cityElement.innerHTML = `📍${response.data.name}`;
  descriptionElement.innerHTML = response.data.weather[0].description;
  humidityElement.innerHTML = response.data.main.humidity;
  windElement.innerHTML = Math.round(response.data.wind.speed);
  emojiElement.setAttribute(
    "src",
    `http://openweathermap.org/img/wn/${response.data.weather[0].icon}@2x.png`
  );

  emojiElement.setAttribute("alt", response.data.weather[0].description);

  getForecast(response.data.coord);
}

function showPosition(position) {
  let apiKey = "6d68aadfacdd4f5163bc273049a0cf2d";
  let latitude = position.coords.latitude;
  let longitude = position.coords.longitude;
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${apiKey}`;
  axios.get(apiUrl).then(showTemperature);
}

function getCurrentPosition() {
  navigator.geolocation.getCurrentPosition(showPosition);
}

let currentBtn = document.querySelector("#current-btn");
currentBtn.addEventListener("click", getCurrentPosition);

function getWeatherByCity(city) {
  let apiKey = "6d68aadfacdd4f5163bc273049a0cf2d";
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`;
  axios.get(apiUrl).then(showTemperature);
}

function handleSearch() {
  let searchCityInput = document.querySelector("#search-input").value;
  if (searchCityInput.trim() !== "") {
    getWeatherByCity(searchCityInput);
  } else {
    alert("Please enter a valid city name.");
  }
}

let searchBtn = document.querySelector("#search-btn");
searchBtn.addEventListener("click", handleSearch);

getWeatherByCity("Pretoria");
