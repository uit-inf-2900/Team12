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
                default: isDarkMode ? 'var(--dark-background-color)' : 'var(--background-color)',
                paper: isDarkMode ? 'var(--dark-background-color)' : 'var(--second-light)',
            },
            dark: {
                main: '#000000',
            },
            link: {
                main: 'var(--link-color)',
                hover: 'var(--link-hover-color)',
            },
            text: {
                primary: isDarkMode ? '#ffffff' : '#000000',
                secondary: '#D6AE9A',
            },
        },
        typography: {
            fontFamily: 'var(--body-font)',
            fontSize: '1.0rem',
            h1: {
                fontFamily: 'var(--main-font)',
                fontSize: 'var(--h1-font-size)',
                fontWeight: 'var(--font-semi-bold)',
            },
            h2: {
                fontFamily: 'var(--main-font)',
                fontSize: 'var(--h2-font-size)',
                fontWeight: 'var(--font-semi-bold)',
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
                        backgroundColor: isDarkMode ? 'var(--button-bg-colo-dark:)' : 'var(--button-bg-colo-light)',
                        color: isDarkMode ? 'var(--button-text-color-light)' : 'var(--button-text-color-dark)',
                        '&:hover': {
                            backgroundColor: isDarkMode ? 'var(--button-hover-dark)' : 'var(--button-hover-light)',
                            opacity: 0.8,
                        },
                    },
                },
            },
            MuiTextField: {
                styleOverrides: {
                    root: {
                        '& .MuiInputLabel-outlined.MuiInputLabel-shrink': {
                            transform: 'translate(14px, -6px) scale(0.75)', // Adjust this transformation as needed
                        },
                    },
                },
            },
            MuiOutlinedInput: {
                styleOverrides: {
                    root: {
                        // Ensuring that the input field's background color goes all the way to the border for multiline
                        backgroundColor: 'var(--color-inputbox)',
                        '&.Mui-focused': {
                        backgroundColor: 'var(--color-inputbox)', // Maintain background color when focused
                        },
                        '&:hover:not(.Mui-disabled):not(.Mui-focused):not(.Mui-error) .MuiOutlinedInput-notchedOutline': {
                        borderColor: 'transparent', // Optionally remove the border on hover
                        },
                    },
                    input: {
                        '&.MuiInputBase-inputMultiline': {
                        // Ensure multiline input fills the container's height
                        height: '100%',
                        },
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
