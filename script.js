const weatherCodeMap = {
  0: "Céu limpo",1: "Parcialmente nublado",2: "Poucas nuvens",3: "Muito nublado",45: "Névoa",48: "Névoa com deposição (nevoeiro congelante)",51: "Garoa fraca",53: "Garoa moderada",55: "Garoa forte",56: "Garoa congelante fraca",57: "Garoa congelante forte",61: "Chuva fraca",63: "Chuva moderada",65: "Chuva forte",66: "Chuva congelante fraca",67: "Chuva congelante forte",71: "Neve fraca",73: "Neve moderada",75: "Neve forte",77: "Grãos de neve",80: "Pancadas de chuva fracas",81: "Pancadas de chuva moderadas",82: "Pancadas de chuva fortes",85: "Pancadas de neve fracas",86: "Pancadas de neve fortes",95: "Tempestade",96: "Tempestade com granizo fraco",99: "Tempestade com granizo forte"
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
        console.log("Geolocation is not supported by your browser");
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
                console.log("Error fetching location data:", error);
            });
            const response = axios.get(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&daily=weather_code,windspeed_10m_max,winddirection_10m_dominant,temperature_2m_max,temperature_2m_min,precipitation_sum,precipitation_probability_max&hourly=relativehumidity_2m&forecast_days=7&timezone=auto`)
            .then(function (response) {
                console.log(response.data);
                const daily = response.data.daily;
                const humidity = response.data.hourly.relativehumidity_2m;
                const windSpeed = daily.windspeed_10m_max;
                const weatherCode = daily.weather_code;
                const temperature = daily.temperature_2m_max;
                const temperatureMin = daily.temperature_2m_min;    
                const dates = daily.time;
                
                document.getElementById('date').innerText = dateFormatter(dates[0]);
                document.getElementById('temperature').innerText = `${temperature[0]}°C`;
                document.getElementById('description').innerText = `${weatherCodeMap[weatherCode[0]]} - ${temperature[0]}°C / ${temperatureMin[0]}°C` || "Descrição indisponível";
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
                console.log("Error fetching location data:", error);
            });
        },
        function() {
            modal.show();
            console.log("Erro em recuperar sua localização");
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