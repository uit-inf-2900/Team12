import React from 'react';
import { createRoot } from 'react-dom/client';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect'; 
import ContactInformation from '../Components/Forms/ContactInformation';

describe('ContactInformation component', () => {
    test('renders contact information', () => {
        const root = document.createElement('div');
        createRoot(root).render(<ContactInformation />);
        const { getByTestId } = render(<ContactInformation />, { container: root });

        // Check that the contact information is displayed correctly
        const emailElement = getByTestId('email');
        const addressElement = getByTestId('address');

        // Check that one get the expected text content
        expect(emailElement).toHaveTextContent('post@knithub.no');
        expect(addressElement).toHaveTextContent('Hansine Hansens veg 56, 9019 Tromsø');
    });
});
