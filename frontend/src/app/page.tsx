import Image from "next/image";
import Navbar from "./components/Navbar";
import Hero from "./sections/Hero";
import Sponsors from "./sections/Sponsors";

export default function Home() {
  return (
    <div>
      <Navbar/>
      <Hero />
      <Sponsors />
    </div>
  );
}
