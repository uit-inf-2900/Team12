import React, { useState } from 'react';
import { Link, Box, Grid, Typography, IconButton, Paper, Button, Alert } from '@mui/material';
import { useForm } from 'react-hook-form';


import FacebookIcon from '@mui/icons-material/Facebook';
import InstagramIcon from '@mui/icons-material/Instagram';
import PinterestIcon from '@mui/icons-material/Pinterest';
import GitHubIcon from '@mui/icons-material/GitHub';
import ContactInformation from '../Forms/ContactInformation'; 
import InputField from '../UI/InputField';

import SetAlert from '../UI/Alert';



/**
 * Returns usefull links to pages for the footer 
 */
export const FooterRouting = () => {
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


/**
 * Returns social media icons that is used in the footer
 */ 
export const SomeFooter = () => {
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


/**
 * Component for the footer containing subscription form, social icons, and contact information.
 */
const Footer = () => {
    const [email, setEmail] = useState('');
    const { register, handleSubmit, formState: { errors }, reset, setError, clearErrors } = useForm();
    const [alertOpen, setAlertOpen] = useState(false);
    const [alertSeverity, setAlertSeverity] = useState('info');
    const [alertMessage, setAlertMessage] = useState('');


    const updateAlert = (message, severity) => {
        setAlertMessage(message);
        setAlertSeverity(severity);
        setAlertOpen(true);
    };

    /**
     * Handles subscription form submission.
     * Sends a request to the server to subscribe to the newsletter.
     */
    const handleSubscribe = async (data) => {
        event.preventDefault(); 
        try {
            const response = await fetch(`http://localhost:5002/api/newsletter/addsubscriber?subEmail=${email}`, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ subEmail: email })
            });
            if (response.ok) {
                reset(); 
                updateAlert('You have successfully subscribed to our newsletter!', 'success');
                setEmail(''); 
            } else {
                const errorText = await response.text();
                setError('email', { type: 'manual', message: errorText });
            }
        } catch (error) {
            console.error('Network error:', error);
            setError('email', { type: 'manual', message: 'Network error, please try again later.' });
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
                    <SetAlert open={alertOpen} setOpen={setAlertOpen} severity={alertSeverity} message={alertMessage} />

                    {/* The input field for the user to add its email addrss */}
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
                            errors={errors.email}
                            type="send" 
                            value={email}
                            onChange={(event) => {
                                setEmail(event.target.value);
                                clearErrors('email');
                            }}
                            onSubmit={handleSubmit(handleSubscribe)}
                        />

                        {/* Show error messages */}
                        {errors.email && <div>{errors.email.message}</div>}
                    </form>

                    {/* The SOME links are under the subscription input */}
                    <SomeFooter />
                </Grid>

                {/* The footer routing is in the middle */}
                <Grid item xs={12} sm={3}>
                    <FooterRouting />
                </Grid>

                {/* The contact information is on the right side */}
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
