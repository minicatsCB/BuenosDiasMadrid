function requestData(url) {
    return new Promise((resolve, reject) => {
        fetch(url)
           .then(getStatus)
           .then(getJson)
           .then(resolve)
           .catch(reject);
    });
}

function getStatus(response) {
    if (response.status >= 200 && response.status < 300) {
        return Promise.resolve(response);
    }
    else {
        return Promise.reject(new Error(response.statusText));
    }
}

function getJson(response) {
    return response.json();
}
