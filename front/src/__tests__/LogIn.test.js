import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import LogIn from '../pages/SignUp_LogIn/LogIn';
import '@testing-library/jest-dom'

import axiosMock from 'axios'; 

jest.mock('axios');
jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => jest.fn(),
}));



describe('LogIn Component', () => {

    beforeEach(() => {
        axiosMock.post.mockResolvedValue({data: {}});
    });

    // Helper function for testing routing. Simulate navigating to a specific route and render the UI with the router
    const renderWithRouter = (ui, { route = '/' } = {}) => {
        window.history.pushState({}, 'Test page', route);       
        return render(ui, { wrapper: BrowserRouter });
    };

    // Test for ensuring the login form is rendered
    test('renders the login form', () => {
        const { getByText } = renderWithRouter(<LogIn isLoggedIn={false} />);
        expect(getByText(/log in/i)).toBeInTheDocument();
    });

    // Test that you get an error message if you dont fill inn the forms correctly
    test('renders error message if form is not filled in correctly', async () => {
        renderWithRouter(<LogIn isLoggedIn={false} />);
        const submitButton = screen.getByRole('button', { name: /log in/i });
        submitButton.click();
        expect(await screen.findByText(/email is required/i)).toBeInTheDocument();
        expect(await screen.findByText(/password is required/i)).toBeInTheDocument();
    });

});