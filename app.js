var pollutionUrl = "http://airemad.com/api/v1/pollution/";

var url = pollutionUrl + "S004";
requestData(url)
    .then(data => {
        console.log(data);
    });
