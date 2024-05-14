import React from 'react';
import { createRoot } from 'react-dom/client';
import { act } from 'react-dom/test-utils';
import { render, screen , fireEvent} from '@testing-library/react';
import '@testing-library/jest-dom';
import ViewUsers from '../../pages/Admin/Users/ViewUsers';


// Helper function to render the component within the test
function renderComponent() {
    const container = document.createElement('div');
    document.body.appendChild(container);
    const root = createRoot(container);
    act(() => {
        root.render(<ViewUsers />);
    });
    return root;
}

describe('ViewUsers', () => {
    let root;

    beforeEach(() => {
        // Mock global fetch API
        global.fetch = jest.fn(() =>
            Promise.resolve({
                json: () => Promise.resolve([
                    { fullName: 'John Doe', email: 'john@example.com', isAdmin: false, status: 'active', userId: 1 },
                    { fullName: 'Jane Doe', email: 'jane@example.com', isAdmin: true, status: 'active', userId: 2 }
                ]),
                ok: true
            })
        );
    });

    afterEach(() => {
        if (root) {
            act(() => root.unmount());
        }
        document.body.innerHTML = '';
    });

    

    test('Test view user component, and see if the users is showing on the screen', async () => {
        await act(async () => {
            root = renderComponent();
        });
        expect(screen.getByText(/John Doe/)).toBeInTheDocument();
        expect(screen.getByText(/Jane Doe/)).toBeInTheDocument();
    });


    test('checks admin status changes and interaction', async () => {
        await act(async () => {
            root = renderComponent();
        });

        // Simulating admin status change
        const adminButton = screen.getByText('Add Admin'); 
        act(() => {
            adminButton.dispatchEvent(new MouseEvent('click', { bubbles: true }));
        });

        // Ensure that the API call was made and the UI updates accordingly
        expect(fetch).toHaveBeenCalledTimes(1); 
        expect(screen.getByText('Remove Admin')).toBeInTheDocument(); 
    });

    
    test('searches for users based on input', async () => {
        await act(async () => {
            root = renderComponent();
        });
    
        const searchInput = screen.getByLabelText('Search Users');
        fireEvent.change(searchInput, { target: { value: 'John' } });
    
        expect(screen.getByText('John Doe')).toBeInTheDocument();
        expect(screen.queryByText('Jane Doe')).not.toBeInTheDocument();
    });
    
    test('Test the search user text field', () => {
        render(<ViewUsers />);
        const searchField = screen.getByRole('textbox');
        expect(searchField).toBeInTheDocument();
    });

    test('handles the search input', () => {
        render(<ViewUsers />);
        const searchField = screen.getByLabelText(/Search Users/i);
        fireEvent.change(searchField, { target: { value: 'john' } });
        expect(searchField.value).toBe('john');
    });
});
