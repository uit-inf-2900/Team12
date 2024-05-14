import ConfirmationLogout from '../../pages/Authentication/ConfirmationLogout';
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { MemoryRouter } from 'react-router-dom';

describe('ConfirmationLogout Component', () => {
    const mockOnClose = jest.fn();
    const mockOnConfirm = jest.fn();
    const message = "Are you sure you want to logout?";

    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('does not show when not open', () => {
        const { queryByRole } = render(
            <MemoryRouter>
                <ConfirmationLogout isOpen={false} onClose={mockOnClose} onConfirm={mockOnConfirm} message={message} />
            </MemoryRouter>
        );

        expect(queryByRole('dialog')).toBeNull();
    });

    test('show correctly when open', () => {
        render(
            <MemoryRouter>
                <ConfirmationLogout isOpen={true} onClose={mockOnClose} onConfirm={mockOnConfirm} message={message} />
            </MemoryRouter>
        );

        const modalElement = screen.getByRole('presentation');
        expect(modalElement).toBeInTheDocument();
        expect(screen.getByText(message)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /yes/i })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /no/i })).toBeInTheDocument();
    });

    test('calls onClose when No button is clicked', () => {
        render(
            <MemoryRouter>
                <ConfirmationLogout isOpen={true} onClose={mockOnClose} onConfirm={mockOnConfirm} message={message} />
            </MemoryRouter>
        );

        const noButton = screen.getByRole('button', { name: /no/i });
        fireEvent.click(noButton);

        expect(mockOnClose).toHaveBeenCalledTimes(1);
    });

    test('calls onConfirm when Yes button is clicked', () => {
        render(
            <MemoryRouter>
                <ConfirmationLogout isOpen={true} onClose={mockOnClose} onConfirm={mockOnConfirm} message={message} />
            </MemoryRouter>
        );

        const yesButton = screen.getByRole('button', { name: /yes/i });
        fireEvent.click(yesButton);

        expect(mockOnConfirm).toHaveBeenCalledTimes(1);
    });
});
