// function for when the search button is clicked
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

// function to store user searches in local storage
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

// function to render weather items when clicking on search history
const onClick = (event) => {
  const cityName = event.target.textContent;
  $("#current-weather").empty();
  $("#forecastCardDiv").empty();
  $("#error-div").remove();
  $("#future-weather-heading").empty();
  getDataAndRenderWeather(cityName);
};

// function to convert temp from kelvin to celcius
const convertTemperature = (kelvin) =>
  (tempInCelcius = Math.floor(kelvin - 273.15));

// function to convert unix date string to a dd/mm/yy format
const convertDateTime = (dateString) =>
  (date = new Date(dateString * 1000).toLocaleDateString("en-UK"));

// function to convert wind speed from m/s to mph
const convertWindSpeed = (speed) => {
  const mph = speed * 2.237;
  return (roundedSpeed = Math.round(mph * 10) / 10);
};

// extract needed data from api call to construct current weather card
const getCurrentDayWeather = (futureWeatherData) => {
  convertTemperature(futureWeatherData.current.temp);
  convertDateTime(futureWeatherData.current.dt);
  convertWindSpeed(futureWeatherData.current.wind_speed);
  return {
    date: date,
    iconURL: `https://openweathermap.org/img/wn/${futureWeatherData.current.weather[0].icon}@2x.png`,
    temperature: tempInCelcius,
    humidity: futureWeatherData.current.humidity,
    windSpeed: roundedSpeed,
    uvIndex: futureWeatherData.current.uvi,
  };
};

// iterate over forecast data array and extract needed data from api call to construct future weather card
const getForecastData = (futureWeatherData) => {
  const forecastData = futureWeatherData.daily.map(constructForecastObject);
  return forecastData;
};

const constructForecastObject = (item) => {
  convertTemperature(item.temp.day);
  convertDateTime(item.dt);
  const forecastObject = [
    {
      date: date,
      iconURL: `https://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png`,
      temperature: tempInCelcius,
      humidity: item.humidity,
    },
  ];
  return forecastObject;
};

const renderCurrentCardComponent = (currentDayData, cityName) => {
  const currentCardComponent = `<h4 class="current-city pt-2" id="cityName">${
    cityName.charAt(0).toUpperCase() + cityName.substr(1).toLowerCase()
  } <span id="currentDate">- ${currentDayData.date}</span
  ><span id="weatherIcon"><img src="${currentDayData.iconURL}"/> </span>
</h4>
<div id="temp" class=" current-weather-info">Temperature: ${
    currentDayData.temperature
  } \xB0 C </div>
<div id="humidity" class="current-weather-info">Humidity: ${
    currentDayData.humidity
  }% </div>
<div id="windSpeed" class=" current-weather-info">Wind Speed: ${
    currentDayData.windSpeed
  } mph </div>
<div
class="current-weather-info" >UV Index: <span id="uv" class="rounded current-weather-info"> ${
    currentDayData.uvIndex
  }</span></div>
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
  return currentCardComponent;
};

const renderForecastCardComponent = (forecastDataArray) => {
  forecastDataArray.shift();
  forecastDataArray.length = 5;
  forecastDataArray.forEach(constructForecastCardsAndAppend);
};

const constructForecastCardsAndAppend = (item, index) => {
  const forecastCard = `<div class="col">
<div class="card future-card pt-2 text-center">
  <h6 class="card-title">${item[0].date}</h6>
  <div id="futureWeatherIcon"><img src="${item[0].iconURL}"/></div>
  <div id="futureTemp">Temp: ${item[0].temperature} \xB0 C</div>
  <div id="futureHumidity">Humidity: ${item[0].humidity}%</div>
</div>
</div>`;
  $("#forecastCardDiv").append(forecastCard);
  return forecastCard;
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
  return errorMessage;
};

// main API calls
const fetchData = async (url) => {
  try {
    const response = await fetch(url);
    const data = await response.json();
    return data;
  } catch (error) {
    createErrorMessage();
  }
};

//function to build URL to get data for country card
const createWeatherApiUrl = (cityName) => {
  return `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=785940357963f0488e126bd41a8d1e5c`;
};

//function to build URL to get data for vaccines and currency converter
const createLonLatUrl = (currentDayData) => {
  const cityLonLat = currentDayData.coord;
  if (cityLonLat) {
    return `https://api.openweathermap.org/data/2.5/onecall?lat=${cityLonLat.lat}&lon=${cityLonLat.lon}&appid=785940357963f0488e126bd41a8d1e5c`;
  }
};

// render and append all weather info
const renderAllCarsAndAppend = (futureWeatherData, cityName) => {
  const currentDayData = getCurrentDayWeather(futureWeatherData);
  const forecastDataArray = getForecastData(futureWeatherData);

  renderCurrentCardComponent(currentDayData, cityName);
  renderForecastCardComponent(forecastDataArray);
  $("#future-weather-heading")
    .append(`<h4 class="row m-0 fw-bold forecast-heading">
      5 Day Forecast:
    </h4>`);
};

// get all data and append cards
const getDataAndRenderWeather = async (cityName) => {
  const urlForCurrentWeather = createWeatherApiUrl(cityName);
  const currentWeatherData = await fetchData(urlForCurrentWeather);
  // create URL + fetch data for future weather data
  if (currentWeatherData.cod === 200) {
    const urlForFutureWeather = createLonLatUrl(currentWeatherData);
    const futureWeatherData = await fetchData(urlForFutureWeather);

    renderAllCarsAndAppend(futureWeatherData, cityName);
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

    const cityName = citiesFromLocalStorage[0];

    if (cityName) {
      $(".start-div").remove();
      getDataAndRenderWeather(cityName);
    }
  }
};

$("#searchHistoryDiv").click(onClick);
$("#cityForm").submit(onSearch);
$(document).ready(onLoad);
