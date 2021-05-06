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

// const initialisePage = () => {
//   initialiseLocalStorage();
// };

$("#cityForm").on("submit", handleSearch);
// $(document).ready(initialisePage);
