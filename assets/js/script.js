// function for when the submit button is clicked
const onSubmit = (event) => {
  event.preventDefault();
  storeCityNames($("#cityInput").val());
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
  // construct list item for each city name and append to #searchHistoryDiv
  console.log("i'm here");
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
  // read from local storage and store data in variable called citiesFromLocalStorage
  // if data is present call renderCities and pass the data from local storage
  // renderCities(citiesFromLocalStorage)
  // get the last city name from citiesFromLocalStorage and store in variable called cityName
  // fetchAllWeatherData(cityName)
};

$("#cityForm").submit(onSubmit);
$(document).ready(onLoad);
