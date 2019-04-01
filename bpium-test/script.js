'use strict';

function initMap() {
  const options = {
    center: {lat: -25.363, lng: 131.044},
    zoom: 3,
  };

  const map = new google.maps.Map(
    document.getElementById("map"), options
  );

  getData()
  .then((data) => showInDocument(data))
  .then((data) => drawOnMap(map, data))
  .then((firstPlace) => {
    map.panTo(firstPlace);
  });

}

function showInDocument(data) {
  return new Promise((resolve) => {
    document.getElementById('data').textContent = "";
    data.forEach((item) => {
      const div = document.createElement('div');
      div.textContent = `${item.title}: ${item.values[2]}`;
      document.getElementById('data').append(div);
    });
    resolve(data);
  });
}

function drawOnMap(map, data) {
  return new Promise((resolve, reject) => {
    console.log(map, data);

    let firstPlace;

    data.forEach((item, i) => {
      const title = item.title;
      const position = new google.maps.LatLng(...item.values[2].split(','));
      if (i === 0) firstPlace = position;
      const marker = new google.maps.Marker({map, position, title});
    });

    resolve(firstPlace);
  });
}

function getData() {
  return new Promise((resolve, reject) => {
    const proxyUrl = 'https://cors-anywhere.herokuapp.com/';
    const targetUrl = 'https://awesome.bpium.ru/api/v1/catalogs/11/records';

    let result;

    fetch(proxyUrl + targetUrl, {
      method: 'GET',
      headers: {
        "Authorization": "Basic aG1yZmluc0BnbWFpbC5jb206aG1yZmJmYWNrZQ==",
        "Content-Type": "application/json"
      },
      mode: 'cors',
    })
    .then((res) => res.json().then((text) => result = text))
    .then(() => resolve(result))
    .catch(alert);
  });
}
