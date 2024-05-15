import '../../../GlobalStyles/landing.css';
import {React} from 'react';
import { Container, Grid } from '@mui/material';
import heroImg from '../../../images/logo/logoOrange.svg'



const Introduction = () => {



    return(
    <section className='light-background'>
            <Container fluid className="home-section">
                <Container className="intro-content">
                    <Grid container spacing={2}>
                        <Grid item md={6} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '1.2rem' }}>
                            <p className='home-about-body'><strong className="main-name"> KnitHub </strong>
                                is a space for avid knitters to keep all info they might need for knitting!
                                Knithub was born from Sera's vision to create a single destination for all 
                                knitting needs. This vision led to the design of a web-based platform that 
                                would not only streamline the knitting process but also provide a comprehensive 
                                system for managing projects, patterns, and supplies. 
                            </p>
                        </Grid>
                        <Grid item md={6} className="intro-header">
                            <h1 className="heading-name">
                                What even is 
                                <strong className="main-name"> KnitHub?</strong>
                            </h1>
                        </Grid>
                        
                    </Grid>
                </Container>
            </Container>
        </section>
        );



};

export default Introduction;