import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect'; 
import ViewUsers from '../pages/Admin/Users/ViewUsers';
import axios from 'axios';



describe('Tests for the view user component', () => {
    test('renders the search user text field', () => {
        render(<ViewUsers />);
        const searchField = screen.getByRole('textbox');
        expect(searchField).toBeInTheDocument();
    });

    test('handles search input', () => {
        render(<ViewUsers />);
        const searchField = screen.getByLabelText(/Search Users/i);
        fireEvent.change(searchField, { target: { value: 'john' } });
        expect(searchField.value).toBe('john');
    });

    
});
