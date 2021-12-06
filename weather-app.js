//Declaring the variables and getting the DOM elements
const userInput = document.getElementById("cityName");
const submitButton = document.getElementById("submit");
const warningMsg = document.getElementById("warning-msg");
const getCurrentPosition = document.getElementById("location-button");
const displayWeather = document.getElementById("display-weather");
const cityName = document.getElementById("city-name");
const temperature = document.getElementById("temperature");
const weatherIcon = document.getElementById("weather-icon");
const imageIcon = document.createElement("img");
const wind = document.getElementById("wind");
const cloudy = document.getElementById("cloudy");
const sunrise = document.getElementById("sunrise");
const sunset = document.getElementById("sunset");
let lat;
let lng;
let localStorageData;
let setLocalStorageForButton1;
let setLocalStorageForButton2;

submitButton.addEventListener("click", (event) => {
  const cityName = userInput.value;
  if (cityName === "") {
    warningMsg.innerHTML = "Please enter a city name";
  } else {
    warningMsg.innerHTML = "";
    //Api to fetch weather information using user entered city
    fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=4885c4b997291cbbdb529b59964ffed7`
    )
      .then((response) => response.json())
      .then((weatherData) => {
        displayWeatherDetails(weatherData);
        setLocalStorageForButton1 = cityName.innerHTML;
        localStorage.setItem("userCity", setLocalStorageForButton1);
      });
  }
});

//to get the position of user
getCurrentPosition.addEventListener("click", (event) => {
  if (!navigator.geolocation) {
    status.textContent = "Geolocation is not supported by your browser";
  } else {
    status.textContent = "Locating…";
    navigator.geolocation.getCurrentPosition(success, error);
  }
  function error() {
    status.textContent = "Unable to retrieve your location";
  }
  function success(position) {
    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;
    //Api to fetch weather information using position
    fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=4885c4b997291cbbdb529b59964ffed7`
    )
      .then((response) => response.json())
      .then((weatherData) => {
        displayWeatherDetails(weatherData);
        setLocalStorageForButton2 = cityName.innerHTML;
        localStorage.setItem("localWeather", setLocalStorageForButton2);
      });
  }
});

//local storage of city name using user's position
if (localStorage.getItem("localWeather")) {
  localStorageData = localStorage.getItem("localWeather");
  displayLocalStorageData();
}
//local storage of city name using user entered city name
else if (localStorage.getItem("userCity")) {
  localStorageData = localStorage.getItem("userCity");
  displayLocalStorageData();
}

function displayLocalStorageData() {
  fetch(
    `https://api.openweathermap.org/data/2.5/weather?q=${localStorageData}&appid=4885c4b997291cbbdb529b59964ffed7`
  )
    .then((response) => response.json())
    .then((weatherData) => {
      displayWeatherDetails(weatherData);
    });
}

function displayWeatherDetails(weatherData) {
  cityName.innerHTML = weatherData.name;
  temperature.innerHTML = "Temperature: " + weatherData.main.temp;
  imageIcon.src = `http://openweathermap.org/img/wn/${weatherData.weather[0].icon}@4x.png`;
  weatherIcon.appendChild(imageIcon);
  wind.innerHTML = "Wind: " + weatherData.wind.speed;
  cloudy.innerHTML = "Cloud: " + weatherData.clouds.all;
  const sunriseTime = new Date(weatherData.sys.sunrise * 1000);
  sunrise.innerHTML = "Sunrise: " + sunriseTime.toLocaleTimeString("en-US");
  const sunsetTime = new Date(weatherData.sys.sunset * 1000);
  sunset.innerHTML = "Sunset: " + sunsetTime.toLocaleTimeString("en-US");
  lat = weatherData.coord.lat;
  lng = weatherData.coord.lon;
  mapfun(lat, lng);
}

//created map using mapbox
function mapfun(lat, lng) {
  mapboxgl.accessToken =
    "pk.eyJ1IjoiZGlueXRob21hczg5IiwiYSI6ImNrbTNieW55YTBhOXMyd3Fkem41ejF5dDUifQ.zJuXJWcxBUw3owpSS9-bAA";
  var map = new mapboxgl.Map({
    container: "map",
    style: "mapbox://styles/mapbox/streets-v11",
    center: [lng, lat],
    zoom: 7,
  });
}
