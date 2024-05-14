import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import DecreaseCalculator from '../../pages/ProjectTracking/Calculator/DecreaseCalculator'; 


describe('DecreaseCalculator', () => {
    beforeEach(() => {
        render(<DecreaseCalculator />);
    });

    test('displayes DecreaseCalculator component correctly', () => {
        expect(screen.getByText('Decrease calculator')).toBeInTheDocument();
        expect(screen.getByText('Calculate how many decreases you need to make')).toBeInTheDocument();
        expect(screen.getByLabelText('stitches')).toBeInTheDocument();
        expect(screen.getByLabelText('decreases')).toBeInTheDocument();
        expect(screen.getByText('Calculate')).toBeInTheDocument();
    });

    test('handles input changes correctly', () => {
        const stitchesInput = screen.getByLabelText('stitches');
        const decreasesInput = screen.getByLabelText('decreases');

        fireEvent.change(stitchesInput, { target: { value: '20' } });
        expect(stitchesInput.value).toBe('20');

        fireEvent.change(decreasesInput, { target: { value: '5' } });
        expect(decreasesInput.value).toBe('5');
    });


    test('calculates and displays the correct decrease number and new stitch count', () => {
        const stitchesInput = screen.getByLabelText('stitches');
        const decreasesInput = screen.getByLabelText('decreases');
        const calculateButton = screen.getByText('Calculate');

        fireEvent.change(stitchesInput, { target: { value: '20' } });
        fireEvent.change(decreasesInput, { target: { value: '5' } });

        fireEvent.click(calculateButton);

        expect(screen.getByText('*Knit 3 stitches, knit 2 together* Repeat 5 times')).toBeInTheDocument();
        expect(screen.getByText('You now have 15 stitches on the needle')).toBeInTheDocument();
    });

    test('displays an error message for invalid input', () => {
        const stitchesInput = screen.getByLabelText('stitches');
        const decreasesInput = screen.getByLabelText('decreases');
        const calculateButton = screen.getByText('Calculate');

        fireEvent.change(stitchesInput, { target: { value: '-5' } });
        fireEvent.change(decreasesInput, { target: { value: '5' } });

        fireEvent.click(calculateButton);

        expect(screen.getByText('Please fill in all fields with positive numbers')).toBeInTheDocument();
    });

    test('handles zero input values correctly', () => {
        const stitchesInput = screen.getByLabelText('stitches');
        const decreasesInput = screen.getByLabelText('decreases');
        const calculateButton = screen.getByText('Calculate');

        fireEvent.change(stitchesInput, { target: { value: '0' } });
        fireEvent.change(decreasesInput, { target: { value: '0' } });

        fireEvent.click(calculateButton);

        expect(screen.getByText('Please fill in all fields with positive numbers')).toBeInTheDocument();
    });

    test('clears the error message on valid input', () => {
        const stitchesInput = screen.getByLabelText('stitches');
        const decreasesInput = screen.getByLabelText('decreases');
        const calculateButton = screen.getByText('Calculate');

        fireEvent.change(stitchesInput, { target: { value: '-5' } });
        fireEvent.change(decreasesInput, { target: { value: '5' } });

        fireEvent.click(calculateButton);
        expect(screen.getByText('Please fill in all fields with positive numbers')).toBeInTheDocument();

        fireEvent.change(stitchesInput, { target: { value: '20' } });
        fireEvent.change(decreasesInput, { target: { value: '5' } });

        fireEvent.click(calculateButton);
        expect(screen.queryByText('Please fill in all fields with positive numbers')).not.toBeInTheDocument();
    });

    test('handles non-numeric input with an error message', () => {
        const stitchesInput = screen.getByLabelText('stitches');
        const decreasesInput = screen.getByLabelText('decreases');
        const calculateButton = screen.getByText('Calculate');

        fireEvent.change(stitchesInput, { target: { value: 'abc' } });
        fireEvent.change(decreasesInput, { target: { value: 'xyz' } });

        fireEvent.click(calculateButton);

        expect(screen.getByText('Please fill in all fields with positive numbers')).toBeInTheDocument();
    });

    test('displays an error in the case where number of decreases is greater than number of stitches', () => {
        const stitchesInput = screen.getByLabelText('stitches');
        const decreasesInput = screen.getByLabelText('decreases');
        const calculateButton = screen.getByText('Calculate');

        fireEvent.change(stitchesInput, { target: { value: '5' } });
        fireEvent.change(decreasesInput, { target: { value: '10' } });

        fireEvent.click(calculateButton);

        expect(screen.getByText('You do not have enough stitches to make that many decreases.')).toBeInTheDocument();
    });

    test('correctly forms the decreases string for different inputs', () => {
        const stitchesInput = screen.getByLabelText('stitches');
        const decreasesInput = screen.getByLabelText('decreases');
        const calculateButton = screen.getByText('Calculate');

        fireEvent.change(stitchesInput, { target: { value: '18' } });
        fireEvent.change(decreasesInput, { target: { value: '4' } });

        fireEvent.click(calculateButton);

        expect(screen.getByText('*Knit 3 stitches, knit 2 together* Repeat 3 times, knit the last 5 stitches, knit 2 together')).toBeInTheDocument();
        expect(screen.getByText('You now have 14 stitches on the needle')).toBeInTheDocument();
    });

    test('renders the correct number of stitches remaining after decrease', () => {
        const stitchesInput = screen.getByLabelText('stitches');
        const decreasesInput = screen.getByLabelText('decreases');
        const calculateButton = screen.getByText('Calculate');

        fireEvent.change(stitchesInput, { target: { value: '100' } });
        fireEvent.change(decreasesInput, { target: { value: '20' } });

        fireEvent.click(calculateButton);

        expect(screen.getByText('You now have 80 stitches on the needle')).toBeInTheDocument();
    });
})