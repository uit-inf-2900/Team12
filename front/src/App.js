import React from 'react';
import { BrowserRouter as Router,  Route, Routes } from "react-router-dom";
import './App.css';


// Import our pages
import NavBar from './NavBar'
import {About} from './pages/about'
import {Home} from './pages/home'
import {Stash} from './pages/stash'
import ResetPassword from './pages/SignUp_LogIn/ResetPassword';
import LogIn from './pages/SignUp_LogIn/LogIn';
import SignUp from './pages/SignUp_LogIn/SignUp';


export default function App() {
  return (
    <Router>
      {/* Navbar for the css */}
      <div className="app-container" > {/* New wrapper for Flex layout */}
        <NavBar /> 
        <div className="content-container"> {/* Container for the main content */}   
        {/* Routes for the different pages */}
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/login" element={<LogIn />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/stash" element={<Stash />} />
            {/* Add more routes as needed */}
          </Routes>
        </div>
      </div>
    </Router>
  );
}