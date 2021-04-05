// function for when the search button is clicked
const onSearch = (event) => {
  event.preventDefault();
  const cityName = $("#cityInput").val().toLowerCase();
  storeCityNames(cityName);
  $(".start-div").remove();
  $("#current-weather").empty();
  $("#forecastCardDiv").empty();
  $("#searchHistoryDiv").empty();
  $("#error-div").remove();
  $("#future-weather-heading").empty();
  const citiesFromLocalStorage = getFromLocalStorage();
  renderCities(citiesFromLocalStorage);

  fetchWeatherData(cityName);
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

// function to display search history list
const renderCities = (citiesFromLocalStorage) => {
  citiesFromLocalStorage.reverse();
  $(citiesFromLocalStorage).each(constructListItem);
};

const constructListItem = (index, cityName) => {
  const listItem = `<li class="list-group-item history-list">${
    cityName.charAt(0).toUpperCase() + cityName.substr(1).toLowerCase()
  }</li>`;
  $("#searchHistoryDiv").append(listItem);
  return listItem;
};

const getFromLocalStorage = () => {
  const citiesFromLocalStorage = localStorage.getItem("cityNames");
  if (citiesFromLocalStorage) {
    return JSON.parse(citiesFromLocalStorage);
  } else {
    return [];
  }
};

// function to render weather items when clicking on search history
const onClick = (event) => {
  const cityName = event.target.textContent;
  $("#current-weather").empty();
  $("#forecastCardDiv").empty();
  $("#error-div").remove();
  $("#future-weather-heading").empty();
  fetchWeatherData(cityName);
};

// function to convert temp from kelvin to celcius
const convertTemperature = (kelvin) => {
  return (tempInCelcius = Math.floor(kelvin - 273.15));
};

// function to convert unix date string to a dd/mm/yy format
const convertDateTime = (dateString) => {
  return ([date, month, year] = new Date(dateString * 1000)
    .toLocaleDateString("en-UK")
    .split(" / "));
};

// extract needed data from api call to construct current weather card
const getCurrentDayWeather = (oneApiData) => {
  convertTemperature(oneApiData.current.temp);
  convertDateTime(oneApiData.current.dt);
  return {
    date: [date],
    iconURL: `https://openweathermap.org/img/wn/${oneApiData.current.weather[0].icon}@2x.png`,
    temperature: tempInCelcius,
    humidity: oneApiData.current.humidity,
    windSpeed: oneApiData.current.wind_speed,
    uvIndex: oneApiData.current.uvi,
  };
};

// iterate over forecast data array and extract needed data from api call to construct future weather card
const getForecastData = (oneApiData) => {
  const forecastData = oneApiData.daily.map(constructForecastObject);
  return forecastData;
};

const constructForecastObject = (item) => {
  convertTemperature(item.temp.day);
  convertDateTime(item.dt);
  const forecastObject = [
    {
      date: [date],
      iconURL: `https://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png`,
      temperature: tempInCelcius,
      humidity: item.humidity,
    },
  ];
  return forecastObject;
};

const renderCurrentCardComponent = (currentDayData, cityName) => {
  const currentCardComponent = `<h2 class="mt-2 current-city" id="cityName">${
    cityName.charAt(0).toUpperCase() + cityName.substr(1).toLowerCase()
  } <span id="currentDate">- ${currentDayData.date}</span
  ><span id="weatherIcon"><img src="${currentDayData.iconURL}"/> </span>
</h2>
<div id="temp" class="current-weather-info">Temperature: ${
    currentDayData.temperature
  } \xB0 C </div>
<div id="humidity" class="current-weather-info">Humidity: ${
    currentDayData.humidity
  }% </div>
<div id="windSpeed" class="current-weather-info">Wind Speed: ${
    currentDayData.windSpeed
  } mph </div>
<div
class="current-weather-info" >UV Index: <span id="uv" class="uv class="current-weather-info> ${
    currentDayData.uvIndex
  }</span></div>
</div>`;
  $("#current-weather").append(currentCardComponent);
  if (currentDayData.uvIndex >= 0 && currentDayData.uvIndex < 3) {
    $(".uv").addClass("low-uv");
  } else if (currentDayData.uvIndex >= 3 && currentDayData.uvIndex < 6) {
    $(".uv").removeClass("low-uv").addClass("mid-uv");
  } else if (currentDayData.uvIndex >= 6 && currentDayData.uvIndex < 8) {
    $(".uv").removeClass("mid-uv").addClass("high-uv");
  } else if (currentDayData.uvIndex >= 8 && currentDayData.uvIndex < 11) {
    $(".uv").removeClass("high-uv").addClass("very-high-uv");
  } else if (currentDayData.uvIndex >= 11) {
    $(".uv").removeClass("very-high-uv").addClass("extra-high-uv");
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
<div class="card future-card p-2 text-center">
  <h5 class="card-title">${item[0].date}</h5>
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
  <h2> Oh no! We can't find your city!</h2>
<div> Please check your spelling. If you're still having trouble, there may be an issue on our end. Please check back later!</div>
  </div>
</div>`;
  $("#forecast-col").append(errorMessage);
  return errorMessage;
};

// main API calls
const fetchWeatherData = (cityName) => {
  const weatherApiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=785940357963f0488e126bd41a8d1e5c`;

  const functionForJSON = (responseObject) => {
    if (responseObject.status !== 200) {
      throw new Error("Internal Server Error");
    }
    return responseObject.json();
  };

  const functionForApplication = (currentDayData) => {
    const cityLonLat = currentDayData.coord;
    const oneApiUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${cityLonLat.lat}&lon=${cityLonLat.lon}&appid=785940357963f0488e126bd41a8d1e5c`;

    const functionForJSON = (responseObject) => {
      if (responseObject.status !== 200) {
        throw new Error("Internal Server Error");
      }
      return responseObject.json();
    };

    const functionForApplication = (oneApiData) => {
      const currentDayData = getCurrentDayWeather(oneApiData);
      const forecastDataArray = getForecastData(oneApiData);

      renderCurrentCardComponent(currentDayData, cityName);
      renderForecastCardComponent(forecastDataArray);
      $("#future-weather-heading")
        .append(`<h2 class="row px-3 m-0 fw-bold forecast-heading">
    5 Day Forecast:
  </h2>`);
    };

    const functionToHandleError = () => {
      $("#current-weather").empty();
      $("#forecastCardDiv").empty();
      createErrorMessage();
    };

    fetch(oneApiUrl)
      .then(functionForJSON)
      .then(functionForApplication)
      .catch(functionToHandleError);
  };

  const functionToHandleError = (errorObject) => {
    $("#current-weather").empty();
    $("#forecastCardDiv").empty();
    createErrorMessage();
  };

  fetch(weatherApiUrl)
    .then(functionForJSON)
    .then(functionForApplication)
    .catch(functionToHandleError);
};

// function called on load of the document
const onLoad = () => {
  const citiesFromLocalStorage = getFromLocalStorage();
  if (citiesFromLocalStorage) {
    renderCities(citiesFromLocalStorage);
  }
  const cityName = citiesFromLocalStorage[0];
  if (cityName) {
    $(".start-div").remove();
    fetchWeatherData(cityName);
  }
};

$("#searchHistoryDiv").click(onClick);
$("#cityForm").submit(onSearch);
$(document).ready(onLoad);
