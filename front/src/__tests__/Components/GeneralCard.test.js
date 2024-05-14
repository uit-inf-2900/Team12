import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import GeneralCard from '../../Components/DataDisplay/GeneralCard'; 
import exampleImage from '../../images/reading.png';

describe('GeneralCard Component', () => {

    // Save some consts to use later 
    const title = "Test Card";
    const stats = [{ label: "Yarn", value: "1000" }];
    const hovermessage = "Click to view more details";
    const onEdit = jest.fn();
    const onDelete = jest.fn();
    const onClick = jest.fn();

    beforeEach(() => {
        render(
            <GeneralCard
                title={title}
                stats={stats}
                image={exampleImage}
                hovermessage={hovermessage}
                onEdit={onEdit}
                onDelete={onDelete}
                onClick={onClick}
            />
        );
    });

    test('See if the provided title is displayed', () => {
        expect(screen.getByText(title)).toBeInTheDocument();
    });

    test('shows hover message when the mouse enter and hides it when the mouse leave', () => {
        const cardImage = screen.getByAltText('Default'); 
    
        // the mouse enters the card, show the hovermessage 
        fireEvent.mouseEnter(cardImage);
        expect(screen.getByText(hovermessage)).toBeInTheDocument();
    
        // the mouse leaves the card, hide the hovermessage
        fireEvent.mouseLeave(cardImage);
        expect(screen.queryByText(hovermessage)).not.toBeInTheDocument();
    });

    test('executes onClick when the card is clicked', () => {
        fireEvent.click(screen.getByText(title));
        expect(onClick).toHaveBeenCalled();
    });

    test('shows edit and delete buttons and handles their events', () => {
        fireEvent.click(screen.getByText('Edit'));
        expect(onEdit).toHaveBeenCalled();
        
        fireEvent.click(screen.getByText('Delete'));
        expect(onDelete).toHaveBeenCalled();
    });
    
    test('See if edit and delete buttons are there based on props', () => {
        render(
            <GeneralCard
                title={title}
                onEdit={onEdit}
                onDelete={onDelete}
            />
        );
    
        // Using getAllByText and checking the number of elements
        const editButtons = screen.getAllByText('Edit');
        expect(editButtons.length).toBe(2);
        expect(editButtons[0]).toBeInTheDocument();
    
        const deleteButtons = screen.getAllByText('Delete');
        expect(deleteButtons.length).toBe(2);
        expect(deleteButtons[0]).toBeInTheDocument();
    });
    
    test('displays the correct stats', () => {
        const statElements = screen.getAllByText('Yarn: 1000');
        expect(statElements.length).toBeGreaterThan(0);
    });

});