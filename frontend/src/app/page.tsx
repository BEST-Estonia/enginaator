import Image from "next/image";
import Navbar from "./components/Navbar";
import Hero from "./sections/Hero";
import Sponsors from "./sections/Sponsors";
import Introduction from "./sections/Introduction";

export default function Home() {
  return (
    <div>
      <Navbar />
      <Hero />
      <Sponsors />
      <Introduction />
    </div>
  );
}
