import React, { useState } from 'react';
import { NavLink } from "react-router-dom";
import "../../GlobalStyles/main.css";
import ConfirmationLogout from '../../pages/Authentication/ConfirmationLogout';  // Correct way to import default exports
import { useFormState } from 'react-hook-form';
import logoIMG from "../../images/logo/logoStart.svg";
import Logo from "../../images/logo/logoBlack.svg";
import allBlackShort from "../../images/homepage/allBlackShort.svg";
import NameLong from "../../images/logo/KHorange.svg"
import Resources from '../../pages/KnitHubResources/Resources';

const VisitorView = () => {
  return (
    <>
      <li className="nav-item"><NavLink to="/about" className="nav-link">About</NavLink></li>
      <li className="nav-item"><NavLink to="/contactus" className="nav-link">Contact us</NavLink></li>
      <li className="nav-item"><NavLink to="/resources" className="nav-link">Resources</NavLink></li>
    </>
  );
}; 

const UserView = () => {
  return(
    <>
      <li className="nav-item"><NavLink to="/recipes" className="nav-link">Recipes</NavLink></li>
      <li className="nav-item"><NavLink to="/projects" className="nav-link">Projects</NavLink></li>
      <li className="nav-item"><NavLink to="/stash" className="nav-link">Stash</NavLink></li>
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
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const handleLogoutClick = (e) => {
    e.preventDefault();
    setShowLogoutConfirm(true);
  };

  const handleConfirmLogout = () => {
    setShowLogoutConfirm(false);
    handleLogout();
  };

  const handleCloseModal = () => {
    setShowLogoutConfirm(false);
  };

  return (
    <header className="header" id="header">
      <nav className="nav-container">
        <ul className="nav-list">
          <li className='nav-items nav-logo'>
            <NavLink to="/" className='nav-logo'>
            <img src={allBlackShort} className='nav-logo-img'></img>
          </NavLink>
          </li>
        
          <li className="nav-items"><NavLink to="/" className="nav-link">Home</NavLink></li>
          {!isLoggedIn && <VisitorView/>}
          {isLoggedIn && <UserView />}
          <AdminView isAdmin={isAdmin} isLoggedIn={isLoggedIn} />
        
        
        {isLoggedIn && (
        <>
          <li className="nav-items">
            <NavLink to="/profile" className="nav-action">Profile</NavLink>
            <NavLink onClick={handleLogoutClick} className="nav-action">Logg Ut</NavLink>
            <ConfirmationLogout 
              isOpen={showLogoutConfirm}
              onClose={handleCloseModal}
              onConfirm={handleConfirmLogout}
              message="Are you sure you want to log out?"
            />
          </li>
        </>
        )}
        {!isLoggedIn && (
        <>
          <li className="nav-items">
            <NavLink to="/signup" className="nav-action">Sign Up</NavLink>
            <NavLink to="/login" className="nav-action">Log In</NavLink>
          </li>
        </>
        )}
        </ul>
      </nav>
    </header>
  );
};

export default NavBar;
