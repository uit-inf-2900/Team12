import { createTheme } from '@mui/material/styles';
import './../GlobalStyles/main.css';

const Theme = (mode) => {
    // Ensure mode is either 'light' or 'dark'
    const isDarkMode = mode === 'dark';

    return createTheme({
        palette: {
            mode: isDarkMode ? 'dark' : 'light',
            primary: {
                main: isDarkMode ? '#474747' : '#ffffff',
            },
            secondary: {
                main: '#F6964B',
            },
            error: {
                main: '#f21e08',
            },
            background: {
                default: isDarkMode ? '#474747' : '#fff4f1',
                paper: isDarkMode ? '#474747' : '#ffffff',
            },
            dark: {
                main: '#000000',
            },
            link: {
                main: '#F6964B',
                hover: '#d06514',
            },
            text: {
                primary: isDarkMode ? '#ffffff' : '#000000',
                secondary: '#D6AE9A',
            },
        },
        typography: {
            fontFamily: '"Syne", sans-serif',
            fontSize: '1.0rem',
            h1: {
                fontFamily: '"Rigot", sans-serif',
                fontSize: '1.8rem',
                fontWeight: 800,
            },
        },
        components: {
            // Button style 
            MuiButton: {
                styleOverrides: {
                    root: {
                        borderRadius: '5px',
                        cursor: 'pointer',
                        margin: '0 auto',
                        marginTop: '10px',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        textTransform: 'none',
                        backgroundColor: isDarkMode ? '#474747' : '#ffffff',
                        color: isDarkMode ? '#ffffff' : '#000000',
                        '&:hover': {
                            backgroundColor: '#F6964B',
                            opacity: 0.8,
                        },
                    },
                },
            },
            MuiInputBase: {
                styleOverrides: {
                    input: {
                        fontFamily: '"Rigot", sans-serif',
                        backgroundColor: '#f7f7f7',
                    },
                },
            },
        },
        custom: {
            headerHeight: '5.5rem',
            boxShadow: '0 2px 16px rgba(0,0,0,0.1)',
        },
    });
};

export default Theme;
