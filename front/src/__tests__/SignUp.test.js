import { render, screen, waitFor, act } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom'
import SignUp from '../pages/SignUp_LogIn/SignUp'
import userEvent from '@testing-library/user-event'
import '@testing-library/jest-dom'

import axiosMock from 'axios'; 

jest.mock('axios');

describe('Signup Component', () => {
    beforeEach(() => {
        Storage.prototype.setItem = jest.fn();
    });

    const renderWithRouter = (ui, { route = '/' } = {}) => {
        window.history.pushState({}, 'Test page', route);       
        return render(ui, { wrapper: BrowserRouter });
    };

    // Emty submittion 
    test('displays validation messages for empty form submission', async () => {
        renderWithRouter(<SignUp isLoggedIn={false}/>);
        
        const submitButton = screen.getByRole('button', { name: /sign up/i });
        await userEvent.click(submitButton);
        
        // Adjust based on required fields (4 not 5 because the retype password is not required, but must be matching)
        expect(await screen.findAllByText(/is required/i)).toHaveLength(4); 
    });

    // Invalid email format
    // test('displays error for invalid email format', async () => {
    //     renderWithRouter(<SignUp isLoggedIn={false}/>);
        
    //     await userEvent.type(screen.getByPlaceholderText(/email/i), 'invalid-email');
    //     await userEvent.click(screen.getByRole('button', { name: /sign up/i }));
        
    //     expect(await screen.findByText(/email is not valid/i)).toBeInTheDocument();
    // });

    // // Passwords do not match
    // test('displays error for non-matching passwords', async () => {
    //     renderWithRouter(<SignUp />);

    //     // Since both password and confirm password is of password type we can't use getByPlaceholderText for both
    //     const [passwordInput, confirmPasswordInput] = screen.getAllByPlaceholderText(/password/i);
    //     await userEvent.type(passwordInput, 'Test123!');
    //     await userEvent.type(confirmPasswordInput, 'Test1234!');
    // });


});