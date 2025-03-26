import React from 'react';
import '../styles/Navbar.css';

function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar-brand">Disaster Management Dashboard</div>
      <ul className="navbar-menu">
        <li>Home</li>
        <li>Alerts</li>
        <li>Reports</li>
        <li>Settings</li>
      </ul>
    </nav>
  );
}

export default Navbar;