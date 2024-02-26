import React, { useState } from "react";
import { Link } from "react-router-dom"; 

import "../SignUp_LogIn/Reg.css";
import TeamImage1 from "../../images/5.png"; 
import TeamImage2 from "../../images/6.png"; 



const FAQItem = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="faq-item">
      <button className="faq-question" onClick={() => setIsOpen(!isOpen)}>
        {question}
      </button>
      {isOpen && <div className="faq-answer">{answer}</div>}
    </div>
  );
};


export const About = () => {
  return (
    <div>
      <h1 className="larger-text">Om Oss</h1>
      <p>Velkommen til vår nettside, en nettside du som strikker kanskje ikke visste at du trengte. Men fra det øyeblikket du begynner å bruke den, vil du se hvor mye enklere og mer berikende din strikkeopplevelse kan bli.</p>
      <p>I en verden hvor kreativitet og organisering går hånd i hånd, har vi skapt en plattform som ikke bare forenkler måten du håndterer dine strikkeprosjekter på, men også inspirerer til ny innovasjon innen håndarbeid.</p>

      <h2>Fantastiske funksjoner:</h2>
      <ul>
        <li>Garnlageret: Hold orden på garnsamlingen din.</li>
        <li>Strikkepinne lager: Hold orden på Strikkepinnene dine, og få full oversikt over hvilke strikkepinner som er i bruk.</li>
        <li>Oppskriftsbibliotek: Tilgang til et bredt utvalg av oppskrifter.</li>
        <li>Prosjektplanlegger: Organiser dine strikkeprosjekter.</li>
        <li>Notater: Ta notater som du får tilgang på til alle oppskriftene dine</li>
      </ul>

      {/* Button for registration */}
      <div className="signup-button-container">
        <Link to="/signup">
          <button className="signup-button">Registrer Deg Nå</button>
        </Link>
      </div>


      {/* Ofte Stilte Spørsmål (FAQ) Seksjon */}
      <section className="faq-section">
        <h2>Ofte Stilte Spørsmål (FAQ)</h2>
        <FAQItem question="Hvordan starter jeg et nytt prosjekt?" answer="For å starte et nytt prosjekt, gå til din prosjektplanlegger og klikk på 'Legg til nytt prosjekt'." />
        <FAQItem question="Hvordan kan jeg lagre mine favorittoppskrifter?" answer="Oppskrifter kan lagres ved å klikke på 'Lagre som favoritt' under hver oppskrift." />
        <FAQItem question="Hva gjør jeg hvis jeg glemmer passordet mitt?" answer="Klikk på 'Glemt passord?' på innloggingssiden for å tilbakestille passordet ditt." />
        {/* Legg til flere FAQItem komponenter etter behov */}
      </section>

      {/* Team-members */}
      <h2>Møt Teamet Bak Magien</h2>
      <div className="team-member">
        <img src={TeamImage1} alt="Team Member" className="team-member-image" />
        <div className="team-member-info">
          <h3>Eline</h3>
          <p>Rolle: Rolle i Prosjektet</p>
          <p>Bakgrunn: Kort beskrivelse av bakgrunn og ekspertise</p>
        </div>
      </div>
      <div className="team-member">
        <div className="team-member-info">
          <h3>Emilie</h3>
          <p>Rolle: Rolle i Prosjektet</p>
          <p>Bakgrunn: Kort beskrivelse av bakgrunn og ekspertise</p>
        </div>
        <img src={TeamImage2} alt="Team Member" className="team-member-image" />
      </div>
      <div className="team-member">
      <img src={TeamImage1} alt="Team Member" className="team-member-image" />
        <div className="team-member-info">
          <h3>Marie</h3>
          <p>Rolle: Rolle i Prosjektet</p>
          <p>Bakgrunn: Kort beskrivelse av bakgrunn og ekspertise</p>
        </div>
      </div>
      <div className="team-member">
        <div className="team-member-info">
          <h3>Sera</h3>
          <p>Rolle: Rolle i Prosjektet</p>
          <p>Bakgrunn: Kort beskrivelse av bakgrunn og ekspertise</p>
        </div>
        <img src={TeamImage2} alt="Team Member" className="team-member-image" />
      </div>
      <div className="team-member">
        <img src={TeamImage1} alt="Team Member" className="team-member-image" />
        <div className="team-member-info">
          <h3>Skjalg</h3>
          <p>Rolle: Rolle i Prosjektet</p>
          <p>Bakgrunn: Kort beskrivelse av bakgrunn og ekspertise</p>
        </div>
      </div>

      
    </div>
    
  );
};
