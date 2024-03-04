import React from 'react';
import { NavLink } from "react-router-dom";
import "./Components/navbar.css";


const NavBar = ({ isLoggedIn, handleLogout }) => {
  return (
    <header className="header" id="header">
      <nav className="nav container">
        <NavLink to="/" className="nav-logo">**LOGO**</NavLink>
        <ul className="nav-list">
          <li className="nav-item"><NavLink to="/" className="nav-link">Home</NavLink></li>
          {!isLoggedIn && (
            <>
          <li className="nav-item"><NavLink to="/about" className="nav-link">About</NavLink></li>
          </>
          )}
          {isLoggedIn && (
            <>
          <li className="nav-item"><NavLink to="/recipes" className="nav-link">Oppskrifter</NavLink></li>
          <li className="nav-item"><NavLink to="/prosjekter" className="nav-link">Prosjekter</NavLink></li>
          <li className="nav-item"><NavLink to="/stash" className="nav-link">Garnlager</NavLink></li>
          </>
          )}
          <li className="nav-item"><NavLink to="/kontaktoss" className="nav-link">Kontakt oss</NavLink></li>
          {/* Add more navigation items */}
        </ul>
        {isLoggedIn && (
          <>
        <div className="nav-items">
          <NavLink to="/profile" className="nav-action">Profile</NavLink>
          <button onClick={handleLogout}>Logg Ut</button>
        </div>
        </>
        )}
        {!isLoggedIn && (
          <>
        <div className="nav-items">
          <NavLink to="/signup" className="nav-action">Sign Up</NavLink>
          <NavLink to="/login" className="nav-action">Log In</NavLink>
        </div>
        </>
        )}
      </nav>
    </header>
  );
};

export default NavBar;
