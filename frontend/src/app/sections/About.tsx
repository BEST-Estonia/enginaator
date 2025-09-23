"use client"
import React, { useState, useEffect } from 'react';
import {MapPin, Users, Trophy} from 'lucide-react';
import { getAbout, About as AboutType } from '@/services/aboutService';

const About = () => {

    const [about, setAbout] = useState<AboutType | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
    getAbout()
      .then(data => setAbout(data))
      .catch(() => setAbout(null))
      .finally(() => setLoading(false));
    }, []);
    
    if (loading) return <div>Loading...</div>;
    if (!about) return <div>Event info not available.</div>;

    const sections = [
        {
            icon: MapPin,
            title: 'Kus',
            content: about.kusContent
        },
        {
            icon: Users,
            title: "Osalejad",
            content: about.osalejadContent
        },
        {
            icon: Trophy,
            title: "Auhinnad",
            content: about.auhinnadContent
        }
    ];
  return (
    <section id='uritusest'>
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
            <h1 className="font-bold text-2xl sm:text-3xl md:text-4xl text-center [font-family:var(--font-poppins)]">
                ÜRITUSEST
            </h1>
            <p className="section-subheader">
                Kõik, mida peate teadma Enginaatori kohta.
            </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {sections.map((section, index) => (
                <div 
                key={index} 
                className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all hover:scale-110 duration-300">
                    <div className="flex items-center space-x-4 mb-6">
                        <div className="bg-gradient-to-r from-[hsl(var(--enginaator-red))] to-[hsl(var(--enginaator-red-dark))] rounded-full w-12 h-12 flex items-center justify-center">
                            <section.icon className="w-6 h-6 text-white" />
                        </div>
                        <h3 className="text-2xl font-bold text-[hsl(var(--enginaator-black))]">
                            {section.title}
                        </h3>
                    </div>
                    <p className="text-[hsl(var(--enginaator-gray))] leading-relaxed">
                        {section.content}
                    </p>
                </div>
            ))}
        </div>
      </div>
    </section>
  )
}

export default About
