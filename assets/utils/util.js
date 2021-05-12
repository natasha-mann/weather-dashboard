const getFromLocalStorage = () => {
  const citiesFromLocalStorage = JSON.parse(localStorage.getItem("cityNames"));
  return citiesFromLocalStorage ? citiesFromLocalStorage : [];
};
