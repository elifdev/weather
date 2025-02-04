const apiKey = "YOUR_API_KEY";;
const apiUrl = "https://api.openweathermap.org/data/2.5/weather?units=metric&q=";

const searchBox = document.querySelector(".search input");
const searchBtn = document.querySelector(".search button");
const weatherIcon = document.querySelector(".weather-icon");
const card = document.querySelector(".card");

function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(position => {
            let lat = position.coords.latitude;
            let lon = position.coords.longitude;
            checkWeatherByCoords(lat, lon);
        });
    } else {
        alert("Location information not available");
    }
}

async function checkWeatherByCoords(lat, lon) {
    const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`);

    if (response.status == 404) {
        document.querySelector(".error").style.display = "block";
        document.querySelector(".weather").style.display = "none";
    } else {
        const data = await response.json();
        updateWeatherUI(data);
    }
}

async function checkWeather(city) {
    const response = await fetch(apiUrl + city + `&appid=${apiKey}`);

    if (response.status == 404) {
        document.querySelector(".error").style.display = "block";
        document.querySelector(".weather").style.display = "none";
    } else {
        const data = await response.json();
        console.log("API'den Gelen Veri:", data);
        updateWeatherUI(data);
    }

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
    card.style.backgroundImage = getBackgroundForWeather(weatherCondition);

    const weatherIcons = {
        "Clouds": "img/cloud2.png",
        "Clear": "img/sun.png",
        "Rain": "img/rain.png",
        "Drizzle": "img/cloud2.png",
        "Snow": "img/snow.png"
    };

    weatherIcon.src = weatherIcons[weatherCondition] || "img/sun.png";

    


    document.querySelector(".error").style.display = "none";
    document.querySelector(".weather").style.display = "block";
}

searchBtn.addEventListener("click", () => checkWeather(searchBox.value));
searchBox.addEventListener("keypress", (event) => {
    if (event.key === "Enter") checkWeather(searchBox.value);
});

function getBackgroundForWeather(condition) {
    const backgrounds = {
        "Clear": "url('../img/sunny.jpg')",
        "Clouds": "url('../img/cloudly.jpg')",
        "Rain": "url('../img/rain1.jpg')",
        "Snow": "url('../img/snowy.jpg')"
    };
    return backgrounds[condition] || "url('img/sunny.jpg')";
}

getLocation();
