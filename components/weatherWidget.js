const API_KEY = "c1bb4d45b21ab0e08c268d9378516e88";

function getWeatherData(degree, icon) {
  navigator.geolocation.getCurrentPosition((location) => {
    let { latitude: lat, longitude: long } = location.coords;
    fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${long}&units=metric&appid=${API_KEY}`
    )
      .then((res) => res.json())
      .then((data) => {
        showWeather(data, degree, icon);
      });
  });
}

function showWeather(data, degree, icon) {
  let { main } = data.weather[0];
  icon.setAttribute("src", `./assets/icons/${main}.png`);

  let temp = Math.trunc(data.main.temp);
  degree.textContent = `${temp}\u00B0`;
}

export default getWeatherData;
