// configuración de la api
const API_KEY = 'c9092ea0057d487298533849251602 ';
const API_BASE_URL = 'https://api.weatherapi.com/v1';
let currentUnit = 'C';
let currentTemp = 0;


// Función para obtener el clima actual
async function getWeather(city = '') {
    showLoading();
    try {
        // Si no se proporciona ciudad, intentar obtener la ubicación del usuario
        if (!city) {
            const position = await getCurrentPosition();
            city = `${position.coords.latitude},${position.coords.longitude}`;
        }

        const response = await fetch(
            `${API_BASE_URL}/forecast.json?key=${API_KEY}&q=${city}&days=5&aqi=no`
        );
        const data = await response.json();

        updateCurrentWeather(data.current, data.location);
        updateForecast(data.forecast.forecastday);
    } catch (error) {
        console.error('Error:', error);
        alert('Error al obtener el clima. Por favor, intenta de nuevo.');
    } finally {
        hideLoading();
    }
}

// Función para obtener la ubicación actual
function getCurrentPosition() {
    return new Promise((resolve, reject) => {
        if (!navigator.geolocation) {
            reject(new Error('Geolocalización no soportada'));
        }
        navigator.geolocation.getCurrentPosition(resolve, reject);
    });
}

// efecto de partículas
function createParticles() {
    const container = document.getElementById('particles');
    const particleCount = 50;

    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';

        // Posición aleatoria
        particle.style.left = Math.random() * 100 + 'vw';
        particle.style.top = Math.random() * 100 + 'vh';

        // Tamaño aleatorio
        const size = Math.random() * 4 + 2;
        particle.style.width = size + 'px';
        particle.style.height = size + 'px';

        // duración y retraso aleatorio de la animación
        const duration = Math.random() * 20 + 10;
        const delay = Math.random() * 10;
        particle.style.animation = `float ${duration}s ${delay}s infinite linear`;

        container.appendChild(particle);
    }
}

// actualizar el fondo según el clima
function updateBackgroundByWeather(condition) {
    const body = document.body;
    const isDark = body.classList.contains('dark-mode');

    let gradientColors;
    switch (condition.toLowerCase()) {
        case 'clear':
        case 'sunny':
            gradientColors = isDark ?
                ['#2c3e50', '#3498db', '#2980b9', '#1a5276'] :
                ['#FDB813', '#F7931E', '#F15A24', '#F7931E'];
            break;
        case 'cloudy':
        case 'overcast':
            gradientColors = isDark ?
                ['#2c3e50', '#34495e', '#2c3e50', '#34495e'] :
                ['#a8c0ff', '#3f4c6b', '#606c88', '#3f4c6b'];
            break;
        case 'rain':
        case 'drizzle':
            gradientColors = isDark ?
                ['#1a2a6c', '#2a3d66', '#2c3e50', '#1a2a6c'] :
                ['#00d2ff', '#3a7bd5', '#00d2ff', '#3a7bd5'];
            break;
        default:
            gradientColors = isDark ?
                ['#2c3e50', '#3498db', '#2980b9', '#1a5276'] :
                ['#ee7752', '#e73c7e', '#23a6d5', '#23d5ab'];
    }

    body.style.background = `linear-gradient(-45deg, ${gradientColors.join(', ')})`;
    body.style.backgroundSize = '400% 400%';
}


//función updateCurrentWeather
function updateCurrentWeather(current, location) {
    currentTemp = current.temp_c;
    document.getElementById('location').textContent = `${location.name}, ${location.country}`;
    document.getElementById('temperature').textContent = `${currentTemp}°C`;
    document.getElementById('description').textContent = current.condition.text;
    document.getElementById('humidity').textContent = `${current.humidity}%`;
    document.getElementById('wind').textContent = `${current.wind_kph} km/h`;
    document.getElementById('pressure').textContent = `${current.pressure_mb} hPa`;
    document.getElementById('visibility').textContent = `${current.vis_km} km`;
    document.getElementById('weatherIcon').src = `https:${current.condition.icon}`;

    // actualizar el fondo según la condición del clima
    updateBackgroundByWeather(current.condition.text);
}
// inicializar las partículas cuando se carga el documento
document.addEventListener('DOMContentLoaded', () => {
    createParticles();
    getWeather();

    document.getElementById('citySearch').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            searchWeather();
        }
    });
});

// Actualizar el pronóstico
function updateForecast(forecast) {
    const forecastContainer = document.getElementById('forecast');
    forecastContainer.innerHTML = '';

    forecast.forEach(day => {
        const date = new Date(day.date);
        const dayName = date.toLocaleDateString('es-ES', { weekday: 'long' });

        forecastContainer.innerHTML += `
             <div class="col-md-4">
                 <div class="forecast-card">
                     <h4>${dayName}</h4>
                     <div class="d-flex align-items-center">
                         <img src="https:${day.day.condition.icon}" alt="Clima" class="me-2">
                         <div>
                             <p class="mb-0">Máx: ${day.day.maxtemp_c}°C</p>
                             <p class="mb-0">Mín: ${day.day.mintemp_c}°C</p>
                         </div>
                     </div>
                     <p>${day.day.condition.text}</p>
                 </div>
             </div>
         `;
    });
}

// Alternar entre Celsius y Fahrenheit
function toggleTemperature() {
    const tempElement = document.getElementById('temperature');
    const toggleButton = document.querySelector('.btn-outline-primary');

    if (currentUnit === 'C') {
        const tempF = (currentTemp * 9 / 5) + 32;
        tempElement.textContent = `${tempF.toFixed(1)}°F`;
        toggleButton.textContent = 'Cambiar a °C';
        currentUnit = 'F';
    } else {
        tempElement.textContent = `${currentTemp}°C`;
        toggleButton.textContent = 'Cambiar a °F';
        currentUnit = 'C';
    }
}

// Búsqueda de ciudad
function searchWeather() {
    const city = document.getElementById('citySearch').value;
    if (city) {
        getWeather(city);
    }
}

// alternar el tema claro/oscuro
function toggleTheme() {
    document.body.classList.toggle('dark-mode');
    const icon = document.querySelector('.theme-toggle i');
    icon.classList.toggle('fa-moon');
    icon.classList.toggle('fa-sun');
}

// Funciones de carga
function showLoading() {
    document.querySelector('.loading').style.display = 'flex';
}

function hideLoading() {
    document.querySelector('.loading').style.display = 'none';
}

// Iniciar la aplicación
document.addEventListener('DOMContentLoaded', () => {
    getWeather();

    // Manejar búsqueda con Enter
    document.getElementById('citySearch').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            searchWeather();
        }
    });
});
