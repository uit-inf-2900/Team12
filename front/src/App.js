import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router,  Route, Routes } from "react-router-dom";


// Import our pages
import NavBar from './NavBar'
import {About} from './pages/about/about'
import {Home} from './pages/home'
import {Stash} from './pages/stash'
import ResetPassword from './pages/SignUp_LogIn/ResetPassword';
import LogIn from './pages/SignUp_LogIn/LogIn';
import SignUp from './pages/SignUp_LogIn/SignUp';
import Recipes from './pages/RecipeManagement/Recipes';
import ContactUs from './pages/ContactUs/ContactUs';


export default function App() {

  const handleLogout = () => {
    sessionStorage.removeItem('token'); // Fjerner token fra sessionStorage
    window.location.href = '/login'; // Omdirigerer brukeren til logginn-siden
  };

  // Sjekker direkte om token eksisterer i sessionStorage for å bestemme innloggingsstatus
  const isLoggedIn = sessionStorage.getItem('token');

  return (
    <Router>
      {/* NB: sto orginalt app-container, kan være vi må endre tilbake??? */}
      <div className="page-container">          
        <NavBar isLoggedIn={isLoggedIn} handleLogout={handleLogout} />
        <div className="content-container">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/contactus" element={<ContactUs />} />
            {!isLoggedIn ? (
              <>
                <Route path="/login" element={<LogIn />} />
                <Route path="/signup" element={<SignUp />} />
              </>
            ) : (
              <>
                <Route path="/stash" element={<Stash />} />
                <Route path="/recipes" element={<Recipes />} />
                <Route path='/projects' element={<h1>Prosjekter</h1>} />
                {/* <Route path="/profile" element={<Profile />} /> Legg til din profilside her */}
              </>
            )}
            <Route path="/reset-password" element={<ResetPassword />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}