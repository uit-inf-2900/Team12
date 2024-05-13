import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { render, fireEvent, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import axios from 'axios';
import ContactUs, { FAQSection, ContactDetails } from '../pages/ContactUs/ContactUs'; 



// Mock axios for handling post requests
jest.mock('axios');

describe('ContactUs Page', () => {

    // ================ Contact us form ================
    describe('Contact Form', () => {
        // Before each test, render the contact us form 
        beforeEach(() => {
            render(<ContactUs />, { wrapper: BrowserRouter });
        });

        // Test the contact form, and if it displays what we expect 
        test('renders the contact form correctly', () => {
            expect(screen.getByText('Send us a message')).toBeInTheDocument();
            expect(screen.getByLabelText('Full Name')).toBeInTheDocument();
            expect(screen.getByLabelText('Email')).toBeInTheDocument();
            expect(screen.getByLabelText('Message')).toBeInTheDocument();
        });
    });

    // ================  FAQ section ================
    describe('FAQSection', () => {
        beforeEach(() => {
            render(<FAQSection />, { wrapper: BrowserRouter });
        });

        test('toggles FAQ answer on question click', () => {
            const question = screen.getByText('How do I change my password if I have forgotten it?');
            expect(screen.queryByText('If you have forgotten your password, please contact us at post@knithub.no.')).not.toBeInTheDocument();

            fireEvent.click(question);
            expect(screen.getByText('If you have forgotten your password, please contact us at post@knithub.no.')).toBeInTheDocument();

            fireEvent.click(question);
            expect(screen.queryByText('If you have forgotten your password, please contact us at post@knithub.no.')).not.toBeInTheDocument();
        });
    });

     // ================ Contact details ================

    describe('ContactDetails', () => {
        test('renders contact details correctly', () => {
            render(<ContactDetails />, { wrapper: BrowserRouter });
            expect(screen.getByAltText('Contact us')).toBeInTheDocument();
        });
    });
});
