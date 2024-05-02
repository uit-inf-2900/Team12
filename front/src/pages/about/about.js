import React, { useState } from "react";
import { Link } from "react-router-dom"; 

import "../../GlobalStyles/main.css";
import "./about.css";
import { CustomButton } from "../../Components/Button";

import { getImageByName } from '../../images/getImageByName';


// FeatureItem component for the features section of About page
const FeatureItem = ({ imageSrc, title, description, imagePosition }) => {
  const imageToLeft = imagePosition === "left";
  return (
    // Check if you want the image to be on the left or right side of the text
    <div className={`feature-item ${imageToLeft ? "image-left" : "image-right"}`}>
      {!imageToLeft && <img src={imageSrc} alt={title} className="feature-image" />}
      <div className="section-container"  style={{display:'block'}}>
        <h3>{title}</h3>
        <p>{description}</p>
      </div>
      {imageToLeft && <img src={imageSrc} alt={title} className="feature-image" />}
    </div>
  );
};

// TeamMember component for the team section of About page 
const TeamMember = ({ imageSrc, name, role, background, imagePosition }) => {
  const imageToLeft = imagePosition === "left";
  return (
    <div className={`feature-item  ${imageToLeft ? "image-left" : "image-right"}`}>
      {imageToLeft && <img src={imageSrc} alt={name} className="team-member-image" />}
      <div className="section-container"  style={{display:'block'}}>
        <h3>{name}</h3>
        <p>Rolle: {role}</p>
        <p>Bakgrunn: {background}</p>
      </div>
      {!imageToLeft && <img src={imageSrc} alt={name} className="team-member-image" />}
    </div>
  );
};


export const About = () => {
  return (
    <div className="page-container">
      <h1>
        About us
      </h1>

      {/* Short intro section  */}
      <div className="section-container">
        <p>Velkommen til vår nettside, en nettside du som strikker kanskje ikke visste at du trengte. Men fra det øyeblikket du begynner å bruke den, vil du se hvor mye enklere og mer berikende din strikkeopplevelse kan bli.</p>
        <p>I en verden hvor kreativitet og organisering går hånd i hånd, har vi skapt en plattform som ikke bare forenkler måten du håndterer dine strikkeprosjekter på, men også inspirerer til ny innovasjon innen håndarbeid.</p>
      </div>

      {/* Features section */}
      <h2>Fantastiske funksjoner:</h2>
      <div className="section-container">
        <FeatureItem
          imagePosition = "left"
          imageSrc={getImageByName('stash')}
          title="Resources page"
          description="En oversikt over alt du kan trenge av ressurser for strikking. Her finner du blant annet et table med alle forkortelsene du trenger å vite."
        />
        <FeatureItem
          imageSrc={getImageByName('yarnSheep')}
          title="Garnlageret"
          description="Hold orden på garnsamlingen din."
        />
        <FeatureItem
          imagePosition = "left"
          imageSrc={getImageByName('yarnBasket')}
          title="Strikkepinne lager"
          description="Hold orden på Strikkepinnene dine, og få full oversikt over hvilke strikkepinner som er i bruk."
        />
        <FeatureItem
          imageSrc={getImageByName('books')}
          title="Oppskriftsbibliotek"
          description="Tilgang til et bredt utvalg av oppskrifter."
        />
        <FeatureItem
          imagePosition = "left"
          imageSrc={getImageByName('reading')}
          title="Prosjektplanlegger"
          description="Organiser dine strikkeprosjekter."
        />
        <FeatureItem
          imageSrc={getImageByName('openBook')}
          title="Notater"
          description="Ta notater som du får tilgang på til alle oppskriftene dine."
        />
      </div>


      {/* Button for registration */}
      <div  style={{"justify-content":"center", width:'100%'}}>
          <Link to="/signup " className="section-container" style={{'text-decoration': 'none'}}>
            <CustomButton themeMode="light" submit={true} fullWidth={true}>
              Sign up 
            </CustomButton>
          </Link>
      </div>

      {/* Team-members */}
      <h2>Møt Teamet Bak Magien</h2>
      <div className="section-container">
        <TeamMember
          name="Eline"
          role="Rolle i Prosjektet"
          background="Kort beskrivelse av bakgrunn og ekspertise"
          imageSrc={getImageByName('yarnSheep')}
        />
        <TeamMember
          imagePosition = "left"
          name="Emilie"
          role="Rolle i Prosjektet"
          background="Kort beskrivelse av bakgrunn og ekspertise"
          imageSrc={getImageByName('yarnSheep')}
        />
        <TeamMember
          imageSrc={getImageByName('huggingYarn')}
          name="Marie"
          role="Rolle i Prosjektet"
          background="Kort beskrivelse av bakgrunn og ekspertise"
        />
        <TeamMember
          imagePosition = "left"
          imageSrc={getImageByName('knitting')}
          name="Sera"
          role="Rolle i Prosjektet"
          background="Kort beskrivelse av bakgrunn og ekspertise"
        />
        <TeamMember
          imageSrc={getImageByName('yarnSheep')}
          name="Skjalg"
          role="Rolle i Prosjektet"
          background="Kort beskrivelse av bakgrunn og ekspertise"
        />
      </div>
    </div>
  );
};
