import React from 'react';
import '@testing-library/jest-dom';
import { createRoot } from 'react-dom/client';
import { act } from 'react-dom/test-utils';
import { render, screen , fireEvent} from '@testing-library/react';
import ViewSubscribers from '../../pages/Admin/ViewSubscribers';
import {fetchSubscribers} from '../../pages/Admin/apiServices'


describe('ViewSubscribers', () => {
    test('renders the ViewSubscribers component', () => {
        render(<ViewSubscribers />);
        expect(screen.getByText(/View Subscribers/i)).toBeInTheDocument();
    });
  

})