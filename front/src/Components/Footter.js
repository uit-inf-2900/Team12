import React, { useState } from 'react';
import { Box, Grid, Typography, Link, IconButton, Paper } from '@mui/material';
import Input from '@mui/material/Input';
import { NavLink } from "react-router-dom";
import Theme from './Theme';
import { ThemeProvider } from '@mui/material/styles';

import FacebookIcon from '@mui/icons-material/Facebook';
import InstagramIcon from '@mui/icons-material/Instagram';
import PinterestIcon from '@mui/icons-material/Pinterest';
import TwitterIcon from '@mui/icons-material/Twitter';
import ContactInformation from './ContactInformation'; 
import InputField from './InputField';
import Button from './Button'

// Pages the footer should link to
const FooterRouting = () => {
    return (
        <Box>
            <Typography variant="h3" >
                Useful Links
            </Typography>
            <Link href="/home"> Home </Link><br />
            <Link href="/about"> About </Link><br />
            <Link href="/contactus" > Contact us </Link><br />
        </Box>
    ); 
};

const SomeFooter = () => {
    return (
        <Box>
            <IconButton >
                <FacebookIcon />
            </IconButton>
            <IconButton >
                <InstagramIcon />
            </IconButton>
            <IconButton >
                <PinterestIcon />
            </IconButton>
            <IconButton >
                <TwitterIcon />
            </IconButton>
        </Box>
    ); 
};

const Footer = () => {
    const [email, setEmail] = useState('');

    const handleSubscribe = () => {
        // Implement your subscription logic here
        alert(`Subscribe to the newsletter with: ${email}`);
    };

    return (
        <Paper sx={{ width: '100%', py: 4 }}> 
            <Grid container spacing={3} justifyContent="center" alignItems="start">
                <Grid item xs={12} sm={3}>
                    <Typography variant="h3">
                        Knithub
                    </Typography>
                    <Box component="form" onSubmit={handleSubscribe} noValidate sx={{ mt: 1 }}>
                        <InputField
                            fullWidth
                            label="Subscribe to our newsletter"
                            variant="outlined"
                            type="email"
                            value={email}
                            onInput={e => setEmail(e.target.value)}
                            sx={{ mb: 2 }}
                        />
                        <Button iconName='send'> </Button>
                    </Box>
                    <SomeFooter />
                </Grid>
                <Grid item xs={12} sm={3}>
                    <FooterRouting />
                </Grid>
                <Grid item xs={12} sm={3}>
                    <Typography variant="h3" gutterBottom>
                        Contact Us
                    </Typography>
                    <ContactInformation />
                </Grid>
                <Grid item xs={12} sx={{ mt: 4, textAlign: 'center' }}>
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
