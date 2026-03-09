import Navbar from "./components/Navbar";
import Hero from "@/app/sections/Hero";
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
import { HERO_DEFAULT_DATA, HeroProps } from "./sections/Hero";

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

async function getInitialHeroData(): Promise<HeroProps> {
  try {
    const response = await fetch(`${API_URL}/hero`, {
      cache: 'no-store'
    });

    if (!response.ok) {
      return HERO_DEFAULT_DATA;
    }

    const payload = await response.json();
    if (!payload?.success || !payload?.data) {
      return HERO_DEFAULT_DATA;
    }

    return {
      ...HERO_DEFAULT_DATA,
      ...payload.data
    };
  } catch {
    return HERO_DEFAULT_DATA;
  }
}

export default async function Home() {
  const heroData = await getInitialHeroData();

  return (
    <div>
      <Navbar />

      <Reveal><Hero {...heroData} /></Reveal>
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
