import React, { useEffect, useState } from 'react';
import {Link,  BrowserRouter as Router,  Route, Routes } from "react-router-dom";
import { jwtDecode } from 'jwt-decode'
import ScrollToTop from './Components/navigation/scrollToTop';


// Import our pages
import NavBar from './Components/navigation/NavBar'
import {About} from './pages/about/about'
import {Home} from './pages/Home/home'
import Stash from './pages/Stash/stash'
import ResetPassword from './pages/Authentication/ResetPassword';
import LogIn from './pages/Authentication/LogIn';
import SignUp from './pages/Authentication/SignUp';
import Recipes from './pages/RecipeManagement/Recipes';
import ContactUs from './pages/ContactUs/ContactUs';
import Profilepage from './pages/ProfilePage/Profilepage';
import Projects from './pages/ProjectTracking/ProjectsPage';
import AdminPage from './pages/Admin/AdminPage';
import NotFound from './Components/DataDisplay/NotFound';
import Footer from './Components/navigation/Footter';
import Theme from './Components/Utilities/Theme';
import { ThemeProvider } from '@emotion/react';
import Resources from './pages/KnitHubResources/Resources';
import Counter from './pages/ProjectTracking/Counter/counter';
import Calculators from './pages/ProjectTracking/Calculator/Calculators';
import { HomeOut } from './pages/Home/homeOut';


export default function App() {
  const theme = Theme('light'); 

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
    <ThemeProvider theme={theme}>
      <Router>
        <ScrollToTop/>
        {/* NB: sto orginalt app-container, kan være vi må endre tilbake??? */}
        <div className="page-container">          
          <NavBar isLoggedIn={isLoggedIn} handleLogout={handleLogout} isAdmin={isAdmin} />
          <div className="content-container">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/contactus" element={<ContactUs />} />
              <Route path="/resources" element={<Resources />} />

              {/* If you have admin privileges and is admin change the contact us page with the asminpage  */}
              {isLoggedIn && isAdmin ? (
                  <Route path="/adminpage" element={<AdminPage />} />
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
                  <Route path='/Calculators' element={<Calculators/>} />
                  <Route path="/profile" element={<Profilepage />} />
                  <Route path='/counter' element={<Counter/>}/> 
                </>
              )}
              <Route path="/reset-password" element={<ResetPassword />} />
              <Route path="*" element={<NotFound />} />

            </Routes>
          </div>
          <Footer />
        </div>
      </Router>
    </ThemeProvider>
  );
}