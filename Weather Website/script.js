const apiKey = "da367fc24ba793de8eff595872d99280";
const weatherApiUrl = "https://api.openweathermap.org/data/2.5/weather?units=metric&q=";
const timezoneApiUrl = "https://api.timezonedb.com/v2.1/get-time-zone";
const searchForm = document.querySelector(".search");
const searchBox = document.querySelector(".search input");
const searchBtn = document.querySelector(".search button");
const weatherDisplay = document.querySelector('.weather-display');
const Icon = document.querySelector(".icon");
const defaultCity = "Guadalajara";
let timezoneTimer = null;


localStorage.clear();

async function updateWeatherData(city) {
  try {  
    const storedData = JSON.parse(localStorage.getItem('Current Weather'));
    if (storedData && storedData[city.toLowerCase().trim()]) {
      const cityData = storedData[city.toLowerCase().trim()];
      document.querySelector(".city").innerHTML = cityData.city;
      document.querySelector(".temp").innerHTML = cityData.temp;
      document.querySelector(".humidity").innerHTML = cityData.humidity;
      document.querySelector(".wind").innerHTML = cityData.wind_speed;
  
      if (cityData.icon == "Clouds") {
        Icon.src = "clouds.png";
      } else if (cityData.icon == "Clear") {
        Icon.src = "sunny.png";
      } else if (cityData.icon == "Rain") {
        Icon.src = "rain.png";
      } else if (cityData.icon == "Drizzle") {
        Icon.src = "drizzle.png";
      } else if (cityData.icon == "Snow") {
        Icon.src = "snowy.png";
      } else if (cityData.icon == "Mist") {
        Icon.src = "mist.png";
      } else if (cityData.icon == "Haze") {
        Icon.src = "haze.png";  
      }
      console.log('Weather Data accessed from localStorage and Database');
      clearInterval(timezoneTimer); 
      return;
    }

    const weatherResponse = await fetch(`${weatherApiUrl}${city}&appid=${apiKey}`);
    const weatherData = await weatherResponse.json();
    
    if (weatherResponse.status === 404) {
      document.querySelector(".error").textContent = "";
      document.querySelector(".city").textContent = "";
      document.querySelector(".temp").textContent = "--";
      document.querySelector(".humidity").textContent = "--";
      document.querySelector(".wind").textContent = "--";
      Icon.src = "";
      return;
    }

    console.log('Weather fetched from API/Internet');
        
    const timezoneResponse = await fetch(`${timezoneApiUrl}?key=4IQNGNYZRIXT&format=json&by=position&lat=${weatherData.coord.lat}&lng=${weatherData.coord.lon}`);
    const timezoneData = await timezoneResponse.json();
    
    document.querySelector(".error").innerHTML = "";
    document.querySelector(".city").innerHTML = weatherData.name;
    document.querySelector(".temp").innerHTML = Math.round(weatherData.main.temp) + "°C";
    document.querySelector(".humidity").innerHTML = weatherData.main.humidity + "%";
    document.querySelector(".wind").innerHTML = Math.round(weatherData.wind.speed) + "km/h";

    if (weatherData.weather[0].main == "Clouds") {
      Icon.src = "clouds.png";
    } else if (weatherData.weather[0].main == "Clear") {
      Icon.src = "sunny.png";
    } else if (weatherData.weather[0].main == "Rain") {
      Icon.src = "rain.png";
    } else if (weatherData.weather[0].main == "Drizzle") {
      Icon.src = "drizzle.png";
    } else if (weatherData.weather[0].main == "Snow") {
      Icon.src = "snowy.png";
    } else if (weatherData.weather[0].main == "Mist") {
      Icon.src = "mist.png";
    } else if (weatherData.weather[0].main == "Haze") {
      Icon.src = "haze.png";  
    }


    const weatherForData = {
      city: weatherData.name,
      temp: Math.round(weatherData.main.temp) + "°C",
      humidity: weatherData.main.humidity + "%",
      wind_speed: Math.round(weatherData.wind.speed) + "km/h",
      icon: weatherData.weather[0].main,
      date_recorded: new Date().toISOString()
    };
    
    storeWeatherDataInDatabase(city, weatherForData); 

    let storedWeatherData = JSON.parse(localStorage.getItem('Current Weather')) || {};
    storedWeatherData[city.toLowerCase().trim()] = weatherForData;
    localStorage.setItem('Current Weather', JSON.stringify(storedWeatherData));

    async function storeWeatherDataInDatabase(city, weatherForData) {
      const postData = {
        city: city,
        weatherData: weatherForData,
      };
    
      try {
        const response = await fetch("store_weather_data.php", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(postData),
        });
    
        if (response.ok) {
          const result = await response.json();
          // Handle success response if needed
        } else {
          console.error("Error storing weather data:", response.statusText);
          // Handle error response if needed
        }
      } catch (error) {
        // Handle any exceptions
      } 
    } 
    clearInterval(timezoneTimer);
    updateDateTime(timezoneData.zoneName);   

  } catch (error) {

    const data = localStorage.getItem('Current Weather');
    if (!data) {
      
      return
    }

    const parsed = JSON.parse(data);
    const cityData = parsed[city.toLowerCase().trim()];
    if (cityData) {
      document.querySelector(".city").innerHTML = cityData.city;
      document.querySelector(".temp").innerHTML = cityData.temp;
      document.querySelector(".humidity").innerHTML = cityData.humidity;
      document.querySelector(".wind").innerHTML = cityData.wind_speed;
  
      if (cityData.icon == "Clouds") {
        Icon.src = "clouds.png";
      } else if (cityData.icon == "Clear") {
        Icon.src = "sunny.png";
      } else if (cityData.icon == "Rain") {
        Icon.src = "rain.png";
      } else if (cityData.icon == "Drizzle") {
        Icon.src = "drizzle.png";
      } else if (cityData.icon == "Snow") {
        Icon.src = "snowy.png";
      } else if (cityData.icon == "Mist") {
        Icon.src = "mist.png";
      } else if (cityData.icon == "Haze") {
        Icon.src = "haze.png";  
      }
      console.log('Current Weather accessed from localStorage')
    } else {
      clearInterval(timezoneTimer);
      window.alert('No internet connection available')
    }
  }
}

const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const monthsOfYear = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
function updateDateTime(timezone) {
  const now = new Date();
  const locationTime = new Date(now.toLocaleString("en-US", { timeZone: timezone }));

  const dayName = daysOfWeek[locationTime.getDay()];
  const monthName = monthsOfYear[locationTime.getMonth()];
  const dayNum = locationTime.getDate();
  const year = locationTime.getFullYear();
  const hour = locationTime.getHours();
  const minutes = locationTime.getMinutes();
  const seconds = locationTime.getSeconds();
  const period = hour >= 12 ? "PM" : "AM";

  document.getElementById("dayname").textContent = dayName;
  document.getElementById("Month").textContent = monthName;
  document.getElementById("daynum").textContent = dayNum;
  document.getElementById("year").textContent = year;
  document.getElementById("hour").textContent = formatTime(hour);
  document.getElementById("minutes").textContent = formatTime(minutes);
  document.getElementById("seconds").textContent = formatTime(seconds);
  document.getElementById("period").textContent = period;

  timezoneTimer = setTimeout(() => updateDateTime(timezone), 1000);
}


function formatTime(time) {
  return time < 10 ? "0" + time : time;
}


updateWeatherData(defaultCity);

document.addEventListener('DOMContentLoaded', () => {
  searchBtn.addEventListener('click', () => {
    const city = searchBox.value.trim();
    updateWeatherData(city);
  });
});
