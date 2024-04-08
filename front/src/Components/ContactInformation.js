import React from "react";
import EmailIcon from '@mui/icons-material/Email';
import PhoneInTalkIcon from '@mui/icons-material/PhoneInTalk';
import LocationOnIcon from '@mui/icons-material/LocationOn';

const ContactInformation = () => {
    return (
        <div style={{ display: "flex", flexDirection: "column" }}>
            <p style={{ display: "flex", alignItems: "center", marginBottom: "10px" }}>
                <EmailIcon sx={{ marginRight: "10px" }} /> 
                <a href="mailto:contact@knithub.com">contact@knithub.com</a>
            </p>
            <p style={{ display: "flex", alignItems: "center", marginBottom: "10px" }}>
                <PhoneInTalkIcon sx={{ marginRight: "10px" }} /> 
                <a href="tel:+4712345678">12345678</a>
            </p>
            <p style={{ display: "flex", alignItems: "center", marginBottom: "10px" }}>
                <LocationOnIcon sx={{ marginRight: "10px" }} /> 
                <a href="https://maps.google.com?q=Hansine+Hansens+veg+56,+9019+Tromsø">Hansine Hansens veg 56, 9019 Tromsø</a>
            </p>
        </div>
    );
};

export default ContactInformation;
