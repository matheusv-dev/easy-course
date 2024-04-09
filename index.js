$(document).ready(function () {
  loadData();
});

const API_URL = "https://api.easycourse.com.br/teste_pratico/";
const API_KEY = "dGVzdGUgcHJhdGljbw==";

async function loadData() {
  var positions = [];
  $.ajax({
    url: API_URL,
    method: "POST",
    data: {
      key: API_KEY,
    },
  }).done((response) => {
    const responseData = response.data;
    responseData.forEach((pos) => {
      positions.push({ ...pos });
    });

    initMap(positions);
  });

  return positions;
}

function generateInfoWindow(data) {
  return `<div> 
            <span class='bold'>IMEI: </span>
            <span>${data.imei}</span>
          </div>
          <div> 
            <span class='bold'>Data:</span>
            <span>${data.last_stamp}</span>
          </div>`;
}

async function initMap(locations) {
  const { Map } = await google.maps.importLibrary("maps");
  const { AdvancedMarkerElement } = await google.maps.importLibrary("marker");

  const firstPosition = locations[0];

  var map = new google.maps.Map(document.getElementById("map"), {
    zoom: 5,
    center: { lat: Number(firstPosition.latitude), lng: Number(firstPosition.longitude) },
    mapTypeId: "roadmap",
    mapId: "DEMO_MAP_ID",
  });

  const infoWindow = new google.maps.InfoWindow({
    disableAutoPan: true,
  });

  const markers = locations.map((position, i) => {
    const content = generateInfoWindow(position);

    const marker = new google.maps.marker.AdvancedMarkerElement({
      position: { lat: Number(position.latitude), lng: Number(position.longitude) },
      title: position.imei,
    });

    marker.addListener("click", () => {
      infoWindow.setContent(content);
      infoWindow.open({ map, anchor: marker });
    });
    return marker;
  });

  new markerClusterer.MarkerClusterer({ map, markers });
}
