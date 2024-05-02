import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom'; // Import jest-dom for custom matchers
import { BrowserRouter as Router } from 'react-router-dom';
import NotFound from '../pages/NotFound';

describe('NotFound Component', () => {
    test('renders NotFound correctly', () => {
        render(
            <Router>
                <NotFound />
            </Router>
        );

        // Check for the 404 error message
        const heading = screen.getByRole('heading', { name: /404 - page not found/i });
        expect(heading).toBeInTheDocument();

        // Check for the error explanation
        const explanation = screen.getByText(/sorry, the page you are looking for could not be found\./i);
        expect(explanation).toBeInTheDocument();

        // Check that the link to the home page is present and correct
        const link = screen.getByRole('link', { name: /home page/i });
        expect(link).toBeInTheDocument();
        expect(link).toHaveAttribute('href', '/');
    });
});
