import React, { useState } from 'react';
import Dashboard from './components/Dashboard';
import './App.css';

function App() {
  const [popupContent, setPopupContent] = useState(null);

  const handlePredict = async () => {
    try {
      const response = await fetch('http://localhost:5000/predict'); // Backend endpoint
      const data = await response.json();
      const formattedOutput = `
        Mean Absolute Error - Likelihood Score: ${data.mae_likelihood}
        Mean Absolute Error - Magnitude: ${data.mae_magnitude}
        Top 5 Predicted Earthquakes:
        ${data.top_earthquakes
          .map(
            (quake, index) =>
              `${index + 1}. Latitude: ${quake.Latitude}, Longitude: ${quake.Longitude}, Likelihood: ${quake.Predicted_Likelihood_Score}, Magnitude: ${quake.Predicted_Magnitude}, Occurs: ${quake.Earthquake_Occurs}`
          )
          .join('\n')}
      `;
      setPopupContent(formattedOutput);
    } catch (error) {
      setPopupContent('Error occurred while predicting.');
    }
  };

  return (
    <div className="App">
      <Dashboard onPredict={handlePredict} />
      {popupContent && (
        <div className="popup">
          <div className="popup-content">
            <pre>{popupContent}</pre>
            <button onClick={() => setPopupContent(null)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;