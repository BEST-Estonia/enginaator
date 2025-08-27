"use client"
import Link from "next/link";
import Image from "next/image";
import { HiMenu, HiX } from 'react-icons/hi';
import { useState } from "react";
import { useModal } from '../context/ModalContext';

export default function Navbar() {
    const [menuOpen, setMenuOpen] = useState(false);
    const { openModal } = useModal();
    
    const toggleMenu = () => setMenuOpen(!menuOpen);

    // Function to scroll to section
    const scrollToSection = (id: string) => {
        setMenuOpen(false);
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    };

    const NAV = [
        { label: 'Valdkonnad', href: '#valdkonnad' },
        { label: 'Üritusest', href: '#uritusest' },
        { label: 'Suurtoetajad', href: '#suurtoetajad' },
        { label: 'KKK', href: '#kkk' },
        { label: 'Kontakt', href: '#kontakt' },
    ];

    return (
        <nav className="w-full px-6 py-4 flex justify-between items-center bg-gradient-to-b from-[#0D0D0D] to-[#A80404] font-poppins fixed top-0 left-0 right-0 z-40">
            <div>
                <Link href="/" className="flex items-center gap-2">
                    <Image
                        src="/enginaatorlogo.png"
                        alt="Logo"
                        width={40}
                        height={40}
                        className="object-contain rounded-md shadow-md hover:shadow-lg transition-transform duration-300 hover:scale-110"
                    />
                </Link>
            </div>

            <ul className="hidden lg:flex items-center gap-6">
                {NAV.map(({label, href}) => (
                    <li key={label}>
                        <Link href={href}
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
                            ">
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
                    onClick={openModal} // This now opens the global modal
                    className="inline-block transform transition-all duration-300 hover:scale-105 text-white text-sm rounded-full px-6 py-2 border-2 border-white hover:bg-black hover:text-white hover:shadow-xl font-medium"
                >
                    Pane Kirja
                </button>
            </div>

            <div
                className={`fixed inset-0 z-[70] lg:hidden ${
                    menuOpen ? '' : 'pointer-events-none'
                }`}
                role="dialog"
                aria-modal="true">
                <div
                    className={`absolute inset-0 bg-black/30 transition-opacity duration-300 ${
                    menuOpen ? 'opacity-100' : 'opacity-0'
                    }`}
                    onClick={() => setMenuOpen(false)}/>

                <div
                    className={`absolute right-0 top-0 h-full w-[85%] max-w-sm
                                bg-gradient-to-b from-[#0D0D0D] to-[#A80404] rounded-l-2xl shadow-2xl p-6
                                transform transition-transform duration-300 ease-out
                                ${menuOpen ? 'translate-x-0' : 'translate-x-full'}`}>

                    <nav className="mt-2 flex flex-col items-stretch gap-3">
                        {/* Main navigation items */}
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
                        
                        {/* Special "Pane Kirja" button for mobile */}
                        <button
                            onClick={() => {
                                setMenuOpen(false);
                                openModal(); // This now opens the global modal
                            }}
                            className="
                                mt-4 block px-6 py-3 rounded-full text-white text-lg font-medium
                                border-2 border-white text-center hover:bg-black
                                transition-all duration-300
                            "
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

<section id="panekirja" className="py-20 bg-gradient-subtle" style={{backgroundColor: 'red'}}></section>