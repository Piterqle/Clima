const weatherCodesMap = {
      0:  { desc: "Céu limpo",                         icon: "wi-day-sunny" },
      1:  { desc: "Predomínio de sol",                 icon: "wi-day-sunny-overcast" },
      2:  { desc: "Parcialmente nublado",             icon: "wi-day-cloudy" },
      3:  { desc: "Nublado",                           icon: "wi-cloud" },
      45: { desc: "Neblina",                           icon: "wi-fog" },
      48: { desc: "Neblina gelada",                   icon: "wi-fog" },
      51: { desc: "Garoa leve",                        icon: "wi-sprinkle" },
      53: { desc: "Garoa moderada",                    icon: "wi-sprinkle" },
      55: { desc: "Garoa intensa",                     icon: "wi-showers" },
      61: { desc: "Chuva fraca",                       icon: "wi-rain" },
      63: { desc: "Chuva moderada",                    icon: "wi-rain" },
      65: { desc: "Chuva forte",                       icon: "wi-heavy-showers" },
      80: { desc: "Pancada de chuva fraca",            icon: "wi-showers" },
      81: { desc: "Pancada de chuva moderada",         icon: "wi-showers" },
      82: { desc: "Pancada de chuva forte",            icon: "wi-storm-showers" },
      71: { desc: "Neve leve",                         icon: "wi-snow" },
      73: { desc: "Neve moderada",                     icon: "wi-snow" },
      75: { desc: "Neve forte",                        icon: "wi-snow-wind" },
      95: { desc: "Trovoadas",                         icon: "wi-thunderstorm" },
      96: { desc: "Trovoadas com granizo fraco",       icon: "wi-hail" },
      99: { desc: "Trovoadas com granizo forte",       icon: "wi-hail" }
};

const weeklyContainer = document.getElementById('weeklyContainer');
const day = (date, tempMax, tempMin) => {
    const dayCard = document.createElement('div');
    dayCard.classList.add('card', 'bg-transparent', 'p-2', 'text-white', 'mb-2', 'container-fluid');
    dayCard.innerHTML = `
        <div class="row">
            <div class="col-4">
                <p class="card-text fst-italic">${dateFormatter(date)}</p>
            </div>
            <div class="col-8 text-end">
                <p class="card-text fst-italic">${tempMax}°C / ${tempMin}°C</p>
            </div>
        </div>
    `;
    return dayCard;
};

function getLocationInfo() {
    var modal = new bootstrap.Modal(document.getElementById('locationModal'));
    if(!navigator.geolocation) {
        alert("Geolocation is not supported by your browser");
        return;
    }
    navigator.geolocation.getCurrentPosition(
        function(position) {
            modal.hide();
            const latitude  = position.coords.latitude;
            const longitude = position.coords.longitude;
            const cityResponse = axios.get(`https://api-bdc.io/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=pt`) 
            .then(function (response) { 
                const city = response.data.city || "Localização Desconhecida";    
                document.getElementById('city').innerText = city;
            }
                    )       
            .catch(function (error) {
                alert("Error fetching location data:", error);
            });
            const response = axios.get(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&daily=weather_code,windspeed_10m_max,winddirection_10m_dominant,temperature_2m_max,temperature_2m_min,precipitation_sum,precipitation_probability_max&hourly=relativehumidity_2m&forecast_days=7&timezone=auto`)
            .then(function (response) {
                const daily = response.data.daily;
                const humidity = response.data.hourly.relativehumidity_2m;
                const windSpeed = daily.windspeed_10m_max;
                const weatherCode = daily.weather_code;
                const temperature = daily.temperature_2m_max;
                const temperatureMin = daily.temperature_2m_min;    
                const dates = daily.time;
                
                document.getElementById('weatherIcon').className = `wi ${weatherCodesMap[weatherCode[0]].icon}`;    
                document.getElementById('date').innerText = dateFormatter(dates[0]);
                document.getElementById('temperature').innerText = `${temperature[0]}°C`;
                document.getElementById('description').innerText = `${weatherCodesMap[weatherCode[0]].desc} - ${temperature[0]}°C / ${temperatureMin[0]}°C` || "Descrição indisponível";
                document.getElementById('windSpeed').innerHTML = `Velocidade do Vento: <br> ${windSpeed[0]} m/s`;
                document.getElementById('probability').innerHTML = `Chuva: <br> ${daily.precipitation_probability_max[0]}%`;
                document.getElementById('humidity').innerHTML = `Umidade: <br> ${humidity[0]}%`;
                document.getElementById('direction').innerHTML = `Direção: <br> ${daily.winddirection_10m_dominant[0]}°`;

                for (let i = 0; i < dates.length; i++) {
                    const date = dates[i];
                    const tempMax = temperature[i];
                    const tempMin = temperatureMin[i];
                    const dayCard = day(date, tempMax, tempMin);
                    weeklyContainer.appendChild(dayCard);
                }
            })
            .catch(function (error) {
                alert("Error fetching location data:", error);
            });
        },
        function() {
            modal.show();
            
        }
    );
}

getLocationInfo()

function dateFormatter(dateString) {
    const date = moment(dateString);
    return date.format('DD/MM');
}

document.getElementById('reloadPageBtn').addEventListener('click', function() {
    location.reload();
}   );