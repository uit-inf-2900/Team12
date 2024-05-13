
import Stash from '../../pages/Stash/stash'; 
import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';  // Use MemoryRouter for testing
import '@testing-library/jest-dom';

describe('Stash Component', () => {
    test('renders Yarn by default', () => {
        render(
            <MemoryRouter initialEntries={["/stash"]}>
                <Stash />
            </MemoryRouter>
        );
        expect(screen.getByText('Yarn')).toBeInTheDocument();
    });

    test('renders Needles by default', () => {
        render(
            <MemoryRouter initialEntries={["/stash"]}>
                <Stash />
            </MemoryRouter>
        );
        expect(screen.getByText('Needles')).toBeInTheDocument();
    });

    test('renders NeedleStash based on "tab" query parameter', () => {
        render(
            <MemoryRouter initialEntries={["/stash?tab=needles"]}>
                <Stash />
            </MemoryRouter>
        );
        expect(screen.getByText('Needles')).toBeInTheDocument();
    });

    test('switches to Yarn when the tab is manually set to "yarn"', () => {
        const { getByText, rerender } = render(
            <MemoryRouter initialEntries={["/stash?tab=needles"]}>
                <Stash />
            </MemoryRouter>
        );
        expect(getByText('Needles')).toBeInTheDocument(); // Verify needles are displayed
    
        // Simulate switching to 'yarn' tab
        rerender(
            <MemoryRouter initialEntries={["/stash?tab=yarn"]}>
                <Stash />
                </MemoryRouter>
            );
        expect(getByText('Yarn')).toBeInTheDocument(); // Verify yarn is now displayed
    });
});
