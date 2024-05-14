import {React} from 'react';
import heroImg from '../../images/logo/logoOrange.svg'
// import Container from 'react-bootstrap/Container';
// import Row from 'react-bootstrap/Row';
// import Col from 'react-bootstrap/Col';
import { Container, Grid } from '@mui/material';


import '../../GlobalStyles/landing.css';




const Hero = ({}) => {

    return(

        <section>
            <Container fluid className="home-section">
                <Container className="home-content">
                    <Grid container spacing={2}>
                        <Grid item md={5} className="home-header">
                            <h1 style={{ paddingBottom: 15 }} className="heading">
                                Hi There!
                                <span className="wave" role="img" aria-labelledby="wave">
                                    👋🏻
                                </span>
                            </h1>
                            <h1 className="heading-name">
                                Welcome to
                                <strong className="main-name"> KnitHub</strong>
                            </h1>
                        </Grid>
                        <Grid item md={7} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                            <img src={heroImg} style={{ width: 500 }} />
                        </Grid>
                    </Grid>
                </Container>
            </Container>
        </section>


    );

}


export default Hero;