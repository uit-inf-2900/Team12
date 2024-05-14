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
    });

    test('Verify the presence of introductory text', () => {
        expect(screen.getByText(/Welcome to the resource page!/)).toBeInTheDocument();
        expect(screen.getByText(/all the necessary measurements for your knitting projects/)).toBeInTheDocument();
        expect(screen.getByText(/Whether you're a beginner or an experienced knitter/)).toBeInTheDocument();
    });

    test('Check that the KnittingTermsTable component renders correctly', () => {
        expect(screen.getByRole('table')).toBeInTheDocument();
    });

    test('Check that the Calculators component renders correctly', () => {
        expect(screen.getByText('Calculators')).toBeInTheDocument();
    });

});
