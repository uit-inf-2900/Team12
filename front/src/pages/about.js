import React from "react";
import { Link } from "react-router-dom"; // Importer Link for navigasjon

import "./SignUp_LogIn/Reg.css";
import TeamImage1 from "../images/5.png"; // Endre stien etter hvor bildet ditt faktisk er.
import TeamImage2 from "../images/6.png"; // Endre stien etter hvor bildet ditt faktisk er.
// Importer flere bilder hvis det er nødvendig for alle teammedlemmene.

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

          {/* Legg til en knapp for å registrere seg */}
            <div className="signup-button-container">
        <Link to="./signup">
          <button className="signup-button">Registrer Deg Nå</button>
        </Link>
      </div>

      <h2>Møt Teamet Bak Magien</h2>
      {/* Eksempel for et teammedlem. Gjenta dette for hvert medlem */}
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
      {/* Gjenta for andre medlemmer */}
    </div>
  );
};
