import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Resources from '../pages/KnitHubResources/Resources'; 


describe('Resources Component', () => {
    beforeEach(() => {
        render(<Resources />);
    });

    test('Check that all the sections are there', () => {
        expect(screen.getByText('Resources')).toBeInTheDocument();
        expect(screen.getByText('Knitting Abbreviations')).toBeInTheDocument();
        expect(screen.getByText('Calculators')).toBeInTheDocument();
        expect(screen.getByText('Inspiration from Instagram')).toBeInTheDocument();
    });
});
