// function for when the submit button is clicked
const onSubmit = (event) => {
  event.preventDefault();
  storeCityNames($("#cityInput").val());
  // find a way to update search history list on submit
  // then get all weather data for cityName
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
  // construct list item for each city name and append to #searchHistoryDiv
  console.log("i'm here");
};

const constructListItem = (index, cityName) => {
  const listItem = `<li class="list-group-item">${cityName}</li>`;
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
