import { render, screen, waitFor, act } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import LogIn from '../../pages/Authentication/LogIn'
import userEvent from '@testing-library/user-event'
import '@testing-library/jest-dom'
import axiosMock from 'axios'; 

jest.mock('axios');

/**
 * Mocks for navigation and localStorage
 */
jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => jest.fn(),
}));

describe('LogIn Component', () => {
    beforeEach(() => {
        // Mock setting items in localStorage
        Storage.prototype.setItem = jest.fn();
        // Mock a successful axios POST request
        axiosMock.post.mockResolvedValue({data: {token: 'fakeToken123'}});
    });

    /**
     * Helper function to render the component within a router context.
     * This is useful for testing components that are connected to the React Router.
     */
    const renderWithRouter = (ui, { route = '/' } = {}) => {
        window.history.pushState({}, 'Test page', route);       
        return render(ui, { wrapper: MemoryRouter });
    };

    /**
     * Test to check if the login form is rendered properly.
     */
    test('renders the login form', () => {
        const { getByText } = renderWithRouter(<LogIn isLoggedIn={false} />);
        expect(getByText(/log in/i)).toBeInTheDocument();
    });

    /**
     * Test to check for display of validation messages when the form is submitted empty.
     */
    test('displays validation messages for empty form submission', async () => {
        // Render the LogIn component
        renderWithRouter(<LogIn isLoggedIn={false}/>);

        // Wrap the click event in act() as it will trigger state updates
        await act(async () => {
            await userEvent.click(screen.getByRole('button', { name: /log in/i }));
        });
        
        // Assertions for validation messages
        expect(await screen.findByText(/email is required/i)).toBeInTheDocument();
        expect(await screen.findByText(/password is required/i)).toBeInTheDocument();
    });

    
    test('logs in successfully with valid credentials', async () => {
        // Mock successful login response
        axiosMock.post.mockResolvedValueOnce({ data: { token: 'fakeToken123' } });
    
        // Render the LogIn component
        renderWithRouter(<LogIn isLoggedIn={false} />);
    
        // Fill out and submit the form
        await userEvent.type(screen.getByTestId('email-input'), 'test@example.com');
        await userEvent.type(screen.getByTestId('password-input'), 'password123');
        await userEvent.click(screen.getByRole('button', { name: /log in/i }));
    

        // Check if the user is redirected to the home page
        expect(window.location.href).toEqual('http://localhost/');
        });
    

    test('displays validation message for empty password', async () => {
        // Render the LogIn component
        renderWithRouter(<LogIn isLoggedIn={false}/>);

        // Fill out the form with an empty password
        await userEvent.type(screen.getByTestId('email-input'), 'test@example.com');
        await userEvent.click(screen.getByRole('button', { name: /log in/i }));

        // Check if the validation message for empty password is displayed
        expect(await screen.findByText(/password is required/i)).toBeInTheDocument();
    });

    test('displays validation message for empty email', async () => {
        // Render the LogIn component
        renderWithRouter(<LogIn isLoggedIn={false}/>);

        // Fill out the form with an empty email
        await userEvent.type(screen.getByTestId('password-input'), 'password123');
        await userEvent.click(screen.getByRole('button', { name: /log in/i }));

        // Check if the validation message for empty email is displayed
        expect(await screen.findByText(/email is required/i)).toBeInTheDocument();
    }); 


});
