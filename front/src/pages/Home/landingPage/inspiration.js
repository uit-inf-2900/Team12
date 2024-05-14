import '../../../GlobalStyles/landing.css';
import {React} from 'react';
import { Container, Grid } from '@mui/material';
import INSPimg from '../../../images/homepage/inspiration.svg'





const Inspiration = () => {


    return(
        <section className='Hero-section'>
            <Container fluid className="home-section">
                <Container className="home-content">
                    <Grid container spacing={2}>
                        
                        <Grid item md={7} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                            <img src={INSPimg} style={{ width: 600 }} />
                        </Grid>
                        
                    </Grid>
                    <Grid>
                    
                        
                    </Grid>
                </Container>
            </Container>
        </section>

    );



};



export default Inspiration;