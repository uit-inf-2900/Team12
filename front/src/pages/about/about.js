import React, { useState } from "react";
import { Link } from "react-router-dom"; 

import "../../GlobalStyles/main.css";
import "./about.css";
import { CustomButton } from "../../Components/UI/Button";

import { getImageByName } from '../../images/getImageByName';


/**
 *  FeatureItem component for the features section of About page
 */
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

/**
 * TeamMember component for the team section of About page 
 */ 
const TeamMember = ({ imageSrc, name, role, background, imagePosition }) => {
  const imageToLeft = imagePosition === "left";
  return (
    <div className={`feature-item  ${imageToLeft ? "image-left" : "image-right"}`}>
      {imageToLeft && <img src={imageSrc} alt={name} className="team-member-image" />}
      <div className="section-container"  style={{display:'block'}}>
        <h3>{name}</h3>
        <p>Role: {role}</p>
        <p>Background: {background}</p>
      </div>
      {!imageToLeft && <img src={imageSrc} alt={name} className="team-member-image" />}
    </div>
  );
};



/**
 * Returns the about page  
 */
export const About = () => {
  // Get the token to see if the user is login 
  const token = sessionStorage.getItem('token');
  
  return (
    <div className="page-container">
      <h1>
        About KnitHub
      </h1>

      {/* Short intro section  */}
      <div className="section-container" style={{ textAlign: 'center' }}>
        <p>Welcome to our website, dedicated to all the passionate knitters out there. Our team has created a platform that simplifies the way you manage your knitting projects and also inspires new innovation in handicrafts.</p>
        <p>The team consists of both knitters and developers, and together we have made it as simple as possible for knitters to keep track of their projects and samples all in one place.</p>
        <p>The idea of Knithub came from Sera, a knitter and developer, who lost track of her projects and yarn at home.</p>      
      </div>

      {/* Features section */}
      <h2>KnitHubs functions:</h2>
      <div className="section-container">
        <FeatureItem
          imagePosition = "left"
          imageSrc={getImageByName('stash')}
          title="Resources page"
          description="Knithub do also provide a resource page where you can look up a lot of different qbbreviations, and look at some instagram images to get some inspiration for your next project."
        />
        <FeatureItem
          imageSrc={getImageByName('yarnSheep')}
          title="Yarn Stash"
          description="Say goodbye to manual searches through your yarn. Knithub's inventory system keeps you informed about what you have and what you need for upcoming projects."
        />
        <FeatureItem
          imagePosition = "left"
          imageSrc={getImageByName('yarnBasket')}
          title="Needle Stash"
          description="Say goodbye to manual searches through all your needles. Knithub's inventory system keeps you informed about what needles you have for your upcoming projects."
        />
        <FeatureItem
          imageSrc={getImageByName('books')}
          title="Pattern Organization"
          description="Knithub allows users to upload, organize, and annotate your digital knitting patterns in one central location. This feature simplifies tracking of modifications and personal touches to each pattern."
        />
        <FeatureItem
          imagePosition = "left"
          imageSrc={getImageByName('reading')}
          title="Project Tracking"
          description=" With Knithub's project dashboard, users can easily monitor their knitting progress. The platform displays completed projects, ongoing work, and upcoming tasks, facilitating better planning and organization."
        />
        <FeatureItem
          imageSrc={getImageByName('openBook')}
          title="Notater"
          description="Ta notater som du får tilgang på til alle oppskriftene dine."
        />
      </div>


      {/* Button for registration. Should only be there if you are not signed in*/}
      {!token && (
        <div  style={{"justify-content":"center", width:'100%'}}>
            <Link to="/signup " className="section-container" style={{'text-decoration': 'none'}}>
              <CustomButton themeMode="light" submit={true} fullWidth={true}>
                Sign up 
              </CustomButton>
            </Link>
        </div>
      )}

      {/* Team-members */}
      <h2>Meet the team behind the magic</h2>
      <div className="section-container">
        <TeamMember
          name="Eline"
          role="Full Stack Developer"
          background="Eline is a third-year Medical Informatics student at UiT in Tromsø, specializing in the intersection of healthcare and technology. With experience in both frontend and backend development"
          imageSrc={getImageByName('yarnSheep')}
        />
        <TeamMember
          imagePosition = "left"
          name="Emilie"
          role="Full Stack Developer"
          background="Emilie is a third-year Cybersecurity student at UiT in Tromsø, with experience in both frontend and backend development."
          imageSrc={getImageByName('yarnSheep')}
        />
        <TeamMember
          imageSrc={getImageByName('huggingYarn')}
          name="Marie"
          role="Full Stack Developer"
          background="Marie is a third-year Informatics student at UiT in Tromsø,  with experience in both frontend and backend development."
        />
        <TeamMember
          imagePosition = "left"
          imageSrc={getImageByName('knitting')}
          name="Sera"
          role="Full Stack Developer"
          background="Sera is a third-year Cybersecurity student at UiT in Tromsø, with experience in both frontend and backend development."
        />
        <TeamMember
          imageSrc={getImageByName('yarnSheep')}
          name="Skjalg"
          role="Full Stack Developer"
          background="Skjalg is a third-year Cybersecurity student at UiT in Tromsø, with experience in mainly backend development."
        />
      </div>
    </div>
  );
};
