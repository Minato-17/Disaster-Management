import React from 'react';
import '../styles/Map.css';

function Map({ selectedLayer }) {
  const baseUrl = "https://embed.windy.com/embed2.html";
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

  const mapUrl = `${baseUrl}?lat=${mapConfig.lat}&lon=${mapConfig.lon}&detailLat=${mapConfig.detailLat}&detailLon=${mapConfig.detailLon}&width=100%&height=600&zoom=${mapConfig.zoom}&level=${mapConfig.level}&overlay=${selectedLayer}&menu=${mapConfig.menu}&message=${mapConfig.message}&marker=${mapConfig.marker}&calendar=${mapConfig.calendar}&pressure=${mapConfig.pressure}&type=${mapConfig.type}&location=${mapConfig.location}&detail=${mapConfig.detail}&metricWind=${mapConfig.metricWind}&metricTemp=${mapConfig.metricTemp}&radarRange=${mapConfig.radarRange}`;

  return (
    <div className="map-container">
      <iframe
        width="100%"
        height="1000"
        src={mapUrl}
        frameBorder="0"
        title="Weather Map"
      />
    </div>
  );
}

export default Map;