import Image from "next/image";
import Navbar from "./components/Navbar";
import Hero from "./sections/Hero";

export default function Home() {
  return (
    <div>
      <Navbar/>
      <Hero />
    </div>
  );
}
