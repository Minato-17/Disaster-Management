import React, { useEffect, useRef, useState } from 'react';
import '../styles/Map.css';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css'; // Import Leaflet CSS

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
    radarRange: -1,
  };

  const windyUrl = `${windyBaseUrl}?lat=${mapConfig.lat}&lon=${mapConfig.lon}&detailLat=${mapConfig.detailLat}&detailLon=${mapConfig.detailLon}&width=100%&height=100%&zoom=${mapConfig.zoom}&level=${mapConfig.level}&overlay=${selectedLayer}&menu=${mapConfig.menu}&message=${mapConfig.message}&marker=${mapConfig.marker}&calendar=${mapConfig.calendar}&pressure=${mapConfig.pressure}&type=${mapConfig.type}&location=${mapConfig.location}&detail=${mapConfig.detail}&metricWind=${mapConfig.metricWind}&metricTemp=${mapConfig.metricTemp}&radarRange=${mapConfig.radarRange}`;

  // State for form inputs
  const [lat, setLat] = useState('');
  const [lng, setLng] = useState('');
  const [disaster, setDisaster] = useState('Flood');
  const [intensity, setIntensity] = useState('Mild');

  // Ref for the Leaflet map
  const mapRef = useRef(null);
  const leafletMap = useRef(null);

  // Function to get marker color based on intensity
  const getColor = (intensity) => {
    return intensity === 'Mild' ? 'yellow' :
           intensity === 'Moderate' ? 'orange' :
           intensity === 'Severe' ? 'red' : 'gray';
  };

  // Initialize the Leaflet map
  useEffect(() => {
    if (mapRef.current && !leafletMap.current) {
      leafletMap.current = L.map(mapRef.current).setView([mapConfig.lat, mapConfig.lon], 6);
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
      }).addTo(leafletMap.current);
    }

    // Cleanup on unmount
    return () => {
      if (leafletMap.current) {
        leafletMap.current.remove();
        leafletMap.current = null;
      }
    };
  }, []);

  // Function to add a disaster marker
  const addDisaster = () => {
    const latitude = parseFloat(lat);
    const longitude = parseFloat(lng);

    if (isNaN(latitude) || isNaN(longitude)) {
      alert('Please enter valid latitude and longitude!');
      return;
    }

    if (leafletMap.current) {
      const color = getColor(intensity);
      L.circle([latitude, longitude], {
        color: color,
        fillColor: color,
        fillOpacity: 0.5,
        radius: 50000,
      })
        .addTo(leafletMap.current)
        .bindPopup(`<b>${disaster}</b><br>Intensity: ${intensity}`)
        .openPopup();

      leafletMap.current.setView([latitude, longitude], 7);
    }
  };

  return (
    <div className="map-container">
      <div className="windy-map">
        <iframe
          width="100%"
          height="90%"
          src={windyUrl}
          frameBorder="0"
          title="Weather Map"
        />
      </div>
      <div className="partition" />
      <div className="osm-container">
      <div className="osm-map" ref={mapRef} style={{ height: '100px', width: '100%' }} />        <div className="form-container">
          <h3>Add Disaster Marker</h3>
          <div>
            <label>
              Latitude:
              <input
                type="number"
                step="any"
                value={lat}
                onChange={(e) => setLat(e.target.value)}
                placeholder="e.g., 22.385"
              />
            </label>
            <label>
              Longitude:
              <input
                type="number"
                step="any"
                value={lng}
                onChange={(e) => setLng(e.target.value)}
                placeholder="e.g., 77.859"
              />
            </label>
          </div>
          <div>
            <label>
              Disaster Type:
              <select value={disaster} onChange={(e) => setDisaster(e.target.value)}>
                <option value="Flood">Flood</option>
                <option value="Earthquake">Earthquake</option>
                <option value="Cyclone">Cyclone</option>
                <option value="Landslide">Landslide</option>
              </select>
            </label>
            <label>
              Intensity:
              <select value={intensity} onChange={(e) => setIntensity(e.target.value)}>
                <option value="Mild">Mild</option>
                <option value="Moderate">Moderate</option>
                <option value="Severe">Severe</option>
              </select>
            </label>
            <button onClick={addDisaster}>Add Marker</button>
          </div>
        </div>
        
      </div>
    </div>
  );
}

export default Map;