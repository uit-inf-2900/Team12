import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect'; 

import { CustomButton } from '../Components/Button';

describe('CustomButton component', () => {
    test('renders button with children', () => {
        const { getByText } = render(<CustomButton>Click Me</CustomButton>);
        expect(getByText('Click Me')).toBeInTheDocument();
    });

    test('renders button with specified icon', () => {
        const { container } = render(<CustomButton iconName="send" />);
        const icon = container.querySelector('svg');
        expect(icon).toBeInTheDocument();
    });

    test('calls onClick prop when button is clicked', () => {
        const onClickMock = jest.fn();
        const { getByText } = render(<CustomButton onClick={onClickMock}>Click Me</CustomButton>);
        const button = getByText('Click Me');

        // Click the button
        fireEvent.click(button);

        // Check if onClick prop is called
        expect(onClickMock).toHaveBeenCalledTimes(1);
    });

    test('renders button as full width if fullWidth prop is true', () => {
        const { getByRole } = render(<CustomButton fullWidth>Click Me</CustomButton>);
        const button = getByRole('button');
        expect(button).toHaveStyle('width: 100%');
    });

    test('renders button as type submit if submit prop is true', () => {
        const { getByRole } = render(<CustomButton submit>Submit</CustomButton>);
        const button = getByRole('button');
        expect(button).toHaveAttribute('type', 'submit');
    });

});
