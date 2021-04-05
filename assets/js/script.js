// function for when the submit button is clicked
const onSubmit = (event) => {
  // event.preventDefault();
  const cityName = $("#cityInput").val();
  storeCityNames(cityName);
  fetchWeatherData(cityName);
};

const storeCityNames = (cityName) => {
  if (cityName !== "") {
    const cityNamesArray = getFromLocalStorage();
    cityNamesArray.push(cityName);
    localStorage.setItem("cityNames", JSON.stringify(cityNamesArray));
  } else {
    console.log("You must enter a city name");
  }
};

const renderCities = (citiesFromLocalStorage) => {
  $(citiesFromLocalStorage).each(constructListItem);
};

const constructListItem = (index, cityName) => {
  const listItem = `<li class="list-group-item">${
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

// function for clicking on search history
const onClick = (event) => {
  const cityName = event.target.textContent;
  $("#current-weather").empty();
  $("#forecastCardDiv").empty();
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

// set object for current weather card
const getCurrentDayWeather = (oneApiData) => {
  convertTemperature(oneApiData.current.temp);
  convertDateTime(oneApiData.current.dt);
  return {
    date: [date],
    iconURL: `http://openweathermap.org/img/wn/${oneApiData.current.weather[0].icon}@2x.png`,
    temperature: tempInCelcius,
    humidity: oneApiData.current.humidity,
    windSpeed: oneApiData.current.wind_speed,
    uvIndex: oneApiData.current.uvi,
  };
};

// iterate over forecast data array and set object
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
      iconURL: `http://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png`,
      temperature: tempInCelcius,
      humidity: item.humidity,
    },
  ];
  return forecastObject;
};

const renderCurrentCardComponent = (currentDayData, cityName) => {
  const currentCardComponent = `<h2 class="mt-4 current-city" id="cityName">${
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

const fetchWeatherData = (cityName) => {
  const weatherApiUrl = `http://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=785940357963f0488e126bd41a8d1e5c`;

  const functionForJSON = (currentDayData) => {
    return currentDayData.json();
  };

  const functionForApplication = (currentDayData) => {
    const cityLonLat = currentDayData.coord;
    const oneApiUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${cityLonLat.lat}&lon=${cityLonLat.lon}&appid=785940357963f0488e126bd41a8d1e5c`;

    const functionForJSON = (oneApiData) => {
      return oneApiData.json();
    };

    const functionForApplication = (oneApiData) => {
      const currentDayData = getCurrentDayWeather(oneApiData);
      const forecastDataArray = getForecastData(oneApiData);

      renderCurrentCardComponent(currentDayData, cityName);
      renderForecastCardComponent(forecastDataArray);
    };

    const functionToHandleError = (errorObject) => {
      // handle your error here according to your application
    };

    fetch(oneApiUrl)
      .then(functionForJSON)
      .then(functionForApplication)
      .catch(functionToHandleError);
  };

  const functionToHandleError = (errorObject) => {
    // handle your error here according to your application
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
  const cityName = citiesFromLocalStorage[citiesFromLocalStorage.length - 1];
  fetchWeatherData(cityName);
};

$("#searchHistoryDiv").click(onClick);
$("#cityForm").submit(onSubmit);
$(document).ready(onLoad);
