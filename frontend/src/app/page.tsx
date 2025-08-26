import Image from "next/image";
import Navbar from "./components/Navbar";
import Hero from "./sections/Hero";
import Sponsors from "./sections/Sponsors";
import Introduction from "./sections/Introduction";
import Fields from "./sections/Fields";
import About from "./sections/About";
import Gallery from "./sections/Gallery";
import MainSponsors from "./sections/MainSponsors";
import ProjectTeam from "./sections/ProjectTeam";
import Footer from "./sections/Footer";
import RegisterForm from "./sections/RegisterForm";
import RegistrationModalWrapper from "./components/RegistrationModalWrapper";

export default function Home() {
  return (
    <div>
      <Navbar />
      <Hero />
      <Sponsors />
      <Introduction />
      <Fields />
      <About />
      <Gallery />
      <MainSponsors />
      <ProjectTeam />
      <Footer />
      <RegistrationModalWrapper />
    </div>
  );
}
