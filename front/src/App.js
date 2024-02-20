import React, { useState } from 'react';
import LogIn from './SignUp_LogIn/LogIn';
import SignUp from './SignUp_LogIn/SignUp';
import ResetPassword from './SignUp_LogIn/ResetPassword';
import NavBar from './SignUp_LogIn/NavBar'
import { BrowserRouter as Router,  Route, Routes } from "react-router-dom";

import {About} from './SignUp_LogIn/pages/about'
import {Home} from './SignUp_LogIn/pages/home'


export default function App() {
  return (
    <Router>
      {/* Navbar for the css */}
      <NavBar />    
      {/* Routes for the different pages */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/login" element={<LogIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        {/* Add more routes as needed */}
      </Routes>
    </Router>
  );
}