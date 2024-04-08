import React, { useEffect, useState } from 'react';
import {Link,  BrowserRouter as Router,  Route, Routes } from "react-router-dom";
import { jwtDecode } from 'jwt-decode'


// Import our pages
import NavBar from './Components/NavBar'
import {About} from './pages/about/about'
import {Home} from './pages/home'
import Stash from './pages/Stash/stash'
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
import ThemedFooter from './Components/Footter';



export default function App() {

  const handleLogout = () => {
    sessionStorage.removeItem('token'); // Fjerner token fra sessionStorage
    window.location.href = '/login'; // Omdirigerer brukeren til logginn-siden
  };

  // Sjekker direkte om token eksisterer i sessionStorage for å bestemme innloggingsstatus
  const [isLoggedIn, setIsLoggedIn] = useState(!!sessionStorage.getItem('token'));
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const token = sessionStorage.getItem('token');
    if(token){
      try{
        const decodedToken = jwtDecode(token);
        setIsAdmin(decodedToken.isAdmin && decodedToken.isAdmin.toLowerCase() === 'true');
      }catch(error){
        console.error('Error decoding token', error);
        setIsAdmin(false);
      }
    }
  }, []);

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
        <ThemedFooter />
      </div>
    </Router>
  );
}