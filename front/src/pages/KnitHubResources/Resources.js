import React from "react";
import KnittingTermsTable from "./KnittingTermsTable";


function Resources() {

    return (
        <div>
            <h1>Resources</h1>
            <p>
                Welcome to the resource page! Here you can find all the necessary measurements for your knitting 
                projects, along with a comprehensive list of knitting abbreviations, and more. Whether you're a 
                beginner or an experienced knitter, this is your resource to ensure every project is 
                just right.
            </p>            

            <KnittingTermsTable />
            {/*  Add videos, and more stuff here  */}
        </div>
    )

};


export default Resources;
