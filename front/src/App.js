import React, { useState } from 'react';
import { BrowserRouter as Router,  Route, Routes } from "react-router-dom";
import './App.css';


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

  // ENDRE DENNE TIL FALSE FOR Å SE HVORDAN DET SER UT NÅR MAN ER LOGGET UT OG TRUE FOR Å SE HVORDAN DET SER UT NÅR MAN ER LOGGET INN
  const [isLoggedIn, setIsLoggedIn] = useState(true);

  const handleLogout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem('isLoggedIn'); // Oppdater localStorage
  };

  return (
    <Router>
      <div className="app-container">
        <NavBar isLoggedIn={isLoggedIn} handleLogout={handleLogout} />
        <div className="content-container">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/kontaktoss" element={<ContactUs />} />
            {!isLoggedIn ? (
              <>
                <Route path="/login" element={<LogIn setIsLoggedIn={setIsLoggedIn} />} />
                <Route path="/signup" element={<SignUp />} />
              </>
            ) : (
              <>
                <Route path="/stash" element={<Stash />} />
                <Route path="/recipes" element={<Recipes />} />
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