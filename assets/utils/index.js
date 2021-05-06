const RESULTS_URL = "./results.js?city=";

const handleSearch = (event) => {
  event.preventDefault();

  const cityName = $("#cityInput").val();

  if (cityName) {
    window.location.href = `${RESULTS_URL}${cityName}`;
  } else {
    $("#cityInput").addClass("error");
  }
};

const initialisePage = () => {
  initialiseLocalStorage();
};

$("#start-form").on("submit", handleSearch);
$(document).ready(initialisePage);
