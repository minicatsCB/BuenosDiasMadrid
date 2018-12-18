var pollutionUrl = "http://airemad.com/api/v1/pollution/";

var url = pollutionUrl + "S004";
requestData(url)
    .then(displayPollutionData)
    .catch(err => {
        console.log("An error occurred while fetching pollution data: ", err);
    });

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
