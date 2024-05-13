import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import NavBar from '../../Components/navigation/NavBar'; 


// Tests for the NavBar component
describe('NavBar Component', () => {

    // Helper function for testing routing. Simulate navigating to a specific route and render the UI with the router
    const renderWithRouter = (ui, { route = '/' } = {}) => {
        window.history.pushState({}, 'Test page', route);       
        return render(ui, { wrapper: BrowserRouter });
    };


    /* ============================== NOT SIGNED IN NAVBAR TESTS ============================== */

    // Test for ensuring sign up and log in links are rendered when the user is logged out
    test('renders everything you should have accsess to if not signed in', async () => {
        renderWithRouter(<NavBar isLoggedIn={false} />);
        expect(screen.getByText('Sign Up').getAttribute('href')).toBe('/signup');
        expect(screen.getByText('Log In').getAttribute('href')).toBe('/login');
        expect(screen.getByText('Home').getAttribute('href')).toBe('/');
        expect(screen.getByText('About').getAttribute('href')).toBe('/about');
        expect(screen.getByText('Contact us').getAttribute('href')).toBe('/contactus'); 
    });

    /* ============================== SIGNED IN NAVBAR TESTS ============================== */

    // Test for ensuring profile and log out options are rendered when the user is logged in
    test('renders everything you should have accsess to when logged in', () => {
        renderWithRouter(<NavBar isLoggedIn={true} />);
        expect(screen.getByText('Profile').getAttribute('href')).toBe('/profile');
        expect(screen.getByText('Home').getAttribute('href')).toBe('/');
        expect(screen.getByText('Recipes').getAttribute('href')).toBe('/recipes');
        expect(screen.getByText('Projects').getAttribute('href')).toBe('/projects');
        expect(screen.getByText('Stash').getAttribute('href')).toBe('/stash');
    });


    /* ============================== ADMIN NAVBAR TESTS ============================== */

    // Admin-specific tests
    test('does not show admin page for non-admins', () => {
        renderWithRouter(<NavBar isLoggedIn={true} isAdmin={false} />);
        const adminLink = screen.queryByText('Admin');
        expect(adminLink).not.toBeInTheDocument();
    });

    test('renders admin page for admins', () => {
        renderWithRouter(<NavBar isLoggedIn={true} isAdmin={true} />);
        const adminLink = screen.getByText('Admin').getAttribute('href');
        expect(adminLink).toBe('/adminpage');
    });
});
