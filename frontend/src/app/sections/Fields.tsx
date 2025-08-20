"use client";
import React, { useState } from 'react';
import { Cpu, Cog, Building, Code } from 'lucide-react';
import { Button } from '../components/ui/button';


const fields = [
    {
        icon: Cpu,
        name: "Elektroonika",
        description: "Valdkond on suunatud neile, kes tunnevad end hästi koodimise ja elektroonikaga eksperimenteerimise maailmas. Võistlus avab ukse mitmekülgsete põnevate ülesannete lahendamiseks, alates tehisintellekti abil lasteraamatute loomisest kuni droonidel põhineva isikutuvastussüsteemi väljatöötamiseni!"
    },

    {
        icon: Cog,
        name: "Mehaanika",
        description: "Mehaanika valdkonna ülesanded põhinevad mehaanilise füüsika alustaladel, kus läheb tarvis loovust ning tehnilist taipu. Eelnevatel aastatel on olnud ülesanneteks aluspinna rappumisele vastupidava ning võimalikult palju raskust taluva torni ehitamine ning liivasele maastikule sõiduvahendi loomine."
    },

    {
        icon: Building,
        name: "Ehitus",
        description: "Osaledes ehituses ei tohiks olla Sulle võõras mehaaniline füüsika, lihtne elektroonika ega ei tohiks olla puudust ka loogilisest mõtlemisest. Ehituse valdkonnas paneme proovile Sinu võime projekteerida ning ellu tuua rabavaid konstruktsioone! Eelnevatel aastatel on ülesanneteks olnud avaneva silla ehitamine, võimalikult väikese soojusjuhtivusega materjali loomine ning katuse ehitamine."
    },

    {
        icon: Code,
        name: "IT",
        description: "Osaledes Enginaatori IT valdkonnas saate panna enda tiimi oskused proovile nii backend kui ka frontend arenduses, võimalusega tõestada, et teil on silma disainile (UI/UX) ja arusaamisi ka riistvarast ning erinevatest suhtlusprotokollidest. 17 tunni jooksul pannakse proovile teie võime ühendada serveripoolne loogika ja silmapaistev kasutajaliidese ühtseks, toimivaks lahenduseks."
    }
]

const Fields = () => {
  const [activeField, setActiveField] = useState(0);
  
  return (
    <section id='fields' className='py-20 bg-white'>
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-center mb-12">
                VALDKONNAD
            </h2>
        </div>

        {/* Fields tab*/}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
            {fields.map((field, index) => (
                <Button
                    key={index}
                    variant={activeField === index ? "default" : "outline"}
                    onClick={() => setActiveField(index)}
                    className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                        activeField === index
                        ? 'bg-[linear-gradient(90deg,hsl(0,84%,55%)_0%,hsl(0,100%,45%)_100%)] text-white shadow-lg'
                        : 'border-2 border-[hsl(0,84%,55%)] text-[hsl(0,84%,55%)] hover:bg-[hsl(0,84%,55%)] hover:text-white'
                    }`}
                >
                    <field.icon className="w-5 h-5 mr-2" />
                    <span>{field.name}</span>
                </Button>
            ))}
        </div>
        
        {/* Add this section to display the selected field description */}
        <div className="mt-8 p-6 bg-gray-50 rounded-xl">
            <h3 className="text-2xl font-bold mb-4 flex items-center">
                {React.createElement(fields[activeField].icon, { className: "w-6 h-6 mr-2" })}
                {fields[activeField].name}
            </h3>
            <p className="text-gray-700 leading-relaxed">
                {fields[activeField].description}
            </p>
        </div>

        
      </div>
    </section>
  )
}

export default Fields
