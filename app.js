var pollutionUrl = "http://airemad.com/api/v1/pollution/";
var cameraUrl = "http://informo.munimadrid.es/cameras/";
var weatherApiKey = "yourApiKey";
var currentWeatherUrl = "http://api.openweathermap.org/data/2.5/weather?q=Madrid&units=metric&appid=";
var forecastWeatherUrl = "http://api.openweathermap.org/data/2.5/forecast?q=Madrid&units=metric&&appid=";

displayRandomCameraImage();

var url = pollutionUrl + "S004";
requestData(url)
    .then(displayPollutionData)
    .catch(err => {
        console.log("An error occurred while fetching pollution data: ", err);
    });

requestCurrentWeather();
requestForecastWeather();

function replaceNullData(strings, ...parts) {
    var checkedMarkup = "";
    parts.forEach((part, index) => {
        if (part === null) {
            part = "data not available";
        }

        checkedMarkup += strings[index] + part;
    });

    return checkedMarkup + strings[strings.length - 1];
}

function displayPollutionData(data) {
    console.log(data);
    var pollutionElement = document.getElementsByClassName("pollution")[0];

    for (var key in data) {
    	if (data.hasOwnProperty(key)) {
    		if (typeof data[key] === 'object') {
                if(data[key].values) {
                    var pastValues = data[key].values.filter(value => value.estado === "Pasado");
                    var lastObservedValue = pastValues[pastValues.length - 1];
                }
                var markup = createChemicalCompoundMarkup(data[key], lastObservedValue);
                pollutionElement.innerHTML += markup;
            }
    	}
    }
}

function createChemicalCompoundMarkup(chemicalCompound, lastObservedValue) {
    var markup = replaceNullData`
        <p class="text-secondary">
            <span class="font-weight-bold text-dark">${chemicalCompound.parameter} (${chemicalCompound.abrebiation}):</span>
            ${lastObservedValue.valor}&#181;g/m3 <em>medido por ${chemicalCompound.technique}</em>
        </p>
    `;

    return markup;
}

function displayRandomCameraImage(){
    var cameraElement = document.getElementsByClassName("random-camera")[0];
    var randomCameraIndex = getRandomInteger(0, camerasIds.length);
    var url = cameraUrl + camerasIds[randomCameraIndex] + ".jpg?v=18944";
    cameraElement.src = url;
}

function getRandomInteger(min, max) {
    var random = (Math.random() * (max - min)) + min;
    return Math.floor(random);
}

function requestCurrentWeather(place, cb){
    var url = currentWeatherUrl + weatherApiKey;
    requestData(url)
        .then(displayCurrentWeahterData)
        .catch(err => {
            console.log("An error occurred while fetching current weather data: ", err);
        });
}

function displayCurrentWeahterData(data) {
    var currentWatherDataElement = document.getElementsByClassName("current-weather")[0];

    var currentWatherDataMarkup = replaceNullData`
    <div class="row">
        <div class="col">
            <i class="owf owf-${data.weather[0].id} text-info"></i>
        </div>
        <div class="col">
            <h5 class="my-0 text-capitalize font-weight-bold text-info">${data.weather[0].description}</h5>
            <p class="my-0 text-secondary">${data.main.temp}ºC</p>
            <p class="my-0 text-secondary">Min ${data.main.temp_min}ºC | Max ${data.main.temp_max}ªC</p>
            <p class="my-0 text-secondary">Hum ${data.main.humidity}% | Pres ${data.main.pressure} psi</p>
            <p class="my-0 text-secondary">Viento ${data.wind.deg}ª | ${data.wind.speed} km/h</p>
        </div>
    </div>
    `

    currentWatherDataElement.innerHTML = currentWatherDataMarkup;
}

function requestForecastWeather() {
    var url = forecastWeatherUrl + weatherApiKey;
    requestData(url)
        .then(displayForecastWeatherData)
        .catch(err => {
            console.log("An error occurred while fetching forecast weather data: ", err);
        });
}

function displayForecastWeatherData(data) {
    var forecastElement = document.getElementsByClassName("forecast")[0];

    var forecastData = [data.list[0], data.list[8], data.list[16], data.list[24]];

    var forecastMarkup = replaceNullData `
        ${forecastData.map((item, i) => `
          <div class="col">
              <div class="col-12 pl-0 text-capitalize font-weight-bold text-dark">
                <p>${getWeekDayName(item.dt)} (00:00)</p>
              </div>
              <div class="row">
                  <div class="col-6">
                    <i class="owf owf-${item.weather[0].id} owf-5x owf-border text-dark"></i>
                  </div>
                  <div class="col-6">
                      <p class="my-0 text-capitalize font-weight-bold text-dark">${item.weather[0].description}</p>
                      <p class="my-0 text-secondary">${item.main.temp}ºC</p>
                      <p class="my-0 text-secondary">Min ${item.main.temp_min}ºC | Max ${item.main.temp_max}ªC</p>
                      <p class="my-0 text-secondary">Hum ${item.main.humidity}% | Pres ${item.main.pressure} psi</p>
                  </div>
              </div>
          </div>
        `).join('')}
    `;

    forecastElement.innerHTML = forecastMarkup;
}

function getWeekDayName(timestamp) {
    var date = new Date(timestamp * 1000);
    var options = {
        weekday: 'long'
    };

    return date.toLocaleString("es-ES", options);
}
