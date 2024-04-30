import React, { useState } from 'react';
import { Link, Box, Grid, Typography, IconButton, Paper, Button } from '@mui/material';
import Theme from './Theme';
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
            <Typography variant="h5" >
                Useful Links
            </Typography>
            <Link color='#000000' href="/"> Home </Link><br />
            <Link color='#000000' href="/about"> About </Link><br />
            <Link color='#000000' href="/contactus" > Contact us </Link><br />
            <Link color='#000000' href="/resources" > Resources </Link><br />
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
            <a href="https://www.instagram.com/team12.2900/" target="_blank" rel="noopener noreferrer">
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
    const [alert, setAlert] = useState({ severity: '', message: '' });
    const {register, handleSubmit, formState: { errors } } = useForm();
    const [error, setError] = useState('');


    const handleSubscribe = async () => {
        if (email) {
            try {
                const response = await fetch(`http://localhost:5002/api/newsletter/addsubscriber?subEmail=${email}`, {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ subEmail: email })
                });
                console.log(response);

                if (response.ok) {
                    setAlert({ severity: 'success', message: `Subscribed to the newsletter with: ${email}` });
                    setEmail('');
                } else {
                    const errorText = await response.text();
                    setAlert({ severity: 'error', message: errorText });
                }
            } catch (error) {
                setAlert({ severity: 'error', message: 'Network error, please try again later.' });
                console.error(error);
            }
        } else {
            setAlert({ severity: 'error', message: 'Please enter a valid email address.' });
        }
    };

    return (
        // Use paper for the color (can be changed in Theme)
        // Set the with to 100% and add some padding 
        <Paper sx={{ width: '100%', py: 4}}> 
            <Grid container spacing={3} justifyContent="center" alignItems="start">
                <Grid item xs={12} sm={4}>
                    <Typography variant="h5">
                        Knithub
                    </Typography>
                    <form >
                        <InputField
                            label="Subscribe to our newsletter"
                            register={register('email', {
                                required: "Email is required",
                                pattern: {
                                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                                    message: "Invalid email address"
                                }
                            })}
                            fullWidth
                            variant="outlined"
                            errors={errors.email}
                            type="send" 
                            value={email}
                            onChange={(event) => setEmail(event.target.value)}
                            onSubmit={handleSubmit(handleSubscribe)}
                        />
                        {error && <div>{error}</div>}
                        {/* <button type="submit">Subscribe</button> */}
                    </form>
                    <SomeFooter />
                </Grid>
                <Grid item xs={12} sm={3}>
                    <FooterRouting />
                </Grid>
                <Grid item xs={12} sm={4}>
                    <Typography variant="h5" gutterBottom>
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



export default Footer;
