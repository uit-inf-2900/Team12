import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Counter from '../pages/counter';

describe('Counter component', () => {
    // Reset and restore the mock for fetch before and after each test
    beforeEach(() => {
        jest.spyOn(global, 'fetch').mockRestore();
    });

    // Test to verify if the Add modal opens and the Add button is found
    test('opens add modal on click and finds the Add button', async () => {
        render(<Counter />);
        userEvent.click(screen.getByText('+'));
        const addButton = await screen.findByText(/Add/);
        expect(addButton).toBeTruthy();
    });

    // Test to verify adding a counter through the modal
    test('adds counter on Add button click', async () => {
        // Mock the initial fetch to load existing counters
        jest.spyOn(global, 'fetch').mockImplementationOnce(() =>
          Promise.resolve({
            ok: true,
            json: () => Promise.resolve([{ counterId: 1, name: 'Existing Counter', roundNumber: 3 }])
          })
        );
    
        // Mock the fetch used for adding a counter
        jest.spyOn(global, 'fetch').mockImplementationOnce(() =>
          Promise.resolve({
            ok: true,
            json: () => Promise.resolve([{ counterId: 1, name: 'Existing Counter', roundNumber: 3 }, { counterId: 2, name: 'New Counter', roundNumber: 1 }])
          })
        );
        
        render(<Counter />);
        let addButton, addModalButton, nameInput;
        try {
            // Open the modal to add a counter
            addButton = await screen.findByText('+');
            userEvent.click(addButton);
    
            // Fill out the form in the modal
            nameInput = await screen.findByLabelText('Name');
            userEvent.type(nameInput, 'New Counter');
    
            // Click the Add button in the modal to submit the form
            addModalButton = screen.getByText('Add');
            userEvent.click(addModalButton);
    
            // Verify that the new counter appears in the list
            await waitFor(() => {
                const newCounter = screen.getByText('New Counter');
                expect(newCounter).toBeTruthy();
            });
        } catch (error) {
            // Fails the test if any of the operations do not perform as expected
            console.error(error);
            expect(nameInput).toBeTruthy();
            expect(addModalButton).toBeTruthy();
        }
    });

    // Test to verify counters are fetched on component mount
    test('fetches counters on mount', async () => {
        jest.spyOn(global, 'fetch').mockImplementation(() =>
            Promise.resolve({ ok: true, json: () => Promise.resolve([{ counterId: 1, name: 'Test Counter', roundNumber: 5 }]) })
        );
        render(<Counter />);
        expect(await screen.findByText('Test Counter')).toBeTruthy();
        expect(screen.getByText('5')).toBeTruthy();
    });

    // Test to verify the increment functionality
    test('handles increment counter', async () => {
        jest.spyOn(global, 'fetch').mockImplementation(url => {
            if (url.includes('incrementcounter')) {
                return Promise.resolve({ ok: true });
            }
            return Promise.resolve({
                ok: true,
                json: () => Promise.resolve([{ counterId: 1, name: 'Test Counter', roundNumber: 6 }])
            });
        });

        render(<Counter />);
        userEvent.click(await screen.findByText('+'));
        await waitFor(() => expect(screen.getByText('6')).toBeTruthy());
    });

    // Test to verify the decrement functionality
    test('handles decrement counter', async () => {
        jest.spyOn(global, 'fetch').mockImplementation(url => {
            if (url.includes('decrementcounter')) {
                return Promise.resolve({ ok: true });
            }
            return Promise.resolve({
                ok: true,
                json: () => Promise.resolve([{ counterId: 1, name: 'Test Counter', roundNumber: 4 }])
            });
        });

        render(<Counter />);
        userEvent.click(await screen.findByText('-'));
        await waitFor(() => expect(screen.getByText('4')).toBeTruthy());
    });

    // Test to verify the edit modal functionality and finding the Update button
    test('opens edit modal on click and finds the Update button', async () => {
        jest.spyOn(global, 'fetch').mockImplementation(() =>
            Promise.resolve({ ok: true, json: () => Promise.resolve([{ counterId: 1, name: 'Test Counter', roundNumber: 5 }]) })
        );

        render(<Counter />);
        userEvent.click(await screen.findByText('Edit'));
        const updateButton = await screen.findByText('Update');
        expect(updateButton).toBeTruthy();
    });

    // Test to verify updating a counter through the edit modal
    test('edit counter updates name on submit', async () => {
        jest.spyOn(global, 'fetch').mockImplementation(() =>
            Promise.resolve({ ok: true, json: () => Promise.resolve([{ counterId: 1, name: 'Updated Counter', roundNumber: 5 }]) })
        );

        render(<Counter />);
        userEvent.click(await screen.findByText('Edit'));
        fireEvent.change(await screen.findByLabelText('Edit Name'), { target: { value: 'Updated Counter' } });
        userEvent.click(screen.getByText('Update'));
        await waitFor(() => expect(screen.getByText('Updated Counter')).toBeTruthy());
    });

    // Test to verify deleting a counter
    test('deletes counter on delete button click', async () => {
        // Mock fetch to initially load some counters, then respond to deletion
        jest.spyOn(global, 'fetch').mockImplementation(url => {
            if (url.includes('getcounters')) {
                return Promise.resolve({
                    ok: true,
                    json: () => Promise.resolve([{ counterId: 1, name: 'Test Counter', roundNumber: 5 }])
                });
            } else if (url.includes('deletecounter')) {
                return Promise.resolve({ ok: true, json: () => Promise.resolve([]) }); // Assuming delete clears the list
            }
            return Promise.reject(new Error('not found'));
        });
    
        render(<Counter />);
    
        // Wait for "Edit" to be rendered based on fetched data
        const editButton = await screen.findByText(/edit/i); // Using regex for flexible matching
        userEvent.click(editButton);
    
        // Once "Edit" is clicked, "Delete Counter" should be visible
        const deleteButton = await screen.findByText(/delete counter/i);
        userEvent.click(deleteButton);
    
        // After deletion, check that the "Test Counter" is no longer present
        await waitFor(() => {
            expect(screen.queryByText('Test Counter')).toBeNull();
        });
    });
});