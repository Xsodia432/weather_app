import { apiKey } from "./config.js";
async function getWeatherData(loc) {
  try {
    const weatherData = await fetch(
      `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${loc}?unitGroup=us&key=${apiKey}&contentType=json`,
      {
        mode: "cors",
      }
    );
    if (!weatherData.status) {
      throw new Error(weatherData.status);
    }
    document.querySelector(".weather-data-container").style = "display:block";
    document.querySelector(".loading-screen").style = "display:none";
    const data = await weatherData.json();
    return data;
  } catch (err) {
    console.log(err);
  }
}
async function getWeather(loc) {
  const weatherDays = await getWeatherData(loc);
  const weatherNowEle = document.querySelector(".weather-now");
  document.getElementById("location-name").textContent = loc;
  document.querySelector(".content-container").style.backgroundImage =
    weatherDays.currentConditions.datetime.split(":")[0] > 5 &&
    weatherDays.currentConditions.datetime.split(":")[0] < 18
      ? "url(./day.png)"
      : "url(./night.png)";
  weatherNowEle.querySelector("img").src = getIconCond(
    weatherDays.currentConditions.icon,
    weatherDays.currentConditions.datetime
  );

  weatherNowEle.querySelectorAll("span")[0].innerHTML = `<strong>${convertTemp(
    weatherDays.currentConditions.temp
  )}</strong><sup><sup>o</sup>C</sup>`;
  weatherNowEle.querySelectorAll("span")[1].textContent =
    weatherDays.description;
  document
    .querySelector(".weather-upcoming")
    .querySelectorAll("div")
    .forEach((element, index) => {
      const daysData = weatherDays.days[index];
      element.querySelectorAll("span")[0].textContent =
        index === 0 ? "Today" : dateFns.format(daysData.datetime, "eee");
      element.querySelector("img").src = getIconCond(
        daysData.icon,
        weatherDays.currentConditions.datetime
      );
      element.querySelectorAll("span")[1].innerHTML = `${convertTemp(
        daysData.tempmax
      )}<sup>o</sup>`;
      element.querySelectorAll("span")[2].innerHTML = `${convertTemp(
        daysData.tempmin
      )}<sup>o</sup>`;
    });
}
const convertTemp = (temp) => {
  return Math.round(Math.floor((temp - 32) * (5 / 9)));
};
const getIconCond = (cond, locTime) => {
  const cTime = locTime.split(":")[0];
  console.log();
  if (cTime > 5 && cTime < 18) {
    if (cond.includes("rain")) return "./rain.png";
    if (cond.includes("cloudy")) return "./cloudy.png";
    if (cond.includes("clear")) return "./clear.png";
  } else {
    if (cond.includes("rain")) return "./night-rain.png";
    if (cond.includes("cloudy")) return "./night-cloudy.png";
    if (cond.includes("clear")) return "./night-clear.png";
  }
};

getWeather("manila");
document.getElementById("form-location").addEventListener("submit", (event) => {
  event.preventDefault();
  document.querySelector(".loading-screen").style = "display:block";
  document.querySelector(".weather-data-container").style = "display:none";
  const loc = event.target.querySelector("input[name='loc']").value;
  if (loc === "") return;
  getWeather(loc);
});
