import React, { useEffect, useState } from 'react';
import {Link,  BrowserRouter as Router,  Route, Routes } from "react-router-dom";


// Import our pages
import NavBar from './Components/NavBar'
import {About} from './pages/about/about'
import {Home} from './pages/home'
import {Stash} from './pages/stash'
import ResetPassword from './pages/SignUp_LogIn/ResetPassword';
import LogIn from './pages/SignUp_LogIn/LogIn';
import SignUp from './pages/SignUp_LogIn/SignUp';
import Recipes from './pages/RecipeManagement/Recipes';
import ContactUs from './pages/ContactUs/ContactUs';
import Profilepage from './pages/ProfilePage/Profilepage';
import Projects from './pages/ProjectTracking/ProjectsPage';
import AdminPage from './pages/Admin/AdminPage';
import EditProfile from './pages/ProfilePage/EditProfile';
import WishList from './pages/ProfilePage/WishList';
import NotFound from './pages/NotFound';
import ViewUsers from './pages/Admin/ViewUsers';
import ViewMessages from './pages/Admin/Messages/ViewMessages';




export default function App() {

  const handleLogout = () => {
    sessionStorage.removeItem('token'); // Fjerner token fra sessionStorage
    window.location.href = '/login'; // Omdirigerer brukeren til logginn-siden
  };

  // Sjekker direkte om token eksisterer i sessionStorage for å bestemme innloggingsstatus
  const isLoggedIn = sessionStorage.getItem('token');
  const isAdmin =  true; // TODO: get status from backend instead of hardcoding.

  return (
    <Router>
      {/* NB: sto orginalt app-container, kan være vi må endre tilbake??? */}
      <div className="page-container">          
        <NavBar isLoggedIn={isLoggedIn} handleLogout={handleLogout} isAdmin={isAdmin} />
        <div className="content-container">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/contactus" element={<ContactUs />} />

            {/* If you have admin privileges and is admin change the contact us page with the asminpage  */}
            {isLoggedIn && isAdmin ? (
              // <>
                <Route path="/adminpage" element={<AdminPage />} />
                //  <Route path="/users" element={<ViewUsers />} />
                // <Route path="/messages" element={<ViewMessages />} />
              // </> 
            ) : (
              <Route path="/contactus" element={<ContactUs />} />
            )}

            {/* If you are not logged in shou login and signup, if not show all personal options */}
            {!isLoggedIn ? (
              <>
                <Route path="/login" element={<LogIn />} />
                <Route path="/signup" element={<SignUp />} />
              </>
            ) : (
              <>
                <Route path="/stash" element={<Stash />} />
                <Route path="/recipes" element={<Recipes />} />
                <Route path='/projects' element={<Projects/>} />
                <Route path="/profile" element={<Profilepage />} />
                <Route path="/editprofile" element={<EditProfile />} />
                <Route path="/wishlist" element={<WishList />} />
              </>
            )}
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="*" element={<NotFound />} />

          </Routes>
        </div>
      </div>
    </Router>
  );
}