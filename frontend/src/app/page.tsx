import Navbar from "./components/Navbar";
import Hero from "./sections/Hero";
import Sponsors from "./sections/Sponsors";
import Introduction from "./sections/Introduction";
import Fields from "./sections/Fields";
import About from "./sections/About";
import Gallery from "./sections/Gallery";
import Faq from "./sections/Faq";
import MainSponsors from "./sections/MainSponsors";
import ProjectTeam from "./sections/ProjectTeam";
import Footer from "./sections/Footer";
import RegistrationModalWrapper from "./components/RegistrationModalWrapper";
import Reveal from "./components/Reveal";

export default function Home() {
  return (
    <div>
      <Navbar />

      <Reveal><Hero /></Reveal>
      <Reveal delay={50}><Sponsors /></Reveal>
      <Reveal delay={100}><Introduction /></Reveal>
      <Reveal delay={150}><Fields /></Reveal>
      <Reveal delay={200}><About /></Reveal>
      <Reveal delay={250}><Gallery /></Reveal>
      <Reveal delay={300}><Faq /></Reveal>
      <Reveal delay={350}><MainSponsors /></Reveal>
      <Reveal delay={400}><ProjectTeam /></Reveal>
      <Reveal delay={450}><Footer /></Reveal>

      <RegistrationModalWrapper />
    </div>
  );
}
