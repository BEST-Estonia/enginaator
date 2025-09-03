"use client"
import Link from "next/link";
import Image from "next/image";
import { HiMenu, HiX } from 'react-icons/hi';
import { useState, useEffect, useRef } from "react";
import { useModal } from '../context/ModalContext';

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const lastYRef = useRef(0);
  const { openModal } = useModal();

  const toggleMenu = () => setMenuOpen(!menuOpen);
  const drawerRef = useRef<HTMLDivElement>(null);

  const scrollToSection = (id: string) => {
    setMenuOpen(false);
    const element = document.getElementById(id);
    if (element) element.scrollIntoView({ behavior: 'smooth' });
  };

  // Hide on scroll down, show on scroll up
  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY || 0;
      setScrolled(y > 8);

      // never hide while menu is open
      if (!menuOpen) {
        const delta = y - lastYRef.current;
        if (delta > 4 && y > 80) setHidden(true);      // scrolling down
        else if (delta < -4) setHidden(false);         // scrolling up
      } else {
        setHidden(false);
      }

      lastYRef.current = y;
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [menuOpen]);

  useEffect(() => {
  if (!menuOpen) return;

  const handleClickOutside = (event: MouseEvent) => {
    if (drawerRef.current && !drawerRef.current.contains(event.target as Node)) {
      setMenuOpen(false);
    }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [menuOpen]);


  const NAV = [
    { label: 'Home', href: '#hero' },
    { label: 'Valdkonnad', href: '#fields' },
    { label: 'Üritusest', href: '#uritusest' },
    { label: 'Suurtoetajad', href: '#suurtoetajad' },
    { label: 'KKK', href: '#kkk' },
    { label: 'Kontakt', href: '#kontakt' },
  ];

  return (
    <nav
      className={`w-full px-6 py-4 flex justify-between items-center font-poppins fixed top-0 left-0 right-0 z-40
        transition-transform duration-300
        ${hidden ? "-translate-y-full" : "translate-y-0"}
        ${scrolled ? "bg-black/90 backdrop-blur shadow-sm" : "bg-black/0"}
      `}
    >
      <div>
        <button
        onClick={() => scrollToSection("hero")}
        className="flex items-center gap-2 cursor-pointer"
        >
        <Image
            src="/enginaatorlogo.png"
            alt="Logo"
            width={40}
            height={40}
            className="object-contain rounded-md shadow-md hover:shadow-lg transition-transform duration-300 hover:scale-110"
        />
        </button>

      </div>

      <ul className="hidden lg:flex items-center gap-6">
        {NAV.map(({ label, href }) => (
          <li key={label}>
            <Link
              href={href}
              onClick={(e) => {
                e.preventDefault();
                scrollToSection(href.substring(1));
              }}
              className="
                relative inline-block transform transition-all duration-300 text-white px-6 py-2 hover:text-white hover:shadow-xl
                after:content-[''] after:absolute after:left-0 after:bottom-0
                after:h-0.5 after:w-full after:bg-current
                after:origin-left after:scale-x-0 after:transition-transform after:duration-300
                hover:after:scale-x-100
              "
            >
              {label}
            </Link>
          </li>
        ))}
      </ul>

      <div className="lg:hidden z-50 text-white">
        <button onClick={toggleMenu}>
          {menuOpen ? <HiX size={28} /> : <HiMenu size={28} />}
        </button>
      </div>

      <div className="hidden md:block">
        <button
          onClick={openModal}
          className="inline-block transform transition-all duration-300 hover:scale-105 text-white text-sm rounded-full px-6 py-2 border-2 border-white hover:bg-black hover:text-white hover:shadow-xl font-medium cursor-pointer"
        >
          Pane Kirja
        </button>
      </div>

      {/* Mobile drawer */}
        <div className={`fixed inset-0 z-50 ${menuOpen ? 'pointer-events-auto visible' : 'pointer-events-none invisible'}`}>
            {/* Backdrop */}
            <div
                className={`absolute inset-0 bg-black/40 transition-opacity duration-300 ${
                menuOpen ? 'opacity-100' : 'opacity-0'
                }`}
                onClick={() => setMenuOpen(false)}
            />
        <div
        ref={drawerRef}
        className={`
            absolute right-0 top-0 h-screen w-[85%] max-w-sm
            bg-gradient-to-b from-[#0D0D0D] to-[#A80404] rounded-l-2xl shadow-2xl p-6
            transform transition-transform duration-300 ease-out
            ${menuOpen ? 'translate-x-0' : 'translate-x-full'}
        `}
        >
        <nav className="mt-2 flex flex-col items-stretch gap-3">
            {NAV.map(({ label, href }, i) => (
            <button
                key={label}
                onClick={() => {
                setMenuOpen(false);
                scrollToSection(href.substring(1));
                }}
                className="
                relative block px-6 py-3 rounded-full text-white text-lg font-medium
                transition-all duration-300
                after:content-[''] after:absolute after:left-6 after:right-6 after:bottom-1.5
                after:h-0.5 after:bg-white
                after:origin-left after:scale-x-0
                after:transition-transform after:duration-300
                hover:after:scale-x-100
                "
                style={{ transitionDelay: `${i * 40}ms` }}
            >
                {label}
            </button>
            ))}
            <button
            onClick={() => {
                setMenuOpen(false);
                openModal();
            }}
            className="mt-4 block px-6 py-3 rounded-full text-white text-lg font-medium border-2 border-white text-center hover:bg-black transition-all duration-300"
            style={{ transitionDelay: `${NAV.length * 40}ms` }}
            >
            Pane Kirja
            </button>
        </nav>
        </div>
    </div>

    </nav>
  );
}
