import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';


/**
 * A function that ensures that the page is scrolled to the top when changing page 
 */
const ScrollToTop = () => {
    const { pathname } = useLocation();

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [pathname]);

    return null; 
}

export default ScrollToTop;
