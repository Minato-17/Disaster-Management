import React, { useState } from 'react';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import Map from './Map';
import '../styles/Dashboard.css';

function Dashboard() {
  const [selectedLayer, setSelectedLayer] = useState('wind');

  const handleLayerChange = (layer) => {
    setSelectedLayer(layer);
  };

  return (
    <div className="dashboard">
      <Navbar />
      <div className="main-content">
        <Sidebar onLayerChange={handleLayerChange} selectedLayer={selectedLayer} />
        <Map selectedLayer={selectedLayer} />
      </div>
    </div>
  );
}

export default Dashboard;