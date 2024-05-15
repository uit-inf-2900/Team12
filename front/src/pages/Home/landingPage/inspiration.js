import '../../../GlobalStyles/landing.css';
import {React} from 'react';
import { Container, Grid } from '@mui/material';
import INSPimg from '../../../images/homepage/inspiration.svg'
import InstagramFeed from '../../../Components/UI/InstagramFeed';



const accessTokenInsta = 'IGQWRNYjdRX3BnVHFmdVR0Qm5yR3RDWml0TTgwc3lhV1VRZAmw5U3I2eWZAkUTRKekRzOS1JWEt5REEzZA3JHX0dDSXVfdVpodWlHRXFLbngwdEtSVXhuaXdtYmRSY0dGSzhvR1NVQkhnMmlJSE5JNHFmMFJCMS1IdjAZD';


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

            <InstagramFeed accessToken={accessTokenInsta} />
        </section>

    );



};



export default Inspiration;
