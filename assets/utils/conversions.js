const convertTemperature = (kelvin) => Math.floor(kelvin - 273.15);

const convertDateTime = (dateString) =>
  new Date(dateString * 1000).toLocaleDateString("en-UK");

const convertWindSpeed = (speed) => Math.round(speed * 2.237 * 10) / 10;

export { convertTemperature, convertDateTime, convertWindSpeed };
