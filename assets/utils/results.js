import {
  convertTemperature,
  convertDateTime,
  convertWindSpeed,
} from "./conversions.js";

import {
  renderCurrentCardComponent,
  renderForecastCardComponent,
  renderCities,
} from "./renderCards.js";

const onSearch = async (event) => {
  event.preventDefault();
  const cityName = $("#cityInput").val().toLowerCase();

  $(".start-div").remove();
  $("#current-weather").empty();
  $("#forecastCardDiv").empty();
  $("#searchHistoryDiv").empty();
  $("#error-div").remove();
  $("#future-weather-heading").empty();

  const response = await getDataAndRenderWeather(cityName);
  if (response) storeCityNames(cityName);

  const citiesFromLocalStorage = getFromLocalStorage();
  renderCities(citiesFromLocalStorage);

  $("#cityForm").trigger("reset");
};

const storeCityNames = (cityName) => {
  if (cityName !== "") {
    const cityNamesArray = getFromLocalStorage();
    if (!cityNamesArray.includes(cityName)) {
      cityNamesArray.push(cityName);
      localStorage.setItem("cityNames", JSON.stringify(cityNamesArray));
    }
  }
};

const getFromLocalStorage = () => {
  const citiesFromLocalStorage = JSON.parse(localStorage.getItem("cityNames"));
  return citiesFromLocalStorage ? citiesFromLocalStorage : [];
};

const onClick = (event) => {
  const cityName = event.target.textContent;
  $("#current-weather").empty();
  $("#forecastCardDiv").empty();
  $("#error-div").remove();
  $("#future-weather-heading").empty();
  getDataAndRenderWeather(cityName);
};

const getCurrentDayWeather = (futureWeatherData) => ({
  date: convertDateTime(futureWeatherData.current.dt),
  iconURL: `https://openweathermap.org/img/wn/${futureWeatherData.current.weather[0].icon}@2x.png`,
  temperature: convertTemperature(futureWeatherData.current.temp),
  humidity: futureWeatherData.current.humidity,
  windSpeed: convertWindSpeed(futureWeatherData.current.wind_speed),
  uvIndex: futureWeatherData.current.uvi,
});

const getForecastData = (futureWeatherData) => {
  const constructForecastObject = (item) => ({
    date: convertDateTime(item.dt),
    iconURL: `https://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png`,
    temperature: convertTemperature(item.temp.day),
    humidity: item.humidity,
  });

  return futureWeatherData.daily.map(constructForecastObject);
};

const createErrorMessage = () => {
  const errorMessage = `<div id="error-div"
  class="start-div position-absolute top-50 start-50 translate-middle h-50 w-50"
>
  <div class="start-info px-4 py-5 fs-4 text-center">
  <h3> Oh no! We can't find your city!</h3>
<div> Please check your spelling. If you're still having trouble, there may be an issue on our end. Please check back later!</div>
  </div>
</div>`;
  $("#forecast-col").append(errorMessage);
};

const fetchData = async (url) => {
  try {
    const response = await fetch(url);
    return response.json();
  } catch (error) {
    createErrorMessage();
  }
};

const createWeatherApiUrl = (cityName) =>
  `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=785940357963f0488e126bd41a8d1e5c`;

const createLonLatUrl = ({ coord }) => {
  if (coord) {
    return `https://api.openweathermap.org/data/2.5/onecall?lat=${coord.lat}&lon=${coord.lon}&appid=785940357963f0488e126bd41a8d1e5c`;
  }
};

const renderAllCardsAndAppend = (futureWeatherData, cityName) => {
  const currentDayData = getCurrentDayWeather(futureWeatherData);
  const forecastDataArray = getForecastData(futureWeatherData);

  renderCurrentCardComponent(currentDayData, cityName);
  renderForecastCardComponent(forecastDataArray);
  $("#future-weather-heading").append(`
    <h4 class="row m-0 fw-bold forecast-heading">
      5 Day Forecast:
    </h4>`);
};

// get all data and append cards
const getDataAndRenderWeather = async (cityName) => {
  const urlForCurrentWeather = createWeatherApiUrl(cityName);
  const currentWeatherData = await fetchData(urlForCurrentWeather);

  if (currentWeatherData.cod === 200) {
    const urlForFutureWeather = createLonLatUrl(currentWeatherData);
    const futureWeatherData = await fetchData(urlForFutureWeather);

    $(".start-div").remove();
    renderAllCardsAndAppend(futureWeatherData, cityName);
    return true;
  } else {
    createErrorMessage();
    return false;
  }
};

const onLoad = async () => {
  const citiesFromLocalStorage = getFromLocalStorage();
  if (citiesFromLocalStorage.length) {
    renderCities(citiesFromLocalStorage);
  }
  const cityName = citiesFromLocalStorage[0];
  if (cityName) {
    getDataAndRenderWeather(cityName);
  }
};

$("#searchHistoryDiv").click(onClick);
$("#cityForm").submit(onSearch);
$(document).ready(onLoad);
