import React from "react";
import EmailIcon from '@mui/icons-material/Email';
import PhoneInTalkIcon from '@mui/icons-material/PhoneInTalk';
import LocationOnIcon from '@mui/icons-material/LocationOn';



/**
 * Component for displaying contact information.
 */
const ContactInformation = () => {
    return (
        <div style={{ display: "flex", flexDirection: "column" }}>
            <p style={{ display: "flex", alignItems: "center", marginBottom: "10px" }} data-testid="email">
                <EmailIcon sx={{ marginRight: "10px" }} /> 
                <a href="mailto:post@knithub.no">post@knithub.no</a>
            </p>

            <p style={{ display: "flex", alignItems: "center", marginBottom: "10px" }} data-testid="address">
                <LocationOnIcon sx={{ marginRight: "10px" }} /> 
                <a href="https://maps.google.com?q=Hansine+Hansens+veg+56,+9019+Tromsø">Hansine Hansens veg 56, 9019 Tromsø</a>
            </p>
        </div>
    );
};

export default ContactInformation;
