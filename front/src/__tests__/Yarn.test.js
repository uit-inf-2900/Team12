import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import TextYarn from '../pages/Stash/Yarn/yarntext';
import YarnStash from '../pages/Stash/Yarn/Yarn';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';

describe('TextYarn Component', () => {
    test('submits yarn data correctly', async () => {
        // Mock fetchYarns function and onClose function
        const fetchYarns = jest.fn().mockResolvedValueOnce();
        const onClose = jest.fn();
    
        // Mock fetch function to return a mocked response
        global.fetch = jest.fn().mockResolvedValueOnce({
            ok: true,
            json: () => Promise.resolve({ success: true }),
        });

        // Render TextYarn component
        const { getByLabelText, getByText } = render(<TextYarn fetchYarns={fetchYarns} onClose={onClose} />);
    
        // Fill in form fields
        fireEvent.change(getByLabelText('Brand'), { target: { value: 'Test Brand' } });
        fireEvent.change(getByLabelText('Type'), { target: { value: 'Test Type' } });
        fireEvent.change(getByLabelText('Color'), { target: { value: 'Test Color' } });
        fireEvent.change(getByLabelText('Weight'), { target: { value: '100' } });
    
        // Submit form
        fireEvent.click(getByText('Add'));
    
        // Wait for fetchYarns to be called
        await waitFor(() => expect(fetchYarns).toHaveBeenCalledTimes(1));
    
        // Check if onClose is called
        expect(onClose).toHaveBeenCalledTimes(1);
    });
});

describe('YarnStash component', () => {
    beforeEach(() => {
        jest.spyOn(global, 'fetch').mockRestore();
    });

    test('fetches yarns on mount', async () => {
        // Mock the response of the fetch call
        const mockYarnData = {
            yarnInventory: [
                { itemId: 1, manufacturer: 'Test Brand 1', type: 'Test Type 1', color: 'Test Color 1', weight: 'Test Weight 1', gauge: 'Test Gauge 1' },
                { itemId: 2, manufacturer: 'Test Brand 2', type: 'Test Type 2', color: 'Test Color 2', weight: 'Test Weight 2', gauge: 'Test Gauge 2' },
            ]
        };
        jest.spyOn(global, 'fetch').mockResolvedValueOnce({
            ok: true,
            json: () => Promise.resolve(mockYarnData)
        });

        render(<YarnStash />);

        // Wait for the yarns to be rendered based on fetched data
        await waitFor(() => {
            expect(document.querySelector('.card-container')).toBeInTheDocument();
            expect(document.querySelector('.card-container').children.length).toBe(2); // Assuming each yarn is rendered as a card
            expect(document.querySelector('.card-container').textContent).toContain('Test Brand 1');
            expect(document.querySelector('.card-container').textContent).toContain('Test Brand 2');
        });
    });

    // Add more tests as needed
});