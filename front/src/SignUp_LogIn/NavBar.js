import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { NavLink } from "react-router-dom";
import "./navbar.css";

const NavBar = ({ toggleSignup, toggleLogin }) => {
  return (
    <header className="header" id="header">
      <nav className="nav container">
        <a href="#" className="nav-logo">
          **LOGO**
        </a>

        <div className="nav-menu" id="navmenu">
          <ul className="nav-list">
            <li className="nav-item">
              <a href="/" className="nav-link">
                Hjem
              </a>
            </li>

            <li className="nav-item">
              <a href="/about" className="nav-link">
                Om oss
              </a>
            </li>

            <li className="nav-item">
              <a href="#" className="nav-link">
                Oppskrifter
              </a>
            </li>

            <li className="nav-item">
              <a href="#" className="nav-link">
                Garnlager
              </a>
            </li>

            <li className="nav-item">
              <a href="#" className="nav-link">
                Kontakt Oss
              </a>
            </li>
          </ul>

          {/* Close button */}
          <div className="nav-close" id="navclose">
            <i className="ri-close-line"></i>
          </div>
        </div>

        <div className="nav-items">
          {/* Signup button */}
          <i className="ri-user-line nav-signup" id="signup-btn" onClick={toggleSignup}>
            Sign up
          </i>

          {/* Login button */}
          <i className="ri-user-line nav-login" id="login-btn" onClick={toggleLogin}>
            Log in
          </i>

          {/* Toggle button */}
          <div className="nav-toggle" id="navtoggle">
            <i className="ri-menu-line"></i>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default NavBar;
