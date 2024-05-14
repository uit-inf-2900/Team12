import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import Calculators from '../../pages/ProjectTracking/Calculator/Calculators'; 


describe('Calculators', () => {
    beforeEach(() => {
        render(<Calculators />);
    });

    test('See if the calculator options is on the screen', () => {
        expect(screen.getByText('Yarn')).toBeInTheDocument();
        expect(screen.getByText('Increase')).toBeInTheDocument();
        expect(screen.getByText('Decrease')).toBeInTheDocument();
    });

    test('See if when increse is active you get the correct message', ()=> {
        fireEvent.click(screen.getByText('Increase'));
        expect(screen.getByText('Increase')).toHaveClass('active');
        expect(screen.getByText('Calculate how many times you need to increase')).toBeInTheDocument();
    })

    test('See if when Yarn is active you get the correct message', ()=> {
        fireEvent.click(screen.getByText('Yarn'));
        expect(screen.getByText('Yarn')).toHaveClass('active');
        expect(screen.getByText('Calculate how many skeins your project requires')).toBeInTheDocument();
    })

    test('See if when Decrease is active you get the correct message', ()=> {
        fireEvent.click(screen.getByText('Decrease'));
        expect(screen.getByText('Decrease')).toHaveClass('active');
        expect(screen.getByText('Calculate how many decreases you need to make')).toBeInTheDocument();
    })
})