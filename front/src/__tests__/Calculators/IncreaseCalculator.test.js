import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import IncreaseCalculator from '../../pages/ProjectTracking/Calculator/IncreaseCalculator'; 


describe('IncreaseCalculator', () => {
    beforeEach(() => {
        render(<IncreaseCalculator />);
    });


    test('displays IncreaseCalculator component correctly', () => {
        expect(screen.getByText('Increase calculator')).toBeInTheDocument();
        expect(screen.getByText('Calculate how many times you need to increase')).toBeInTheDocument();
        expect(screen.getByLabelText('stitches')).toBeInTheDocument();
        expect(screen.getByLabelText('increases')).toBeInTheDocument();
        expect(screen.getByText('Calculate')).toBeInTheDocument();
    });

    test('handles input changes correctly', () => {
        const stitchesInput = screen.getByLabelText('stitches');
        const increasesInput = screen.getByLabelText('increases');

        fireEvent.change(stitchesInput, { target: { value: '20' } });
        expect(stitchesInput.value).toBe('20');

        fireEvent.change(increasesInput, { target: { value: '5' } });
        expect(increasesInput.value).toBe('5');
    });

    test('calculates and displays the correct increase pattern and new stitch count', () => {
        const stitchesInput = screen.getByLabelText('stitches');
        const increasesInput = screen.getByLabelText('increases');
        const calculateButton = screen.getByText('Calculate');

        fireEvent.change(stitchesInput, { target: { value: '20' } });
        fireEvent.change(increasesInput, { target: { value: '5' } });

        fireEvent.click(calculateButton);

        expect(screen.getByText('*Knit 4 stitches, increase 1 stitch* 5 times')).toBeInTheDocument();
        expect(screen.getByText('You now have 25 stitches on the needle')).toBeInTheDocument();
    });

    test('displays an error message for invalid input', () => {
        const stitchesInput = screen.getByLabelText('stitches');
        const increasesInput = screen.getByLabelText('increases');
        const calculateButton = screen.getByText('Calculate');

        fireEvent.change(stitchesInput, { target: { value: '-5' } });
        fireEvent.change(increasesInput, { target: { value: '5' } });

        fireEvent.click(calculateButton);

        expect(screen.getByText('Please fill in all fields with positive numbers')).toBeInTheDocument();
    });

    test('handles zero input values correctly', () => {
        const stitchesInput = screen.getByLabelText('stitches');
        const increasesInput = screen.getByLabelText('increases');
        const calculateButton = screen.getByText('Calculate');

        fireEvent.change(stitchesInput, { target: { value: '0' } });
        fireEvent.change(increasesInput, { target: { value: '0' } });

        fireEvent.click(calculateButton);

        expect(screen.getByText('Please fill in all fields with positive numbers')).toBeInTheDocument();
    });

    test('clears the error message on valid input', () => {
        const stitchesInput = screen.getByLabelText('stitches');
        const increasesInput = screen.getByLabelText('increases');
        const calculateButton = screen.getByText('Calculate');

        fireEvent.change(stitchesInput, { target: { value: '-5' } });
        fireEvent.change(increasesInput, { target: { value: '5' } });

        fireEvent.click(calculateButton);
        expect(screen.getByText('Please fill in all fields with positive numbers')).toBeInTheDocument();

        fireEvent.change(stitchesInput, { target: { value: '20' } });
        fireEvent.change(increasesInput, { target: { value: '5' } });

        fireEvent.click(calculateButton);
        expect(screen.queryByText('Please fill in all fields with positive numbers')).not.toBeInTheDocument();
    });

    test('handles non-numeric input with an error message', () => {
        const stitchesInput = screen.getByLabelText('stitches');
        const increasesInput = screen.getByLabelText('increases');
        const calculateButton = screen.getByText('Calculate');

        fireEvent.change(stitchesInput, { target: { value: 'abc' } });
        fireEvent.change(increasesInput, { target: { value: 'xyz' } });

        fireEvent.click(calculateButton);

        expect(screen.getByText('Please fill in all fields with positive numbers')).toBeInTheDocument();
    });

    test('correctly forms the increase string for different inputs', () => {
        const stitchesInput = screen.getByLabelText('stitches');
        const increasesInput = screen.getByLabelText('increases');
        const calculateButton = screen.getByText('Calculate');

        fireEvent.change(stitchesInput, { target: { value: '18' } });
        fireEvent.change(increasesInput, { target: { value: '4' } });

        fireEvent.click(calculateButton);

        expect(screen.getByText('*Knit 4 stitches, increase 1 stitch* 4 times')).toBeInTheDocument();
        expect(screen.getByText('You now have 22 stitches on the needle')).toBeInTheDocument();
    });

    test('renders the correct number of stitches remaining after increase', () => {
        const stitchesInput = screen.getByLabelText('stitches');
        const increasesInput = screen.getByLabelText('increases');
        const calculateButton = screen.getByText('Calculate');

        fireEvent.change(stitchesInput, { target: { value: '100' } });
        fireEvent.change(increasesInput, { target: { value: '20' } });

        fireEvent.click(calculateButton);

        expect(screen.getByText('You now have 120 stitches on the needle')).toBeInTheDocument();
    });
}) 