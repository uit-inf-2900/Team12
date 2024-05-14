import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { About, FeatureItem, TeamMember } from '../pages/about/about';

describe('About Page', () => {
    describe('General Display', () => {
        test('test About page content', () => {
            sessionStorage.setItem('token', '');  // simulate not logged in
            render(<About />, { wrapper: BrowserRouter });
            expect(screen.getByText('About KnitHub')).toBeInTheDocument();
            expect(screen.getByText('Meet the team behind the magic')).toBeInTheDocument();
        });

        test('shows the sign up button when not logged in', () => {
            sessionStorage.removeItem('token');  // ensure user is not logged in
            render(<About />, { wrapper: BrowserRouter });
            expect(screen.getByText('Sign up')).toBeInTheDocument();
        });

        test('does not show the sign up button when logged in', () => {
            sessionStorage.setItem('token', 'dummy-token');  // simulate logged in
            render(<About />, { wrapper: BrowserRouter });
            expect(screen.queryByText('Sign up')).toBeNull();
        });

        test('displays the introductory text', () => {
            render(<About />, { wrapper: BrowserRouter });
            expect(screen.getByText(/Welcome to our website, dedicated to all the passionate knitters out there/)).toBeInTheDocument();
            expect(screen.getByText(/The team consists of both knitters and developers/)).toBeInTheDocument();
            expect(screen.getByText(/The idea of Knithub came from Sera/)).toBeInTheDocument();
        });
    });

    describe('FeatureItem Component', () => {
        test('test with the image on the left', () => {
            render(<FeatureItem imageSrc="test-image.jpg" title="Test Feature" description="A great feature" imagePosition="left" />);
            const image = screen.getByRole('img');
            expect(image).toHaveClass('feature-image');
            expect(image.parentElement).toHaveClass('image-left');
        });

        test('test with the image on the right', () => {
            render(<FeatureItem imageSrc="test-image.jpg" title="Test Feature" description="A great feature" imagePosition="right" />);
            const image = screen.getByRole('img');
            expect(image).toHaveClass('feature-image');
            expect(image.parentElement).toHaveClass('image-right');
        });

        test('test feature item content is displeyed correctly', () => {
            render(<FeatureItem imageSrc="test-image.jpg" title="Test Feature" description="A great feature" imagePosition="left" />);
            expect(screen.getByText('Test Feature')).toBeInTheDocument();
            expect(screen.getByText('A great feature')).toBeInTheDocument();
        });
    });

    describe('TeamMember Component', () => {
        test('test that team member details is displeyed correctly', () => {
            render(
                <TeamMember 
                name="John Doe" 
                role="Developer" 
                background="Background info" 
                imageSrc="test-image.jpg" 
                mail="john.doe@example.com" 
                imagePosition="left"
                />
            );

            // See if the Team-member info is displayed 
            expect(screen.getByText('John Doe')).toBeInTheDocument();
            expect(screen.getByText('Developer')).toBeInTheDocument();
            expect(screen.getByText('Background info')).toBeInTheDocument();
            expect(screen.getByText('john.doe@example.com')).toBeInTheDocument();
        });
        
        test('renders with the image on the left', () => {
            render(
                <TeamMember 
                    name="John Doe" 
                    role="Developer" 
                    background="Background info" 
                    imageSrc="test-image.jpg" 
                    mail="john.doe@example.com" 
                    imagePosition="left"
                />
            );
            const image = screen.getByRole('img');
            expect(image).toHaveClass('team-member-image');
            expect(image.parentElement).toHaveClass('image-left');
        });
    });
});
