import '../../../GlobalStyles/landing.css';
import {React} from 'react';
import { Container, Grid } from '@mui/material';
import INSPimg from '../../../images/homepage/inspiration.svg'





const Inspiration = () => {


    return(
        <section className='light-background'>
            <Container fluid className="home-section">
                <Container className="home-content">
                    <Grid container spacing={2}>
                        
                        <Grid item md={8} style={{ display: 'flex', justifyContent: 'left', alignItems: 'left' }}>
                            <img src={INSPimg} style={{ width: 600 }} />
                        </Grid>
                        <Grid item md={4} >

                        </Grid>
                        
                    </Grid>
                </Container>
            </Container>
        </section>

    );



};



export default Inspiration;