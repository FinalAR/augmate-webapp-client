import React from 'react';
import "../assets/scss/landingpage.scss";
import 'bootstrap/dist/css/bootstrap.min.css';
import { NavBar } from "../components/landingpage/NavBar";
import { Banner } from "../components/landingpage/Banner";
import { Skills } from "../components/landingpage/Skills";
import { Projects } from "../components/landingpage/Projects";
import { Faq } from "../components/landingpage/Faq";
import { Contact } from "../components/landingpage/Contact";
import { Footer } from "../components/landingpage/Footer";

function LandingPage() {
  return (
    <div className="App">
      <NavBar />
      <Banner />
      <Skills />
      {/* <Projects /> */}
      <Faq />
      <Contact />
      <Footer />
    </div>
  )
}

export default LandingPage;
