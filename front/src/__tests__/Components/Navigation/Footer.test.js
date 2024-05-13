import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import Footer, { FooterRouting, SomeFooter } from '../../../Components/navigation/Footter'; 
import userEvent from '@testing-library/user-event';


describe('Footer', () => {
    beforeEach(() => {
        render(<Footer />, { wrapper: BrowserRouter });
    });

    test('renders all the useful links correctly', () => {
        const links = screen.getAllByRole('link');
        expect(screen.getByText('Home').closest('a')).toHaveAttribute('href', '/');
        expect(screen.getByText('About').closest('a')).toHaveAttribute('href', '/about');
        expect(screen.getByText('Contact us').closest('a')).toHaveAttribute('href', '/contactus');
        expect(screen.getByText('Resources').closest('a')).toHaveAttribute('href', '/resources');
    });
});
