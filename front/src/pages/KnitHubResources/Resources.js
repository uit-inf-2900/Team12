import React from "react";
import KnittingTermsTable from "./KnittingTermsTable";
import InstagramFeed from './InstagramFeed'; // Importer InstagramFeed-komponenten
import Calculators from './../ProjectTracking/Calculator/Calculators'

function Resources() {
    const accessTokenInsta = 'IGQWRNYjdRX3BnVHFmdVR0Qm5yR3RDWml0TTgwc3lhV1VRZAmw5U3I2eWZAkUTRKekRzOS1JWEt5REEzZA3JHX0dDSXVfdVpodWlHRXFLbngwdEtSVXhuaXdtYmRSY0dGSzhvR1NVQkhnMmlJSE5JNHFmMFJCMS1IdjAZD';

    return (
        <div >
            <h1>Resources</h1>
            <p>
                Welcome to the resource page! Here you can find all the necessary measurements for your knitting 
                projects, along with a comprehensive list of knitting abbreviations, and more. Whether you're a 
                beginner or an experienced knitter, this is your resource to ensure every project is 
                just right.
            </p>

            <h2>Knitting Abbreviations</h2>
            <KnittingTermsTable />

            <h2 style={{ marginTop: '40px', marginBottom: '20px' }}> Calculators </h2>
            <Calculators />



            <h2 style={{ marginTop: '40px', marginBottom: '20px' }}>Inspiration from Instagram</h2>
            <InstagramFeed accessToken={accessTokenInsta} />
        </div>
    );
}

export default Resources;
