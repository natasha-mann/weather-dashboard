const renderCurrentCardComponent = (currentDayData, cityName) => {
  const currentCardComponent = `
  <div class = "card border-0 bg-transparent px-3">
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
  </div>
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
    <div class="card future-card py-3 text-center">
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

export {
  renderCurrentCardComponent,
  renderForecastCardComponent,
  renderCities,
};
