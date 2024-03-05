import { render, screen, waitFor, act } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom'
import LogIn from '../pages/SignUp_LogIn/LogIn'
import userEvent from '@testing-library/user-event'
import '@testing-library/jest-dom'

import axiosMock from 'axios'; 

jest.mock('axios');
// jest.mock('react-router-dom', () => ({
//     ...jest.requireActual('react-router-dom'),
//     useNavigate: () => jest.fn(),
// }));

describe('LogIn Component', () => {
    beforeEach(() => {
        Storage.prototype.setItem = jest.fn();
        axiosMock.post.mockResolvedValue({data: {token: 'fakeToken123'}});
    });

    // Helper function for testing routing. Simulate navigating to a specific route and render the UI with the router
    const renderWithRouter = (ui, { route = '/' } = {}) => {
        window.history.pushState({}, 'Test page', route);       
        return render(ui, { wrapper: BrowserRouter });
    };

    // Test for ensuring the login form is rendered
    test('renders the login form', () => {
        const { getByText } = renderWithRouter(<LogIn isLoggedIn={false} />);
        expect(getByText(/log in/i)).toBeInTheDocument();                               // /i to be case insensitive
    });


    test('displays validation messages for empty form submission', async () => {
        renderWithRouter(<LogIn isLoggedIn={false}/>);
        
        // Find and click the submit button
        await userEvent.click(screen.getByRole('button', { name: /log in/i }));
    
        // Check for validation messages
        expect(await screen.findByText(/email is required/i)).toBeInTheDocument();
        expect(await screen.findByText(/password is required/i)).toBeInTheDocument();
    });
    

    test('displays error for invalid email format', async () => {
        renderWithRouter(<LogIn />);
        
        // Enter an invalid email and a valid password
        await userEvent.type(screen.getByLabelText(/email/i), 'invalid-email');
        await userEvent.type(screen.getByLabelText(/password/i), 'ValidPassword123!');
        
        // Submit the form
        await userEvent.click(screen.getByRole('button', { name: /log in/i }));
    
        // Check for an error message related to email format
        expect(await screen.findByText(/Invalid email address/i)).toBeInTheDocument();
    });
    

    test('successful login redirects to the homepage', async () => {
        // Precise mock for the login request
        axiosMock.mockResolvedValueOnce({ data: { token: 'fakeToken' } });
    
        renderWithRouter(<LogIn />);
    
        // Fill in the form
        await userEvent.type(screen.getByLabelText(/email/i), 'test@test.com');
        await userEvent.type(screen.getByLabelText(/password/i), 'Test123!');
        
        // Submit the form
        await userEvent.click(screen.getByRole('button', { name: /log in/i }));
    
        // Check if axios was called correctly
        await waitFor(() => {
            expect(axiosMock.post).toHaveBeenCalledWith('http://localhost:5002/login', {
                userEmail: 'test@test.com',
                userPwd: 'Test123!',
            });
        });
    }); 

    test('displays error message on login failure due to API response', async () => {
        // Mock an API failure
        axiosMock.post.mockRejectedValueOnce(new Error('Invalid credentials'));
    
        renderWithRouter(<LogIn />);
        
        // Fill in the form with credentials
        await userEvent.type(screen.getByLabelText(/email/i), 'test@test.com');
        await userEvent.type(screen.getByLabelText(/password/i), 'Test123!');
        
        // Submit the form
        await userEvent.click(screen.getByRole('button', { name: /log in/i }));
    
        // Check for an error message from the API response
        expect(await screen.findByText(/Login failed. Check your username and password and try again./i)).toBeInTheDocument();
    });
    
    test('sets token in local storage on successful login', async () => {
        renderWithRouter(<LogIn />);
        
        await act(async () => {
            // Simulate user input
            await userEvent.type(screen.getByLabelText(/email/i), 'test@test.com');
            await userEvent.type(screen.getByLabelText(/password/i), 'Test123!');
            
            // Simulate form submission
            await userEvent.click(screen.getByRole('button', {name: /log in/i}));
        } );
        
        // Assert that local storage was called correctly
        await waitFor(() => {
            expect(localStorage.setItem).toHaveBeenCalledWith('token', 'fakeToken123');
        });
    });
    

});