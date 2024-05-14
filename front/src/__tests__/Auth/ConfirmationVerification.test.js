// src/__tests__/Auth/ConfirmationVerification.test.js
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { act } from 'react-dom/test-utils';
import '@testing-library/jest-dom/extend-expect';
import ConfirmationVerification from '../../pages/Authentication/ConfirmationVerification';
import axios from 'axios';
import Tooltip from '@mui/material/Tooltip';
import { MemoryRouter } from 'react-router-dom';

jest.mock('axios');

describe('ConfirmationVerification Component', () => {
    const mockOnClose = jest.fn();

    beforeAll(() => {
        // Mock window.alert since JSDOM does not support it
        window.alert = jest.fn();
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    test('do not render when not open', () => {
        render(
        <MemoryRouter>
            <ConfirmationVerification isOpen={false} onClose={mockOnClose} />
        </MemoryRouter>
        );

        const modalElement = screen.queryByRole('dialog');
        expect(modalElement).not.toBeInTheDocument();
    });

    test('call onClose when Close button is clicked', () => {
        render(
        <MemoryRouter>
            <ConfirmationVerification isOpen={true} onClose={mockOnClose} />
        </MemoryRouter>
        );

        const closeButton = screen.getByRole('button', { name: /close/i });
        fireEvent.click(closeButton);

        expect(mockOnClose).toHaveBeenCalled();
    });

    test('submits verification code when Verify button is clicked', async () => {
        axios.patch.mockResolvedValue({ status: 200, data: 'new-token' });
    
        render(
            <MemoryRouter>
                <ConfirmationVerification isOpen={true} onClose={mockOnClose} />
            </MemoryRouter>
        );
    
        const input = screen.getByLabelText(/verification code/i);
        const verifyButton = screen.getByRole('button', { name: /verify/i });
    
        fireEvent.change(input, { target: { value: '123456' } });
        fireEvent.click(verifyButton);
    
        await waitFor(() => expect(axios.patch).toHaveBeenCalledWith('http://localhost:5002/verifyuser?UserToken=undefined&VerificationCode=123456'));
    });


    test('shows alert if verification fail', async () => {
        axios.patch.mockRejectedValue(new Error('Verification failed'));

        render(
        <MemoryRouter>
            <ConfirmationVerification isOpen={true} onClose={mockOnClose} />
        </MemoryRouter>
        );

        const input = screen.getByLabelText(/verification code/i);
        const verifyButton = screen.getByRole('button', { name: /verify/i });

        fireEvent.change(input, { target: { value: '123456' } });
        fireEvent.click(verifyButton);

        await waitFor(() => {
        expect(window.alert).toHaveBeenCalledWith('Verification failed: Verification failed');
        });
    });

    test('displays tooltip message when close button is hovered', async () => {
        render(
            <MemoryRouter>
                <ConfirmationVerification isOpen={true} onClose={mockOnClose} />
            </MemoryRouter>
        );

        const closeButton = screen.getByRole('button', { name: /close/i });

        fireEvent.mouseEnter(closeButton);

        const tooltip = await screen.findByRole('tooltip');
        expect(tooltip).toHaveTextContent('You can verify your user the next time you log in, or on your profile');

        fireEvent.mouseLeave(closeButton);

        await waitFor(() => {
            expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
        });
    });
});
