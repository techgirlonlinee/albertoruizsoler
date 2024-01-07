import React from 'react';
import { NavLink, Link } from 'react-router-dom'; // Import Link
import './styles/NavBarStyles.css';

function NavBar() {
  return (
    <nav>
      {/* <h1>Alberto</h1> */}
      
      <div className="nav-header">
      <Link to="/" className="header-link">
        <div>ALBERTO</div>
        <div class="word">
            <div class="trans">ALBERTO</div>
            RUIZ
            </div>
        <div class="word">
        <div class="trans">ALBERTORUIZ</div>
            SOLER
            </div>
            </Link>
      </div>
      <ul>
        <li>
          <NavLink 
            to="/about" 
            className={({ isActive }) => isActive ? 'active-link' : undefined}
          >
            About
          </NavLink>
        </li>
        <li>
          <NavLink 
            to="/" 
            className={({ isActive }) => isActive ? 'active-link' : undefined}
            end
          >
            Home
          </NavLink>
        </li>
        <li>
          <NavLink 
            to="/calendar" 
            className={({ isActive }) => isActive ? 'active-link' : undefined}
          >
            Calendar
          </NavLink>
        </li>
      </ul>
    </nav>
  );
}

export default NavBar;
