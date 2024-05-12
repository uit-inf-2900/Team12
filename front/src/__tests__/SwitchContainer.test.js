import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import SwitchContainer from '../Components/Utilities/SwitchContainer';

describe('SwitchContainer', () => {
    const mockSetActiveStatus = jest.fn();

    // Define the options for the switch
    const options = [
        { id: 'planned', label: 'Planned' },
        { id: 'in-progress', label: 'In Progress' },
        { id: 'completed', label: 'Completed' }
    ];

    // Test that the component renders
    test('Render all options', () => {
        render(<SwitchContainer options={options} activeStatus='planned' setActiveStatus={mockSetActiveStatus} />);
        options.forEach(option => {
            expect(screen.getByText(option.label)).toBeInTheDocument();
        });
    });

    test('Call setActiveStatus with id when an inactive option is clicked', () => {
        render(<SwitchContainer options={options} activeStatus='planned' setActiveStatus={mockSetActiveStatus} />);
        const inProgressOption = screen.getByText('In Progress');
        fireEvent.click(inProgressOption);
        expect(mockSetActiveStatus).toHaveBeenCalledWith('in-progress');
    });

    test('dont call setActiveStatus if the clicked option is already active', () => {
        render(<SwitchContainer options={options} activeStatus='planned' setActiveStatus={mockSetActiveStatus} />);
        const plannedOption = screen.getByText('Planned');
        fireEvent.click(plannedOption);
        expect(mockSetActiveStatus).not.toHaveBeenCalled();
    });
});
