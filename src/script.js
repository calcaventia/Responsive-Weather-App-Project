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
    `http://openweather.org/img/wn/${response.data.weather[0].icon}@2x.png`
  );
  emojiElement.setAttribute("alt", response.data.weather[0].description);
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
