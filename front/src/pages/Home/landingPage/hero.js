import '../../..GlobalStyles/landing.css';
import heroIMG from '../../../images/homepage/inspiration.svg';
import {React} from 'react';






const Hero = () => {



    return(
        <div className='page-container'>
        <div className="home-container" style={{'display': 'flex', padding: '20px', alignItems:'flex-start'}}>
        {/* Show image on the right side of home page */}
            <div className="creative-content-container" style={{width:'60%', alignItems: 'center', justifyContent: 'left', display: 'flex', flexDirection: 'column'}}>
            <h3>Today is the day to be creative! </h3>
            <img src={heroIMG} style={{ alignItems: 'center'}} alt="Pile of sweaters"/>
            </div>
      </div>
    </div>
    );
}


export default Hero;