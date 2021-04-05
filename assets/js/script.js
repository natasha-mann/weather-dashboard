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

const getCurrentDayWeather = (oneApiData) => {
  return {
    date: oneApiData.current.dt,
    iconURL: `http://openweathermap.org/img/wn/${oneApiData.current.weather[0].icon}@2x.png`,
    temperature: oneApiData.current.temp,
    humidity: oneApiData.current.humidity,
    windSpeed: oneApiData.current.wind_speed,
    uvIndex: oneApiData.current.uvi,
  };
};

const getForecastData = (oneApiData) => {
  // iterate and construct the return data array
  const forecastData = oneApiData.daily.map(constructForecastObject);
  return forecastData;
};

const constructForecastObject = (item) => {
  const forecastObject = [
    {
      date: item.dt,
      iconURL: `http://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png`,
      temperature: item.temp.day,
      humidity: item.humidity,
    },
  ];
  return forecastObject;
};

const renderCurrentCardComponent = (currentDayData, cityName) => {
  const currentDate = currentDayData.date;
  let [date, month, year] = new Date(currentDate * 1000)
    .toLocaleDateString("en-UK")
    .split(" / ");
  const currentCardComponent = `<h2 class="mt-4" id="cityName">${cityName} <span id="currentDate">${[
    date,
  ]}</span
  ><span id="weatherIcon"><img src="${currentDayData.iconURL}"/> </span>
</h2>
<div id="temp">Temperature: ${currentDayData.temperature} </div>
<div id="humidity">Humidity: ${currentDayData.humidity} </div>
<div id="windSpeed">Wind Speed: ${currentDayData.windSpeed} </div>
<div
>UV Index: <span id="uv" class="uv"> ${currentDayData.uvIndex}</span></div>
</div>`;
  $("#current-weather").append(currentCardComponent);
  if (currentDayData.uvIndex >= 1 && currentDayData.uvIndex < 3) {
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

const renderForecastCardComponent = (forecastData) => {
  // from current data build the current card component
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
      // renderForecastCardComponent(forecastData);
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

$("#cityForm").submit(onSubmit);
$(document).ready(onLoad);
