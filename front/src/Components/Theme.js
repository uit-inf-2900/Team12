import { createTheme } from '@mui/material/styles';

const theme = createTheme({
    palette: {
            primary: {
            main: '#ffffff', 
        },
            secondary: {
            main: '#F6964B', 
        },
            error: {
            main: '#f21e08', 
        },
            background: {
            default: '#fff4f1', 
            paper: '#ffffff', 
        },
        dark: {
            main: '#000000', 
        },
            link: {
                main: '#F6964B',
                hover: '#d06514', 
        },
        text: {
            primary: '#000000', 
            secondary: '#D6AE9A', 
        },
    },
    typography: {
        fontFamily: '"Syne", sans-serif', 
        h1: {
        fontFamily: '"Rigot", sans-serif', 
        fontSize: '1.8rem',
        fontWeight: 800, 
        },
    },
    components: {
    },
    custom: {
        headerHeight: '5.5rem',
        boxShadow: '0 2px 16px rgba(0,0,0,0.1)', 
    },
});

export default theme;
