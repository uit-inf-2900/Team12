import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom'; // Import jest-dom for custom matchers
import { BrowserRouter as Router } from 'react-router-dom';
import NotFound from '../../Components/DataDisplay/NotFound';

describe('NotFound Component', () => {
    // Before each test, render the NotFound component
    beforeEach(() => {
        render(
            <Router>
                <NotFound />
            </Router>
        );
    });

    // Test if the component renders a heading with "404 - Page Not Found"
    test('displays the heading with the 404 error message', () => {
        const heading = screen.getByRole('heading', { name: /404 - page not found/i });
        expect(heading).toBeInTheDocument();
    });

    // Test if the component renders an explanation of the error
    test('displays an error explanation', () => {
        const explanation = screen.getByText(/sorry, the page you are looking for could not be found\./i);
        expect(explanation).toBeInTheDocument();
    });

    // Test if the component contains a link back to the home page
    test('contains a link to the home page', () => {
        const link = screen.getByRole('link', { name: /home page/i });
        expect(link).toBeInTheDocument();
        expect(link).toHaveAttribute('href', '/');
    });

     // Test if clicking on the home page link redirects to the home page
    test('redirects to home page when clicking on home page link', () => {
        const link = screen.getByRole('link', { name: /home page/i });

        // Simulate a click on the link
        fireEvent.click(link);

        // Assert that the URL has changed to the home page URL
        expect(window.location.pathname).toBe('/');
    });
});

