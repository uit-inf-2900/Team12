import { render, screen, waitFor, act } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom'
import SignUp from '../../pages/Authentication/SignUp'
import userEvent from '@testing-library/user-event'
import '@testing-library/jest-dom'

import axiosMock from 'axios'; 

jest.mock('axios');

describe('Signup Component', () => {
    /**
     * Setup before each test: mock local storage to handle storage operations.
     */
    beforeEach(() => {
        Storage.prototype.setItem = jest.fn();
    });

    /**
     * Utility function to render components with a router context.
     * This allows us to simulate routing.
     */
    const renderWithRouter = (ui, { route = '/' } = {}) => {
        window.history.pushState({}, 'Test page', route);       
        return render(ui, { wrapper: BrowserRouter });
    };

    
    /**
     * Test to ensure validation messages appear for an empty submission on the signup form.
     */
    test('displays error messages for empty form submission', async () => {
        renderWithRouter(<SignUp isLoggedIn={false}/>);
        
        const submitButton = screen.getByRole('button', { name: /sign up/i });
        await userEvent.click(submitButton);
        
        // Expected to find four "is required" messages for empty inputs
        expect(await screen.findAllByText(/is required/i)).toHaveLength(4); 
    });

    

    /**
     * Test to verify that entering an invalid email format triggers an appropriate validation message.
     */
    test('displays error messages for invalid email', async () => {      
        renderWithRouter(<SignUp isLoggedIn={false}/>);
        
        const emailInput = screen.getByTestId('email-input');
        const submitButton = screen.getByRole('button', { name: /sign up/i });

        await userEvent.type(emailInput, 'invalidEmail');
        await userEvent.click(submitButton);
        
        // Check for a specific validation message related to the email field
        expect(await screen.findByText(/Email is required/i)).toBeInTheDocument();
    }); 

    /**
     * Test to check if clicking the login button redirects the user appropriately.
     */
    test('redirects to login page when login button is clicked', async () => {
        const { getByText } = renderWithRouter(<SignUp isLoggedIn={false}/>);
        const loginButton = getByText(/log in/i);
        await userEvent.click(loginButton);

        // Check if the redirection to login page is successful
        expect(window.location.pathname).toBe('/login');
    });


});