
const weatherCodes = {
  0: "sun.png", 1: "partly-cloudy.png", 2: "partly-cloudy.png",
  3: "cloudy.png", 45: "fog.png", 48: "fog.png",
  51: "drizzle.png", 53: "drizzle.png", 55: "drizzle.png",
  61: "rain.png", 63: "rain.png", 65: "heavy-rain.png",
  71: "snow.png", 73: "snow.png", 75: "heavy-snow.png",
  80: "shower.png", 81: "shower.png", 82: "heavy-shower.png",
  95: "thunderstorm.png", 96: "thunderstorm.png", 99: "thunderstorm.png"
};

function main(){
  document.getElementById('search-btn').onclick = searchByCity;
  document.getElementById('locate-btn').onclick = geolocate;
  geolocate();
}

function geolocate(){
  if(!navigator.geolocation){
    showError("Géolocalisation non supportée");
    return;
  }
  navigator.geolocation.getCurrentPosition(
    pos => fetchWeather(pos.coords.latitude, pos.coords.longitude),
    () => showError("Impossible d'obtenir la position")
  );
}

async function searchByCity(){
  const name = document.getElementById('city-input').value.trim();
  if(!name) return showError("Entrez une ville");
  const r = await fetch(
    `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(name)}&count=1`
  );
  const d = await r.json();
  if(!d.results?.length) return showError("Ville introuvable");
  const { latitude, longitude } = d.results[0];
  fetchWeather(latitude, longitude);
}

async function fetchWeather(lat, lon){
  const r = await fetch(
    `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,weather_code`
  );
  const d = await r.json();
  const cur = d.current;
  if(!cur) return showError("Données météo indisponibles");
  display(cur.temperature_2m, cur.weather_code);
}

function display(temp, code){
  const img = weatherCodes[code] || "unknown.png";
  document.getElementById('weather-container').innerHTML = `
    <div class="weather-card">
      <img src="${img}" alt="" class="icon">
      <div class="temp">${Math.round(temp)}°C</div>
    </div>`;
}

function showError(msg){
  document.getElementById('weather-container').innerHTML = `<p>${msg}</p>`;
}

document.addEventListener('DOMContentLoaded', main);
