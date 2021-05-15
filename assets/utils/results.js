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

const getUrlParams = () => {
  const urlParams = new URLSearchParams(window.location.search);
  const cityName = urlParams.get("city");
  return cityName;
};

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

  if (response) {
    $("#cityForm").trigger("reset");
    storeCityNames(cityName);

    const citiesFromLocalStorage = getFromLocalStorage();

    renderCities(citiesFromLocalStorage);
  }
};

const storeCityNames = (cityName) => {
  const cityNamesArray = getFromLocalStorage();

  if (cityName !== "" && !cityNamesArray.includes(cityName)) {
    if (cityNamesArray.length > 9) {
      cityNamesArray.shift();
      cityNamesArray.push(cityName);
      localStorage.setItem("cityNames", JSON.stringify(cityNamesArray));
    } else {
      cityNamesArray.push(cityName);
      localStorage.setItem("cityNames", JSON.stringify(cityNamesArray));
    }
  }
};

const handleHistoryClick = (event) => {
  const removeBtn = $(".remove-list-item");
  const cityName = event.target.textContent;

  if ($(event.target).is("li")) {
    $("#current-weather").empty();
    $("#forecastCardDiv").empty();
    $("#error-div").remove();
    $("#future-weather-heading").empty();
    getDataAndRenderWeather(cityName);
  } else if ($(event.target).is("i")) {
    const citiesFromLocalStorage = getFromLocalStorage();

    const filterCities = (each) => {
      const target = $(event.target);
      const parent = $(target).closest(".history-list");
      const city = parent.text().toLowerCase();

      return each !== city;
    };

    const filteredCities = citiesFromLocalStorage.filter(filterCities);

    localStorage.setItem("cityNames", JSON.stringify(filteredCities));

    renderCities(filteredCities);
  }
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
      5 Day Forecast
    </h4>`);
};

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
  const cityName = getUrlParams().toLowerCase();

  const response = await getDataAndRenderWeather(cityName);

  if (response) storeCityNames(cityName);

  const citiesFromLocalStorage = getFromLocalStorage();

  renderCities(citiesFromLocalStorage);
};

$("#searchHistoryDiv").click(handleHistoryClick);

$("#cityForm").submit(onSearch);

$(document).ready(onLoad);
