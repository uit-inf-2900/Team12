import React from 'react';
import { NavLink } from "react-router-dom";
import "../GlobalStyles/navbar.css";

const VisitorView = () => {
  return (
    <>
      <li className="nav-item"><NavLink to="/about" className="nav-link">About</NavLink></li>
      <li className="nav-item"><NavLink to="/contactus" className="nav-link">Contact us</NavLink></li>
    </>
  );
}; 

const UserView = () => {
  return(
    <>
      <li className="nav-item"><NavLink to="/recipes" className="nav-link">Recipes</NavLink></li>
      <li className="nav-item"><NavLink to="/projects" className="nav-link">Projects</NavLink></li>
      <li className="nav-item"><NavLink to="/stash" className="nav-link">Stash</NavLink></li>
      <li className="nav-item"><NavLink to="/garnkalkulator" className="nav-link">Garnkalkulator</NavLink></li>
      <li className="nav-item"><NavLink to="/okefellekalkulator" className="nav-link">Oke</NavLink></li>
    </>
  ); 
}; 

const AdminView = ({ isAdmin, isLoggedIn }) => {
  return(
    <>
      {/* Dont want to show the contact page if you have admin privilages */}

      {/* Show the admin page if you have admin prvileges */}
      {isAdmin && isLoggedIn && <li className="nav-item"><NavLink to="/adminpage" className="nav-link">Admin</NavLink></li>}
    </>
  ); 
}; 

const NavBar = ({ isLoggedIn, handleLogout, isAdmin }) => {
  return (
    <header className="header" id="header">
      <nav className="nav container">
        <NavLink to="/" className="nav-logo">**LOGO**</NavLink>
        <ul className="nav-list">
          <li className="nav-item"><NavLink to="/" className="nav-link">Home</NavLink></li>
          {!isLoggedIn && <VisitorView/>}
          {isLoggedIn && <UserView />}
          <AdminView isAdmin={isAdmin} isLoggedIn={isLoggedIn} />
        </ul>
        {isLoggedIn && (
        <>
          <div className="nav-items">
            <NavLink to="/profile" className="nav-action">Profile</NavLink>
            <NavLink onClick={handleLogout}>Logg Ut</NavLink>
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
