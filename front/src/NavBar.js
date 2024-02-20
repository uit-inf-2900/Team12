import React from 'react';
import { NavLink } from "react-router-dom";
import "./navbar.css";

const NavBar = () => {
  return (
    <header className="header" id="header">
      <nav className="nav container">
        <NavLink to="/" className="nav-logo">**LOGO**</NavLink>
        <ul className="nav-list">
          <li className="nav-item"><NavLink to="/" className="nav-link">Home</NavLink></li>
          <li className="nav-item"><NavLink to="/about" className="nav-link">About</NavLink></li>
          <li className="nav-item"><NavLink to="/recipes" className="nav-link">Oppskrifter</NavLink></li>
          <li className="nav-item"><NavLink to="/stash" className="nav-link">Garnlager</NavLink></li>
          <li className="nav-item"><NavLink to="/kontaktoss" className="nav-link">Kontakt oss</NavLink></li>
          {/* Add more navigation items */}
        </ul>
        <div className="nav-items">
          <NavLink to="/signup" className="nav-action">Sign Up</NavLink>
          <NavLink to="/login" className="nav-action">Log In</NavLink>
        </div>
      </nav>
    </header>
  );
};

export default NavBar;
