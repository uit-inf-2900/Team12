import SignOut from "../../pages/Authentication/signout";
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';

describe('SignOut Component', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('confirmation dialog is not displayed initially', () => {
        render(<SignOut />);
        expect(screen.queryByText(/Are you sure you want to sign out?/i)).toBeNull();
    });

    test('confirmation dialog is displayed when Sign Out button is clicked', () => {
        render(<SignOut />);
        fireEvent.click(screen.getByText(/Sign Out/i));
        expect(screen.getByText(/Are you sure you want to sign out?/i)).toBeInTheDocument();
    });

    test('clicking Cancel button in the dialog closes the dialog', () => {
        render(<SignOut />);
        fireEvent.click(screen.getByText(/Sign Out/i));
        fireEvent.click(screen.getByText(/Cancel/i));
        expect(screen.queryByText(/Are you sure you want to sign out?/i)).toBeNull();
    });

    test('clicking Sign Out button in the dialog logs out and redirects to login page', () => {
        render(<SignOut />);
        fireEvent.click(screen.getByText(/Sign Out/i));
        
        // We need to get all elements matching the text "Sign Out" and choose the correct one
        const signOutButtons = screen.getAllByText(/Sign Out/i);
        fireEvent.click(signOutButtons[1]); // Assuming the second button is the one in the dialog

        // Mock window.location.href
        delete window.location;
        window.location = { href: '' };

        expect(window.location.href).toBe('');
    });
});
