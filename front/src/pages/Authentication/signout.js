import React, { useState } from 'react';
import { BrowserRouter as Router,  Route, Routes } from "react-router-dom";
<img src={require("../images/sau.svg")} alt="Sau" className="about-logo" />
import "../../GlobalStyles/main.css";
import { CustomButton } from '../../Components/UI/Button';



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
                <CustomButton themeMode="light" onClick={() => setShowConfirmDialog(false)}>Cancel</CustomButton>   
                <CustomButton themeMode="light" onClick={handleSignOut}>Sign Out</CustomButton>
            </div>
        )}
        </>
    );
}
export default SignOut;