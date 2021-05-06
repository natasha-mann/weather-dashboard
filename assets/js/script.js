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

const renderCities = (citiesFromLocalStorage) => {
  const constructListItem = (cityName) => {
    const city = `${cityName.charAt(0).toUpperCase()}${cityName
      .substr(1)
      .toLowerCase()}`;

    const listItem = `<li class="list-group-item history-list">${city}</li>`;

    $("#searchHistoryDiv").append(listItem);
  };

  citiesFromLocalStorage.reverse().forEach(constructListItem);
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

const convertTemperature = (kelvin) => Math.floor(kelvin - 273.15);

const convertDateTime = (dateString) =>
  new Date(dateString * 1000).toLocaleDateString("en-UK");

const convertWindSpeed = (speed) => Math.round(speed * 2.237 * 10) / 10;

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

const renderCurrentCardComponent = (currentDayData, cityName) => {
  const currentCardComponent = `
  <h4 class="current-city pt-2" id="cityName">${
    cityName.charAt(0).toUpperCase() + cityName.substr(1).toLowerCase()
  } 
    <span id="currentDate">- ${currentDayData.date}</span>
    <span id="weatherIcon"><img src="${currentDayData.iconURL}"/> </span>
  </h4>

  <div id="temp" class="fw-bold current-weather-info">Temperature: 
    <span class="fw-normal">${currentDayData.temperature} \xB0 C</span>
  </div>
  <div id="humidity" class="fw-bold current-weather-info">Humidity: 
    <span class="fw-normal">${currentDayData.humidity}%</span>
  </div>
  <div id="windSpeed" class="fw-bold current-weather-info">Wind Speed: 
    <span class="fw-normal">${currentDayData.windSpeed} mph</span>
  </div>
  <div class="fw-bold current-weather-info" >UV Index: 
    <span id="uv" class="fw-normal rounded current-weather-info">
      ${currentDayData.uvIndex}
    </span>
  </div>`;

  $("#current-weather").append(currentCardComponent);
  if (currentDayData.uvIndex >= 0 && currentDayData.uvIndex < 3) {
    $("#uv").addClass("low-uv");
  } else if (currentDayData.uvIndex >= 3 && currentDayData.uvIndex < 6) {
    $("#uv").removeClass("low-uv").addClass("mid-uv");
  } else if (currentDayData.uvIndex >= 6 && currentDayData.uvIndex < 8) {
    $("#uv").removeClass("mid-uv").addClass("high-uv");
  } else if (currentDayData.uvIndex >= 8 && currentDayData.uvIndex < 11) {
    $("#uv").removeClass("high-uv").addClass("very-high-uv");
  } else if (currentDayData.uvIndex >= 11) {
    $("#uv").removeClass("very-high-uv").addClass("extra-high-uv");
  }
};

const renderForecastCardComponent = (forecastDataArray) => {
  const constructForecastCardsAndAppend = (item) => {
    const forecastCard = `
  <div class="col">
    <div class="card future-card pt-2 text-center">
      <h6 class="card-title">${item.date}</h6>
      <div id="futureWeatherIcon">
        <img src="${item.iconURL}"/>
      </div>
      <div class="fw-bold" id="futureTemp">Temp: <span class="fw-normal">${item.temperature} \xB0 C</span></div>
      <div class="fw-bold" id="futureHumidity">Humidity: <span class="fw-normal">${item.humidity} %</span></div>
    </div>
  </div>`;
    $("#forecastCardDiv").append(forecastCard);
  };

  forecastDataArray.slice(1, 6).forEach(constructForecastCardsAndAppend);
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
