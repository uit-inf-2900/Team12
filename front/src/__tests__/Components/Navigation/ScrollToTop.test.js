import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import ScrollToTop from '../../../Components/navigation/scrollToTop';

describe('ScrollToTop', () => {
  it('scrolls to top when pathname changes', () => {
    // Render the ScrollToTop component within a MemoryRouter
    render(
      <MemoryRouter initialEntries={['/current-page']}>
        <ScrollToTop />
      </MemoryRouter>
    );

    // Simulate a change in pathname
    history.pushState({}, 'New Page', '/new-page');

    // Assert that window has scrolled to top
    expect(window.scrollY).toBe(0);
  });
});
