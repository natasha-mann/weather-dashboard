// function for when the submit button is clicked
const onSubmit = (event) => {
  event.preventDefault();
  const cityName = $("#cityInput").val();
  storeCityNames(cityName);
  // then get all weather data for cityName
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

const fetchWeatherData = (cityName) => {
  const weatherApiUrl = `http://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=785940357963f0488e126bd41a8d1e5c`;

  const functionForJSON = (responseObject) => {
    return responseObject.json();
  };

  const functionForApplication = (dataFromServer) => {
    console.log(dataFromServer);
    const cityLonLat = dataFromServer.coord;
    const oneApiUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${cityLonLat.lat}&lon=${cityLonLat.lon}&appid=785940357963f0488e126bd41a8d1e5c`;
  };

  fetch(weatherApiUrl).then(functionForJSON).then(functionForApplication);
  // .catch(functionToHandleError);
};

// function called on load of the document
const onLoad = () => {
  const citiesFromLocalStorage = getFromLocalStorage();
  if (citiesFromLocalStorage) {
    renderCities(citiesFromLocalStorage);
  }
  // get the last city name from citiesFromLocalStorage and store in variable called cityName
  // fetchAllWeatherData(cityName)
};

$("#cityForm").submit(onSubmit);
$(document).ready(onLoad);
