import React from 'react';
import axios from 'axios';
import '../styles/Sidebar.css';

function Sidebar({ onLayerChange, selectedLayer }) {
    const layers = [
        { id: 'wind', name: 'Wind' },
        { id: 'rain', name: 'Rain' },
        { id: 'temp', name: 'Temperature' },
        { id: 'clouds', name: 'Clouds' },
        { id: 'pressure', name: 'Pressure' },
    ];

    const handlePredict = async () => {
      try {
        const response = await fetch("http://localhost:5000/predict", { // Ensure correct port
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ key: "value" }) // Send correct data
        });
    
        const result = await response.json();
        console.log("Server Response:", result);
    
      } catch (error) {
        console.error("Error calling /predict:", error);
      }
    };
    

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
            <button className="predict-button" onClick={handlePredict}>
                Predict
            </button>
        </div>
    );
}

export default Sidebar;
