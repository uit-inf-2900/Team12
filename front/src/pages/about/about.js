import React, { useState } from "react";
import { Link } from "react-router-dom"; 

import "../SignUp_LogIn/Reg.css";
import "./about.css";

import { getImageByName } from '../../images/getImageByName';


// FeatureItem component for the features section of About page
const FeatureItem = ({ imageSrc, title, description, imagePosition }) => {
  const imageToLeft = imagePosition === "left";
  return (
    <div className={`feature-item ${imageToLeft ? "image-left" : "image-right"}`}>
      {!imageToLeft && <img src={imageSrc} alt={title} className="feature-image" />}
      <div className="feature-info">
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
    <div className={`team-member ${imageToLeft ? "image-left" : "image-right"}`}>
      {imageToLeft && <img src={imageSrc} alt={name} className="team-member-image" />}
      <div className="team-member-info">
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
    <div className="about-page-container">
      <h1>
        Om Oss
      </h1>

      {/* Short intro section  */}
      <div className="about-intro-section">
      <section >
        <p>Velkommen til vår nettside, en nettside du som strikker kanskje ikke visste at du trengte. Men fra det øyeblikket du begynner å bruke den, vil du se hvor mye enklere og mer berikende din strikkeopplevelse kan bli.</p>
        <p>I en verden hvor kreativitet og organisering går hånd i hånd, har vi skapt en plattform som ikke bare forenkler måten du håndterer dine strikkeprosjekter på, men også inspirerer til ny innovasjon innen håndarbeid.</p>
      </section>
      </div>


      <h2>Fantastiske funksjoner:</h2>
      <section className="features-container">
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
    </section>

    


      {/* Button for registration */}
      <section className="features-container">
      <div className="light button">
        <Link to="/signup">
          <button>Registrer Deg Nå</button>
        </Link>
      </div>
      </section>

      {/* Team-members */}
      <h2>Møt Teamet Bak Magien</h2>
      <section className="about-team-section">
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
      </section>
      
    </div>
    
  );
};
