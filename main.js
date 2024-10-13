const syncButton = document.getElementById("syncButton");
const asyncButton = document.getElementById("asyncButton");
const fetchButton = document.getElementById("fetchButton");
const tableBody = document.querySelector("#data-table tbody");

function displayData(data) {
    tableBody.innerHTML = '';

    data.forEach(person => {
        const [firstName, lastName] = person.name.split(' ');
        const row = document.createElement('tr');
        row.innerHTML = `<td>${firstName}</td><td>${lastName}</td><td>${person.id}</td>`;
        tableBody.appendChild(row);
    });
}

// Synchronous XMLHttpRequest
function fetchDataSync() {
    const referenceData = getSync('./reference.json');
    const data1 = getSync(`./${referenceData.data_location}`);
    const data2 = getSync(data1.data_location);
    const data3 = getSync('./data3.json');

    const finalData = [...data1.data, ...data2.data, ...data3.data];
    displayData(finalData);
}
function getSync(url) {
    const xhr = new XMLHttpRequest();
    xhr.open("GET", url, false);
    xhr.send();
    if (xhr.status === 200) {
        return JSON.parse(xhr.responseText);
    } else {
        console.error(`Failed to fetch ${url}`);
    }
}

// Asynchronous XMLHttpRequest with Callbacks
function fetchDataAsync() {
    getAsync('./reference.json', function(referenceData) {
        getAsync(`./${referenceData.data_location}`, function(data1) {
            getAsync(data1.data_location, function(data2) {
                getAsync('./data3.json', function(data3) {
                    const finalData = [...data1.data, ...data2.data, ...data3.data];
                    displayData(finalData);
                });
            });
        });
    });
}
function getAsync(url, callback) {
    const xhr = new XMLHttpRequest();
    xhr.open("GET", url, true);
    xhr.onreadystatechange = function() {
        if (xhr.readyState === 4 && xhr.status === 200) {
            callback(JSON.parse(xhr.responseText));
        }
    };
    xhr.send();
}

// Fetch API with Promises
function fetchDataWithFetch() {
    fetch('./reference.json')
        .then(response => response.json())
        .then(referenceData => fetch(`./${referenceData.data_location}`))
        .then(response => response.json())
        .then(data1 => fetch(data1.data_location)
            .then(response => response.json())
            .then(data2 => {
                return fetch('./data3.json').then(response => response.json()).then(data3 => {
                    const finalData = [...data1.data, ...data2.data, ...data3.data];
                    displayData(finalData);
                });
            })
        )
        .catch(error => console.error('Error fetching data:', error));
}

// Event Listeners
syncButton.addEventListener('click', fetchDataSync);
asyncButton.addEventListener('click', fetchDataAsync);
fetchButton.addEventListener('click', fetchDataWithFetch);
