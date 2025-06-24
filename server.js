const backendAPI = "https://weather-api-backend-wsi5.onrender.com/api/weather";

const searchBox = document.querySelector(".search input");
const searchBtn = document.querySelector(".search button");
const weatherIcon = document.querySelector(".weather-icon");
const unitToggleBtn = document.getElementById("toggle-unit");
const tempElement = document.querySelector(".temp");
const feelsLikeElement = document.querySelector(".feels-like");

let isCelsius = true;
let currentWeatherData = null;

// Confetti particles (unchanged)
function createConfetti() {
  const confettiContainer = document.querySelector('.particles');
  const colors = ['#ff0000', '#ff7f00', '#ffff00', '#00ff00', '#0000ff', '#4b0082', '#9400d3'];
  
  for (let i = 0; i < 100; i++) {
    const confetti = document.createElement('div');
    confetti.style.position = 'absolute';
    confetti.style.width = Math.random() * 10 + 5 + 'px';
    confetti.style.height = Math.random() * 10 + 5 + 'px';
    confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
    confetti.style.borderRadius = Math.random() > 0.5 ? '50%' : '0';
    confetti.style.left = Math.random() * 100 + 'vw';
    confetti.style.top = '-20px';
    confetti.style.opacity = Math.random() * 0.5 + 0.5;
    confetti.style.transform = `rotate(${Math.random() * 360}deg)`;
    confetti.style.animation = `fall ${Math.random() * 3 + 2}s linear forwards`;
    
    const keyframes = `
      @keyframes fall {
        to {
          transform: translateY(105vh) rotate(${Math.random() * 720}deg);
          opacity: 0;
        }
      }
    `;
    
    const style = document.createElement('style');
    style.innerHTML = keyframes;
    document.head.appendChild(style);
    
    confettiContainer.appendChild(confetti);
    
    setTimeout(() => {
      confetti.remove();
      style.remove();
    }, 5000);
  }
}

// Background animation (unchanged)
function animateBackgroundChange() {
  gsap.to("body", {
    duration: 2,
    backgroundPosition: "100% 50%",
    ease: "none",
    onComplete: function() {
      gsap.set("body", { backgroundPosition: "0% 50%" });
    }
  });
}

// Update weather on UI
function updateWeather(data) {
  currentWeatherData = data;
  const tempC = data.main.temp;
  const feelsLikeC = data.main.feels_like;

  const displayTemp = isCelsius ? Math.round(tempC) : Math.round((tempC * 9/5) + 32);
  const displayFeelsLike = isCelsius ? Math.round(feelsLikeC) : Math.round((feelsLikeC * 9/5) + 32);

  tempElement.innerHTML = `${displayTemp}°<span class="unit">${isCelsius ? 'C' : 'F'}</span>`;
  feelsLikeElement.innerHTML = `Feels Like ${displayFeelsLike}°<span class="unit">${isCelsius ? 'C' : 'F'}</span>`;

  document.querySelector(".city").innerText = data.name;
  document.querySelector(".humidity").innerText = data.main.humidity + "%";

  const windSpeed = isCelsius ? 
    Math.round(data.wind.speed * 3.6) : 
    Math.round(data.wind.speed * 2.237);
  document.querySelector(".wind").innerText = windSpeed + (isCelsius ? " km/h" : " mph");

  document.querySelector(".country").innerText = data.sys.country || '';

  const weather = data.weather[0].main;
  const icons = {
    Clouds: "cloud-sun",
    Clear: "sun",
    Rain: "cloud-rain",
    Drizzle: "cloud-rain",
    Mist: "smog",
    Snow: "snowflake",
    Thunderstorm: "bolt"
  };

  const iconElement = document.createElement('i');
  iconElement.className = `fas fa-${icons[weather] || 'cloud'} weather-icon`;
  iconElement.style.fontSize = '80px';

  const iconColors = {
    Clear: '#ffcc00',
    Clouds: '#ffffff',
    Rain: '#00aaff',
    Drizzle: '#66ccff',
    Thunderstorm: '#ffaa00',
    Snow: '#ffffff',
    Mist: '#aaccff'
  };
  iconElement.style.color = iconColors[weather] || '#ffffff';
  iconElement.style.filter = `drop-shadow(0 0 10px ${iconColors[weather] || '#ffffff'}80)`;

  document.querySelector('.weather-icon-container').innerHTML = '';
  document.querySelector('.weather-icon-container').appendChild(iconElement);

  document.body.className = weather.toLowerCase();
  animateBackgroundChange();

  const now = new Date();
  const utc = now.getTime() + now.getTimezoneOffset() * 60000;
  const localTime = new Date(utc + (data.timezone * 1000));

  let hours = localTime.getHours();
  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12 || 12;
  const minutes = localTime.getMinutes().toString().padStart(2, '0');
  const timeString = `${hours}:${minutes} ${ampm}`;

  let localTimeEl = document.querySelector(".local-time");
  if (!localTimeEl) {
    localTimeEl = document.createElement("h3");
    localTimeEl.className = "local-time rainbow-text";
    document.querySelector(".weather").appendChild(localTimeEl);
  }
  localTimeEl.innerHTML = `Local Time: <span class="time-display">${timeString}</span>`;

  document.querySelector(".weather").style.display = "block";
  document.querySelector(".error").style.display = "none";

  gsap.from(".weather > *", {
    duration: 0.5,
    opacity: 0,
    y: 20,
    stagger: 0.1,
    ease: "power2.out",
    onStart: createConfetti
  });

  gsap.to(tempElement, {
    duration: 0.5,
    scale: 1.2,
    color: getRandomRainbowColor(),
    yoyo: true,
    repeat: 1,
    ease: "power1.inOut"
  });
}

function getRandomRainbowColor() {
  const colors = ['#ff0000', '#ff7f00', '#ffff00', '#00ff00', '#0000ff', '#4b0082', '#9400d3'];
  return colors[Math.floor(Math.random() * colors.length)];
}

// ✅ Final fetch function with backend API
async function checkWeather(city) {
  if (!city || city.trim().length < 3) {
    alert("Please enter a valid city name.");
    return;
  }

  const units = isCelsius ? "metric" : "imperial";
  try {
    const response = await fetch(`${backendAPI}?city=${encodeURIComponent(city)}&units=${units}`);

    if (!response.ok) {
      throw new Error("City not found or invalid request");
    }

    const data = await response.json();
    data.units = units;
    updateWeather(data);

  } catch (error) {
    console.error("Error fetching weather data:", error);
    document.querySelector(".error").style.display = "block";
    document.querySelector(".weather").style.display = "none";
  }
}

// Events
searchBtn.addEventListener("click", () => {
  const city = searchBox.value.trim();
  checkWeather(city);
});

searchBox.addEventListener("keypress", e => {
  if (e.key === "Enter") {
    const city = searchBox.value.trim();
    checkWeather(city);
  }
});

unitToggleBtn.addEventListener("click", () => {
  isCelsius = !isCelsius;
  unitToggleBtn.innerText = isCelsius ? "Switch to °F" : "Switch to °C";
  if (currentWeatherData) {
    updateWeather(currentWeatherData);
  }
});

// Optional: check weather based on geolocation on page load
