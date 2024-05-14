import {React} from 'react';
import heroImg from '../../images/logo/logoOrange.svg'
import { Container, Grid } from '@mui/material';
import MultiCardCarousel from './carousel';

import '../../GlobalStyles/landing.css';




const AboutLanding = () => {

    return ( 

        <section>
            <Container fluid className="home-about-section">
                <Container className="home-about-body">
                    <Grid container spacing={2} >
                            <h1 style={{ fontSize: "2.6em" }} className="home-about-description">
                            LET US <span className="bold-text"> INTRODUCE </span> OUR TEAM
                            </h1>
                        <Grid item md={12} className="home-about-description">
                            <MultiCardCarousel></MultiCardCarousel>
                            
                        </Grid>
                    </Grid>
                </Container>
            </Container>
        </section>

    );

};


export default AboutLanding;