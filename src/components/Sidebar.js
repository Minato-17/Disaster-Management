import React from 'react';
import '../styles/Sidebar.css';

function Sidebar({ onLayerChange, selectedLayer }) {
  const layers = [
    { id: 'wind', name: 'Wind' },
    { id: 'rain', name: 'Rain' },
    { id: 'temp', name: 'Temperature' },
    { id: 'clouds', name: 'Clouds' },
    { id: 'pressure', name: 'Pressure' },
  ];

  return (
    <div className="sidebar">
      <h3>Layers</h3>
      <ul className="layer-list">
        {layers.map((layer) => (
          <li
            key={layer.id}
            className={selectedLayer === layer.id ? 'active' : ''}
            onClick={() => onLayerChange(layer.id)}
          >
            {layer.name}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Sidebar;