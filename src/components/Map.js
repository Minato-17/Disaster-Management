import React from 'react';
import '../styles/Map.css';

function Map({ selectedLayer }) {
  const windyBaseUrl = "https://embed.windy.com/embed2.html";
  const mapConfig = {
    lat: 22.385,
    lon: 77.859,
    detailLat: 22.385,
    detailLon: 77.859,
    zoom: 6,
    level: 'surface',
    menu: '',
    message: 'true',
    marker: '',
    calendar: 'now',
    pressure: 'true',
    type: 'satellite',
    location: 'coordinates',
    detail: 'true',
    metricWind: 'default',
    metricTemp: 'default',
    radarRange: -1
  };

  const windyUrl = `${windyBaseUrl}?lat=${mapConfig.lat}&lon=${mapConfig.lon}&detailLat=${mapConfig.detailLat}&detailLon=${mapConfig.detailLon}&width=100%&height=100%&zoom=${mapConfig.zoom}&level=${mapConfig.level}&overlay=${selectedLayer}&menu=${mapConfig.menu}&message=${mapConfig.message}&marker=${mapConfig.marker}&calendar=${mapConfig.calendar}&pressure=${mapConfig.pressure}&type=${mapConfig.type}&location=${mapConfig.location}&detail=${mapConfig.detail}&metricWind=${mapConfig.metricWind}&metricTemp=${mapConfig.metricTemp}&radarRange=${mapConfig.radarRange}`;

  const osmUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${mapConfig.lon - 0.5}%2C${mapConfig.lat - 0.5}%2C${mapConfig.lon + 0.5}%2C${mapConfig.lat + 0.5}&layer=mapnik`;

  return (
    <div className="map-container">
      <div className="windy-map">
        <iframe
          width="100%"
          height="100%"
          src={windyUrl}
          frameBorder="0"
          title="Weather Map"
        />
      </div>
      <div className="partition" />
      <div className="osm-container">
        <div className="osm-map">
          <iframe
            width="100%"
            height="100%"
            src={osmUrl}
            frameBorder="0"
            title="OpenStreetMap"
          />
        </div>
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Column 1</th>
                <th>Column 2</th>
                <th>Column 3</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td></td>
                <td></td>
                <td></td>
              </tr>
              <tr>
                <td></td>
                <td></td>
                <td></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Map;