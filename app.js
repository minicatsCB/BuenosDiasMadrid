var pollutionUrl = "http://airemad.com/api/v1/pollution/";
var cameraUrl = "http://informo.munimadrid.es/cameras/";
var weatherApiKey = "yourApiKey";
var weatherUrl = "http://api.openweathermap.org/data/2.5/weather?q=Madrid&units=metric&appid=";

displayRandomCameraImage();

var url = pollutionUrl + "S004";
requestData(url)
    .then(displayPollutionData)
    .catch(err => {
        console.log("An error occurred while fetching pollution data: ", err);
    });

requestWeather();

function replaceNullData(strings, ...parts) {
    var checkedMarkup = "";
    strings.forEach((string, index) => {
        if (!parts[index]){
            parts[index] = "data no available";
        }
        checkedMarkup += string + parts[index];
    });

    return checkedMarkup;
}

function displayPollutionData(data) {
    var pollutionElement = document.getElementsByClassName("pollution-data")[0];

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
        <p><b>${chemicalCompound.parameter} (${chemicalCompound.abrebiation}):</b> ${lastObservedValue.valor}&#181;g/m3 <em>medido por ${chemicalCompound.technique}</em></p>
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

function requestWeather(place, cb){
    var url = weatherUrl + weatherApiKey;
    requestData(url)
        .then(displayCurrentWeahterData)
        .catch(err => {
            console.log("An error occurred while fetching weather data: ", err);
        });
}

function displayCurrentWeahterData(data) {
    var currentWatherDataElement = document.getElementsByClassName("current-weather-data")[0];

    var currentWatherDataMarkup = replaceNullData`
        <p>${data.weather[0].description}</p>
        <p>${data.main.temp}ºC</p>
        <p>Min ${data.main.temp_min}ºC | Max ${data.main.temp_max}ªC</p>
        <p>Hum ${data.main.humidity}% | Pres ${data.main.pressure} psi</p>
        <p>Viento ${data.wind.deg}ª | ${data.wind.speed} km/h</p>
    `

    currentWatherDataElement.innerHTML = currentWatherDataMarkup;
}
