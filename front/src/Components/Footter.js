import React, { useState } from 'react';
import { Link, Box, Grid, Typography, IconButton, Paper, Button } from '@mui/material';
import Theme from './Theme';
import { ThemeProvider } from '@mui/material/styles';
import { useForm } from 'react-hook-form';


import FacebookIcon from '@mui/icons-material/Facebook';
import InstagramIcon from '@mui/icons-material/Instagram';
import PinterestIcon from '@mui/icons-material/Pinterest';
import GitHubIcon from '@mui/icons-material/GitHub';
import ContactInformation from './ContactInformation'; 
import InputField from './InputField';
import CustomButton from './Button'
import SendIcon from '@mui/icons-material/Send';
import SetAlert from './Alert';

// TODO: Get error if no email is entered
// TODO: Get error if email is not valid
// TODO: Get info allert if email is already subscribed
// TODO: Get success alert if the subscribtion now is successful
// TODO: Get error alert if the subscribtion is not successful


// Pages the footer should link to
const FooterRouting = () => {
    return (
        <div>
            <Typography variant="h3" >
                Useful Links
            </Typography>
            <Link color='#000000' href="/"> Home </Link><br />
            <Link color='#000000' href="/about"> About </Link><br />
            <Link color='#000000' href="/contactus" > Contact us </Link><br />
        </div>
    ); 
};

const SomeFooter = () => {
    return (
        <Box>
            <a href="https://www.facebook.com/" >
                <IconButton>
                        <FacebookIcon />
                </IconButton>
            </a>
            <a href="https://www.instagram.com/" target="_blank" rel="noopener noreferrer">
                <IconButton>
                    <InstagramIcon />
                </IconButton>
            </a>
            <a href="https://www.pinterest.com/" target="_blank" rel="noopener noreferrer">
                <IconButton>
                    <PinterestIcon />
                </IconButton>
            </a>
            <a href="https://github.com/uit-inf-2900/Team12" target="_blank" rel="noopener noreferrer">
                <IconButton>
                    <GitHubIcon />
                </IconButton>
            </a>
        </Box>
    ); 
};

const Footer = () => {
    const [email, setEmail] = useState('');
    const { register, handleSubmit, formState: { errors } } = useForm();


    const handleSubscribe = () => {
        // TODO: implement the subscribe functionality
        if(email) {
            // Alert the email
            <SetAlert severity="success" message={`Subscribe to the newsletter with: ${email}`} />
            // Reset email state
            setEmail('');
        } else {
            // Handle empty input or add validation
            <SetAlert severity="error" message="Please enter an email address." />
        }
    };

    

    return (
        // Use paper for the color (can be changed in Theme)
        // Set the with to 100% and add some padding 
        <Paper sx={{ width: '100%', py: 4 }}> 
            <Grid container spacing={3} justifyContent="center" alignItems="start">
                <Grid item xs={12} sm={4}>
                    <Typography variant="h3">
                        Knithub
                    </Typography>
                    <Box component="form"
                        onSubmit={handleSubmit(handleSubscribe)}
                        noValidate
                        sx={{
                            display: 'flex',
                            alignItems: 'flex',
                            mt: 1,
                        }}>
                        <InputField
                            fullWidth
                            label="Subscribe to our newsletter"
                            variant="outlined"
                            type="send"
                            value={email}
                            onInput={e => setEmail(e.target.value)}
                            error={errors.email}
                            helperText={errors.email?.message}
                            onSubmit={handleSubscribe}
                        />
                    </Box>
                    <SomeFooter />
                </Grid>
                <Grid item xs={12} sm={3}>
                    <FooterRouting />
                </Grid>
                <Grid item xs={12} sm={4}>
                    <Typography variant="h3" gutterBottom>
                        Contact Us
                    </Typography>
                    <ContactInformation />
                </Grid>
                <Grid item xs={9} sx={{ mt: 4, textAlign: 'center' }}>
                    <Typography variant="body2">
                        © {new Date().getFullYear()} Knithub. All rights reserved.
                    </Typography>
                </Grid>
            </Grid>
        </Paper>
    );
};

const ThemedFooter = () => {
    const theme = Theme('light');
    return (
        <ThemeProvider theme={theme}>
            <Footer />
        </ThemeProvider>
    );
};

export default ThemedFooter;
