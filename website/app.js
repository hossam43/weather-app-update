/* Global Variables */
// Create a new date instance dynamically with JS
const app = document.getElementById("weather-app");
const btn = document.getElementById("submit");
let fullDate = document.getElementById("time-date");
let cityName = document.getElementById("name");
let temp = document.getElementById("temp");
let condition = document.getElementById("condition");
let clouds = document.getElementById("clouds");
let humidity = document.getElementById("humidity");
let wind = document.getElementById("wind");
let icon = document.getElementById("icon");
// let form = document.getElementById("locationInput");
// let cities = document.querySelectorAll(".cities");
// defult citiy
let defaultCity = "London";

// function that will return the day of the week

let currentDate = new Date();
// Format the time as "HH:mm"
let formattedTime = currentDate.toLocaleTimeString([], {
  hour: "2-digit",
  minute: "2-digit",
});
// Format the date as "dddd,D MMM YY"
let formattedDate = currentDate.toLocaleDateString([], {
  weekday: "long",
  day: "numeric",
  month: "short",
  year: "numeric",
});
// Combine the time and date with a hyphen
let formattedDateTime = `${formattedTime}-${formattedDate}`;
// function to fetches and display the data from the weather api
const myApiKey = "0220d5d668111700ed629b8c4d5623ff&units=metric";

// Call the weather data on page load
window.addEventListener("load", async () => {
  const fullUrl = `https://api.openweathermap.org/data/2.5/weather?q=${defaultCity}&appid=${myApiKey}`;
  try {
    let temperature = await getUserData(fullUrl, "main.temp");
    let stateName = await getUserData(fullUrl, "name");
    let stateHumidity = await getUserData(fullUrl, "main.humidity");
    let stateCondition = await getUserData(fullUrl, "weather.0.main");
    let stateWind = await getUserData(fullUrl, "wind.speed");
    let stateClouds = await getUserData(fullUrl, "clouds.all");
    let stateIcon = await getUserData(fullUrl, "weather.0.icon");

    let dataObject = {
      date: formattedDateTime,
      temperature: temperature,
      stateName: stateName,
      humidity: stateHumidity,
      condition: stateCondition,
      wind: stateWind,
      clouds: stateClouds,
      icon: stateIcon,
    };
    await postWeatherData("/addweather", dataObject);
    upDateUI();
  } catch (error) {
    console.log(error, "ERROR");
  }
});
//generate weather data on click
btn.addEventListener("click", async () => {
  let search = document.getElementById("search").value;
  const fullUrl = `https://api.openweathermap.org/data/2.5/weather?q=${search}&appid=${myApiKey}`;
  try {
    let temperature = await getUserData(fullUrl, "main.temp");
    let stateName = await getUserData(fullUrl, "name");
    let stateHumidity = await getUserData(fullUrl, "main.humidity");
    let stateCondition = await getUserData(fullUrl, "weather.0.main");
    let stateWind = await getUserData(fullUrl, "wind.speed");
    let stateClouds = await getUserData(fullUrl, "clouds.all");
    let stateIcon = await getUserData(fullUrl, "weather.0.icon");

    // By storing the weather data in the dataObject, it becomes possible to sending it to the server, updating the UI
    let dataObject = {
      date: formattedDateTime,
      temperature: temperature,
      stateName: stateName,
      humidity: stateHumidity,
      condition: stateCondition,
      wind: stateWind,
      clouds: stateClouds,
      icon: stateIcon,
    };

    await postWeatherData("/addweather", dataObject);
    upDateUI();
  } catch (error) {
    console.log(error, "ERROR");
  }
});

// defining the get humadity function
const getUserData = async (url, property) => {
  try {
    const fullResponse = await fetch(url);
    const fullResponseJSON = await fullResponse.json();
    const data = getPropertyByPath(fullResponseJSON, property);
    console.log(fullResponseJSON);
    return data;
  } catch (error) {
    console.log(error, "an error occurred");
  }
};

const getPropertyByPath = (object, path) => {
  const properties = path.split(".");
  let value = object;
  for (const prop of properties) {
    value = value[prop];
  }
  return value;
};

// fetches weather data from the server, updates specific UI elements on the web page with the received data, and handles any potential errors
const upDateUI = async () => {
  const data = await (await fetch("http://localhost:5000/getweather")).json();
  try {
    temp.innerHTML = `${data.temperature}&degC`;
    fullDate.innerHTML = `${data.date}`;
    cityName.innerHTML = `${data.stateName}`;
    humidity.innerHTML = `${data.humidity}%`;
    condition.innerHTML = `${data.condition}`;
    wind.innerHTML = `${data.wind}km/h`;
    clouds.innerHTML = `${data.clouds}%`;
    // Construct the icon URL based on the `iconNumber` variable
    let dayOrnight = "";
    if (data.icon[2] == "n") {
      dayOrnight = "night";
    } else {
      dayOrnight = "day";
    }
    const iconUrl = `./icons/${dayOrnight}/${data.icon}.png`;
    // Set the `src` attribute of the `icon` image to the constructed URL
    icon.setAttribute("src", iconUrl);

    if (data.icon === `01${data.icon[2]}`) {
      app.style.backgroundImage = `url(./Images/${dayOrnight}/clear.jpg)`;
    } else if (
      data.icon >= `02${data.icon[2]}` &&
      data.icon <= `04${data.icon[2]}`
    ) {
      app.style.backgroundImage = `url(./Images/${dayOrnight}/clouds.jpg)`;
    } else if (data.icon === `10${data.icon[2]}`) {
      app.style.backgroundImage = `url(./Images/${dayOrnight}/lightrain.jpg)`;
    } else if (
      data.icon === `09${data.icon[2]}` ||
      data.icon === `11${data.icon[2]}`
    ) {
      app.style.backgroundImage = `url(./Images/${dayOrnight}/rain.jpg)`;
    } else if (data.icon === `13${data.icon[2]}`) {
      app.style.backgroundImage = `url(./Images/${dayOrnight}/snow.jpg)`;
    } else if (data.icon === `50${data.icon[2]}`) {
      app.style.backgroundImage = `url(./Images/${dayOrnight}/mist.jpg)`;
    } else {
      console.log(data.icon[2]);
    }
  } catch (error) {
    console.log("couldn't update user UI", error);
  }
};

// this is the function that will post the data to the server in /addweather route

const postWeatherData = async (url = "", postData = {}) => {
  const secondResponse = await fetch(url, {
    method: "POST",
    credentials: "same-origin",
    headers: { "Content-Type": "application/json" },
    //Conver the json object (dataObject) to be in a string format
    body: JSON.stringify(postData),
  });
};
