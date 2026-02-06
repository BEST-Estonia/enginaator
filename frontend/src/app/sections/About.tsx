"use client"
import React, { useEffect, useState } from 'react';
import {MapPin, Users, Trophy} from 'lucide-react';
import { getAboutSection, type AboutSectionData } from '@/services/aboutService';

const About = () => {
    const [about, setAbout] = useState<AboutSectionData | null>(null);
    const fallback = {
        kusContent: "Enginaator toimub TalTechis. Suurem osa võistlusest viiakse läbi tudengimaja aulas, kuid osalejate teekond viib neid ka muudesse ülikooli osadesse. Samuti on Tallinnast väljaspoolt tulevatel finalistidel võimalus ööbida 18. aprillil Hessnery Residentsis, mis asub Pärnu mnt. 453H. TalTechi campuselt (peatus Tehnikaülikool) liigub täpselt hotelli ette (peatus Pärnu maantee) buss nr.10.",
        osalejadContent: "Võistlus toimub neljaliikmelistes tiimides, mis koosnevad 18-24 aastastest gümnasistidest, kutsekooli õpilastest ja tudengitest. Võivad olla segatiimid, aga ka kõik ühest haridusasutusest. Kui tiimiliiget veel ei ole, ei tasu meelt heita, sest korraldustiim aitab Sul leida võistluskaaslased!",
        auhinnadContent: "Top 5 tiimile on tagatud koht TalTechis, ning finaali kolmele parimale tiimile on ligi 3000€ auhinnafond. Lisaks saavad osalejad eri auhindu ja meeneid meie ettevõtetelt ning sponsoritelt."
    };

    useEffect(() => {
        getAboutSection()
            .then(setAbout)
            .catch((err) => console.error('Failed to load about section:', err));
    }, []);

    const content = about ?? fallback;

    const sections = [
        {
            icon: MapPin,
            title: 'Kus',
            content: content.kusContent
        },
        {
            icon: Users,
            title: "Osalejad",
            content: content.osalejadContent
        },
        {
            icon: Trophy,
            title: "Auhinnad",
            content: content.auhinnadContent
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
