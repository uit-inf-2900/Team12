import React, { useState } from 'react';
import { BrowserRouter as Router,  Route, Routes } from "react-router-dom";
import './App.css';
<img src={require("../images/sau.svg")} alt="Sau" className="about-logo" />


// https://primereact.org/confirmdialog/

const SignOut = () => {
    const [showConfirmDialog, setShowConfirmDialog] = useState(false);

    const handleSignOut = () => {
        // Do the logout logic here
        console.log("Logging out...");
        window.location.href = "/login";
    }; 

    return (
        <> 
        <button onClick={() => setShowConfirmDialog(true)} className="nav-action">
            Sign Out
        </button>
        {showConfirmDialog && (
            <div className='confirm dialog-content'>
                <h3>Are you sure you want to sign out?</h3>
                <button onClick={() => setShowConfirmDialog(false)} className="nav-action">Cancel</button>
                <button onClick={handleSignOut} className="nav-action">Sign Out</button>
            </div>
        )}
        </>
    );
}
export default SignOut;