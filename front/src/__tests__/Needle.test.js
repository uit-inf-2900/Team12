import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import NeedleStash from '../pages/Stash/Needle/Needles';
import NeedleInfo from '../pages/Stash/Needle/needletext';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';

describe('NeedleInfo Component', () => {
    const mockOnClose = jest.fn();
    const mockFetchNeedles = jest.fn();

    beforeEach(() => {
        jest.restoreAllMocks();
        // Setting up sessionStorage mock
        global.sessionStorage = {
            getItem: jest.fn().mockReturnValue('dummy-token')
        };
    });

    test('renders component with all input fields', () => {
        render(<NeedleInfo onClose={mockOnClose} fetchNeedles={mockFetchNeedles} />);
        expect(screen.getByLabelText('Type')).toBeInTheDocument();
        expect(screen.getByLabelText('Needle Size')).toBeInTheDocument();
        expect(screen.getByLabelText('Needle Length')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /upload needle/i })).toBeInTheDocument();
    });

    test('validates required fields before submitting', async () => {
        render(<NeedleInfo onClose={mockOnClose} fetchNeedles={mockFetchNeedles} />);
        userEvent.click(screen.getByRole('button', { name: /upload needle/i }));
        await waitFor(() => {
            expect(screen.getByText('Please check the highlighted fields.')).toBeInTheDocument();
        });
    });
});

describe('NeedleStash component', () => {
    test('fetches needles when component mounts', async () => {
        // Mock the fetch function
        global.fetch = jest.fn(() =>
            Promise.resolve({
            ok: true,
            json: () => Promise.resolve({ needleInventory: [{ itemId: 1, type: 'Circular', size: 4, length: 16, numInUse: false }] }),
            })
        );
    
        render(<NeedleStash setNeedleTypes={() => {}} needleTypes={[]} />);
    
        // Wait for the fetch to complete
        await waitFor(() => {
            // Assert that the fetch function was called with the correct URL
            expect(fetch).toHaveBeenCalledWith('http://localhost:5002/api/inventory/get_inventory?userToken=null');
        });
    });
});