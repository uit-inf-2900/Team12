
import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect'; 

import InputField from '../../Components/UI/InputField';


describe('InputField component', () => {
    test('renders InputField component', () => {
        render(<InputField />);
    });

    test('renders correct label', () => {
        const { getByLabelText } = render(<InputField label="Username" />);
        expect(getByLabelText('Username')).toBeInTheDocument();
    });

    test('toggles password visibility', () => {
        const { getByLabelText, getByRole } = render(<InputField label="Password" type="password" />);
        const passwordInput = getByLabelText('Password');
        const visibilityButton = getByRole('button', { name: /toggle password visibility/i }); 
        
        expect(passwordInput.type).toBe('password');
        fireEvent.click(visibilityButton);
        expect(passwordInput.type).toBe('text');
    });    

    test('displays error message', () => {
        const { getByText } = render(<InputField label="Username" errors={{ message: 'Required' }} />);
        expect(getByText('Required')).toBeInTheDocument();
    });
    
    test('calls onSubmit when send button is clicked', () => {
        const handleSubmit = jest.fn();
        const { getByRole } = render(<InputField type="send" onSubmit={handleSubmit} />);
        fireEvent.click(getByRole('button'));
        expect(handleSubmit).toHaveBeenCalled();
    });
    
    
}); 