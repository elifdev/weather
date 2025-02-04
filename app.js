const apiKey = "YOUR_API_KEY"; 
const apiUrl = "https://api.openweathermap.org/data/2.5/weather?units=metric&q=";

const searchBox = document.querySelector(".search input");
const searchBtn = document.querySelector(".search button");
const weatherIcon = document.querySelector(".weather-icon");
const card = document.querySelector(".card");

const weatherIcons = {
    "Clouds": "img/cloud2.png",
    "Clear": "img/sun.png",
    "Rain": "img/rain.png",
    "Drizzle": "img/cloud2.png",
    "Snow": "img/snow.png"
};

const backgrounds = {
    "Clear": "url('../img/sunny.jpg')",
    "Clouds": "url('../img/cloudly.jpg')",
    "Rain": "url('../img/rain1.jpg')",
    "Snow": "url('../img/snowy.jpg')"
};

function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(position => {
            let lat = position.coords.latitude;
            let lon = position.coords.longitude;
            checkWeatherByCoords(lat, lon);
        }, error => {
            console.error(error);
            alert("Location information not available.");
        });
    } else {
        alert("Not supported in this browser.");
    }
}

async function fetchWeather(url) {
    try {
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error('Weather data not found');
        }

        return await response.json();
    } catch (error) {
        console.error(error);
        document.querySelector(".error").style.display = "block";
        document.querySelector(".weather").style.display = "none";
    }
}

async function checkWeatherByCoords(lat, lon) {
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`;
    const data = await fetchWeather(url);
    if (data) updateWeatherUI(data);
}

async function checkWeather(city) {
    if (!city) return; 

    const url = `${apiUrl}${city}&appid=${apiKey}`;
    const data = await fetchWeather(url);
    if (data) updateWeatherUI(data);

    searchBox.value = ""; 
}

function updateWeatherUI(data) {
    document.querySelector(".city").innerHTML = data.name;
    document.querySelector(".temp").innerHTML = Math.round(data.main.temp) + "°C";
    document.querySelector(".humidity").innerHTML = data.main.humidity + "%";
    document.querySelector(".wind").innerHTML = data.wind.speed + "km/h";

    let sunrise = new Date(data.sys.sunrise * 1000).toLocaleTimeString();
    let sunset = new Date(data.sys.sunset * 1000).toLocaleTimeString();
    document.querySelector(".sunrise").innerHTML = "Sunrise: " + sunrise;
    document.querySelector(".sunset").innerHTML = "Sunset: " + sunset;

    let weatherCondition = data.weather[0].main;
    card.style.backgroundImage = backgrounds[weatherCondition] || "url('img/sunny.jpg')";
    weatherIcon.src = weatherIcons[weatherCondition] || "img/sun.png";

    document.querySelector(".error").style.display = "none";
    document.querySelector(".weather").style.display = "block";
}

searchBtn.addEventListener("click", () => checkWeather(searchBox.value));
searchBox.addEventListener("keypress", (event) => {
    if (event.key === "Enter") checkWeather(searchBox.value);
});

getLocation();
