$(document).ready(function () {
  loadData();
});

/**
 * Para que o sistema atualize e pegue posições em tempo real
 * Foi utilizado setInterval que irá a cada X segundos
 * Consultar novamente a API
 */

setInterval(() => {
  loadData()
}, 5000)

/*
 * @params string API_URL - constante da URL da API
 * @params string API_KEY - constante da API key
 */
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

    initializeMap(positions);
  });

  return positions;
}

/*
 * @@@ recebe as informações de imei e data para exibir ao clicar
 * @params string imei
 * @params string data
 * @return string
 */
function generateInfoWindow(imei, data) {
  return `<div> 
            <span class='bold'>IMEI: </span>
            <span>${imei}</span>
          </div>
          <div> 
            <span class='bold'>Data:</span>
            <span>${data}</span>
          </div>`;
}

/*
 * @@@ recebe as informações de localizacao retornadas da API
 * @@@ e gera visualmente as posições no mapa
 * @params array locations
 * @return void
 */
async function initializeMap(locations) {
  const { Map } = await google.maps.importLibrary("maps");
  const { AdvancedMarkerElement } = await google.maps.importLibrary("marker");

  const firstPosition = locations[0];

  var map = new google.maps.Map(document.getElementById("map"), {
    zoom: 12,
    center: { lat: Number(firstPosition.latitude), lng: Number(firstPosition.longitude) },
    mapTypeId: "roadmap",
    mapId: "DEMO_MAP_ID",
  });

  const infoWindow = new google.maps.InfoWindow({
    disableAutoPan: true,
  });

  const markers = locations.map((position, i) => {
    const content = generateInfoWindow(position.imei, position.last_stamp);

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
