import Image from "next/image";
import Navbar from "./components/Navbar";
import Hero from "./sections/Hero";
import Sponsors from "./sections/Sponsors";
import Introduction from "./sections/Introduction";
import Fields from "./sections/Fields";
import About from "./sections/About";
import Gallery from "./sections/Gallery";
import Faq from "./sections/Faq";

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
      <Faq />
    </div>
  );
}
