
import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect'; 

import InputField from '../../Components/UI/InputField';


describe('InputField component', () => {
    test('renders InputField component', () => {
        render(<InputField />);
    });

    test('see if the  label is correct', () => {
        const { getByLabelText } = render(<InputField label="Username" />);
        expect(getByLabelText('Username')).toBeInTheDocument();
    });

    test('toggle password visibility', () => {
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
    
    test('test the read-only option', () => {
        const { getByLabelText } = render(<InputField label="ReadOnly" readOnly />);
        const input = getByLabelText('ReadOnly');
        expect(input).toHaveAttribute('readonly');
    });

    test('test select options', () => {
        const options = [
            { value: 'option1', label: 'Option 1' },
            { value: 'option2', label: 'Option 2' }
        ];
        const { getByLabelText, getByText } = render(<InputField label="Select" type="select" options={options} />);
        fireEvent.mouseDown(getByLabelText('Select'));
        expect(getByText('Option 1')).toBeInTheDocument();
        expect(getByText('Option 2')).toBeInTheDocument();
    });

    test('calls onChange handler', () => {
        const handleChange = jest.fn();
        const { getByLabelText } = render(<InputField label="Change" onChange={handleChange} />);
        const input = getByLabelText('Change');
        fireEvent.change(input, { target: { value: 'new value' } });
        expect(handleChange).toHaveBeenCalled();
    });

    test('handles missing onSubmit', () => {
        const { getByRole } = render(<InputField type="send" />);
        fireEvent.click(getByRole('button'));
        expect(true).toBe(true);  // Test passes if no error is thrown
    });

    test('handles missing onChange', () => {
        const { getByLabelText } = render(<InputField label="NoChange" />);
        const input = getByLabelText('NoChange');
        fireEvent.change(input, { target: { value: 'new value' } });
        expect(true).toBe(true);  // Test passes if no error is thrown
    });
}); 