import React, { useState } from 'react';
import LogIn from './SignUp_LogIn/LogIn';
import SignUp from './SignUp_LogIn/SignUp';
import ResetPassword from './SignUp_LogIn/ResetPassword';
import NavBar from './SignUp_LogIn/NavBar'
import { BrowserRouter as Router,  Route, Routes } from "react-router-dom";

import {About} from './SignUp_LogIn/pages/about'
import {Home} from './SignUp_LogIn/pages/home'




export default function App() {
  const [showLogin, setShowLogin] = useState(true);
  const [showResetPassword, setShowResetPassword] = useState(false);

  const toggleForm = () => {
    setShowLogin(!showLogin);
    setShowResetPassword(false);
  };
  const handleForgotPasswordClick = () => {
    setShowLogin(false);
    setShowResetPassword(true);
  };
  const toggleSignup = () => {
    setShowSignup(!showSignup);
  };
  const toggleLogin = () => {
    setShowLogin(!showLogin);
  };

  {/*const router=createBrowserRouter(createRoutesFromElements(<Route path="/" element={<Root />}>
  <Route path="dashboard" element={<Dashboard />} />
  {/* ... etc.
</Route>));*/}


  return (
    <div className="form-container">
      {showLogin && !showResetPassword &&(
        <LogIn toggleForm={toggleForm} onForgotPasswordClick={handleForgotPasswordClick} />
      )}
      {!showLogin && !showResetPassword &&(
        <SignUp toggleForm={toggleForm} />
      )}
      {showResetPassword && (
        <ResetPassword toggleForm={toggleForm} />
      )}
      {/* NavBar component */}
      <NavBar toggleSignup={toggleForm} toggleLogin={toggleLogin} />
      

    </div>


  
  );
}
