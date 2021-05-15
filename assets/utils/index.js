const RESULTS_URL = "./results.html?city=";

const handleSearch = (event) => {
  event.preventDefault();

  const cityName = $("#cityInput").val();

  if (cityName) {
    window.location.href = `${RESULTS_URL}${cityName}`;
  } else {
    $("#cityInput").addClass("error");
  }
};

$("#cityForm").on("submit", handleSearch);
