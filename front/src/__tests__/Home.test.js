import { Home } from "../pages/Home/home";
import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { BrowserRouter as Router } from 'react-router-dom';

describe('Home Component', () => {
    let mock;

    beforeAll(() => {
        mock = new MockAdapter(axios);
    });

    afterEach(() => {
        mock.reset();
    });

    afterAll(() => {
        mock.restore();
    });

    test('renders correctly and fetches profile information', async () => {
        jest.spyOn(Storage.prototype, 'getItem').mockImplementation((key) => {
            return key === 'token' ? 'mock-token' : null;
        });

        mock.onGet('http://localhost:5002/getprofileinfo?userToken=mock-token').reply(200, {
            userFullName: 'John Doe',
            userEmail: 'john.doe@example.com'
        });

        render(
            <Router>
                <Home />
            </Router>
        );

        await waitFor(() => {
            expect(screen.getByText(/Hello, good to see you John Doe!/i)).toBeInTheDocument();
        });

        Storage.prototype.getItem.mockRestore();
    });

    test('fetches and displays yarn inventory', async () => {
        jest.spyOn(Storage.prototype, 'getItem').mockImplementation((key) => {
            return key === 'token' ? 'mock-token' : null;
        });

        mock.onGet('http://localhost:5002/api/inventory/get_inventory?userToken=mock-token').reply(200, {
            yarnInventory: [{ id: 1 }, { id: 2 }],
            needleInventory: []
        });

        render(
            <Router>
                <Home />
            </Router>
        );

        await waitFor(() => {
            expect(screen.getByText(/yarns in stash/i)).toBeInTheDocument();
            expect(screen.getByText('2')).toBeInTheDocument(); // yarnInventoryLength
        });

        Storage.prototype.getItem.mockRestore();
    });

    test('fetches and displays needle inventory', async () => {
        jest.spyOn(Storage.prototype, 'getItem').mockImplementation((key) => {
            return key === 'token' ? 'mock-token' : null;
        });

        mock.onGet('http://localhost:5002/api/inventory/get_inventory?userToken=mock-token').reply(200, {
            yarnInventory: [],
            needleInventory: [{ id: 1 }]
        });

        render(
            <Router>
                <Home />
            </Router>
        );

        await waitFor(() => {
            expect(screen.getByText(/needles in stash/i)).toBeInTheDocument();
            expect(screen.getByText('1')).toBeInTheDocument(); // needleInventoryLength
        });

        Storage.prototype.getItem.mockRestore();
    });

    test('handles errors gracefully', async () => {
        jest.spyOn(Storage.prototype, 'getItem').mockImplementation((key) => {
            return key === 'token' ? 'mock-token' : null;
        });

        mock.onGet('http://localhost:5002/getprofileinfo?userToken=mock-token').reply(500);
        mock.onGet('http://localhost:5002/api/inventory/get_inventory?userToken=mock-token').reply(500);
        mock.onGet('http://localhost:5002/getcompleteprojects?userToken=mock-token').reply(500);
        mock.onGet('http://localhost:5002/getongoingprojects?userToken=mock-token').reply(500);

        render(
            <Router>
                <Home />
            </Router>
        );

        await waitFor(() => {
            expect(screen.getByText(/Hello, good to see you/i)).toBeInTheDocument();
        });

        Storage.prototype.getItem.mockRestore();
    });

    test('displays Instagram feed correctly', async () => {
        jest.spyOn(Storage.prototype, 'getItem').mockImplementation((key) => {
            return key === 'token' ? 'mock-token' : null;
        });

        mock.onGet('http://localhost:5002/getprofileinfo?userToken=mock-token').reply(200, {
            userFullName: 'John Doe',
            userEmail: 'john.doe@example.com'
        });

        mock.onGet('http://localhost:5002/api/inventory/get_inventory?userToken=mock-token').reply(200, {
            yarnInventory: [{ id: 1 }, { id: 2 }],
            needleInventory: [{ id: 1 }]
        });

        mock.onGet('http://localhost:5002/getcompleteprojects?userToken=mock-token').reply(200, {
            completeProjects: 3
        });

        mock.onGet('http://localhost:5002/getongoingprojects?userToken=mock-token').reply(200, {
            ongoingProjects: 2
        });

        render(
            <Router>
                <Home />
            </Router>
        );

        await waitFor(() => {
            expect(screen.getByText(/Here are some inspiration from Instagram/i)).toBeInTheDocument();
        });

        Storage.prototype.getItem.mockRestore();
    });
});
