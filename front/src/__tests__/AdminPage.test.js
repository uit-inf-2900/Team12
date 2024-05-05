import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import AdminPage from '../pages/Admin/AdminPage';
import { createRoot } from 'react-dom';

describe('AdminPage', () => {
    test('initially renders the Dashboard component', () => {
        render(<AdminPage />);
        expect(screen.getByText(/Admin Page/)).toBeInTheDocument();
    });


    test('toggles to ViewUsers component when users view is selected', () => {
        render(<AdminPage />);
        const toggleToUsersButton = screen.getByText(/Total number of users/);
        fireEvent.click(toggleToUsersButton);
        expect(screen.getByRole('button', { name: /Back to Dashboard/ })).toBeVisible();
        expect(screen.getByText('View all Users')).toBeInTheDocument(); 
    });
    

    test('returns to Dashboard from Users view', () => {
        render(<AdminPage />);
        const toggleToUsersButton = screen.getByText(/Total number of users/); 
        fireEvent.click(toggleToUsersButton);
        const backButton = screen.getByRole('button', { name: /Back to Dashboard/ });
        fireEvent.click(backButton);
        expect(screen.getByText(/Admin Page/)).toBeInTheDocument(); 
    });

    test('renders ViewMessages when messages view is toggled', () => {
        render(<AdminPage />);
        const toggleToMessagesButton = screen.getByText(/Total Messages/); 
        fireEvent.click(toggleToMessagesButton);
        expect(screen.getByText(/Incoming Messages/)).toBeInTheDocument(); 
    });

    test('returns to Dashboard from ViewMessages view', () => {
        render(<AdminPage />);
        const toggleToUsersButton = screen.getByText(/Total Messages/); 
        fireEvent.click(toggleToUsersButton);
        const backButton = screen.getByRole('button', { name: /Back to Dashboard/ });
        fireEvent.click(backButton);
        expect(screen.getByText(/Admin Page/)).toBeInTheDocument(); 
    });

    test('renders ViewSubscribers when newsletter view is toggled', () => {
        render(<AdminPage />);
        const toggleToNewsletterButton = screen.getByText(/Newsletter/); 
        fireEvent.click(toggleToNewsletterButton);
        expect(screen.getByText(/View Subscribers/)).toBeInTheDocument(); 
    });
});
