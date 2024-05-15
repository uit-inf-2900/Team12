import React from "react";
import KnittingTermsTable from "./Terms/KnittingTermsTable";
import InstagramFeed from '../../Components/UI/InstagramFeed'; 
import Calculators from './../ProjectTracking/Calculator/Calculators'
import Inspiration from "../Home/landingPage/inspiration";


/**
 * Represents the Resources, with a table of terms, the calculators, and the instagram view 
 */
function Resources() {

    return (
        <div >
            <div style={{maxWidth:'70%', margin: '0 auto', textAlign: 'center', paddingTop:'50px'}}>
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
            </div>

            <Inspiration /> 
        </div>
    );
}

export default Resources;
