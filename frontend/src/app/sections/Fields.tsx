"use client"
import { useState } from 'react';
import { Cpu, Cog, Building, Code } from 'lucide-react';
import { Button } from '../components/ui/button';

const FieldsSection = () => {
  const [activeField, setActiveField] = useState(0);

  const fields = [
    {
      icon: Cpu,
      name: 'Elektroonika',
      description: 'See valdkond on suunatud neile, kes tunnevad end koduselt programmeerimises ja elektroonikaga eksperimenteerimises. Võistlus avab ukse mitmesuguste põnevate ülesannete lahendamisele, alates lasteraamatute loomisest tehisintellektiga kuni droonipõhiste isikutuvastussüsteemide arendamiseni!'
    },
    {
      icon: Cog,
      name: 'Mehaanika',
      description: 'Mehaanikaülesanded põhinevad mehaanikafüüsika põhialustel, nõudes loovust ja tehnilist nutikust. Varasematel aastatel on ülesanneteks olnud näiteks maavõnkumistele vastupidava ja võimalikult suurt raskust kannatava torni ehitamine ning liivase maastiku jaoks sõiduki loomine.'
    },
    {
      icon: Building,
      name: 'Ehitus',
      description: 'Ehituses osaledes ei tohiks sulle võõras olla mehaanikafüüsika, lihtne elektroonika ega tohiks puududa ka loogiline mõtlemine. Ehitusvaldkonnas testime sinu võimet projekteerida ja teostada hämmastava väljanägemisega konstruktsioone! Varasematel aastatel on ülesanneteks olnud näiteks avaneva silla ehitamine, võimalikult väikese soojusjuhtivusega materjali loomine ja katusekonstruktsioon.'
    },
    {
      icon: Code,
      name: 'IT',
      description: 'Osaledes Enginaatori IT-valdkonnas, saad testida oma meeskonna oskusi nii back-end kui ka front-end arenduses, võimalusega tõestada, et sul on silma disaini (UI/UX) jaoks ning arusaam riistvarast ja erinevatest kommunikatsiooniprotokollidest. 17 tunni jooksul testitakse sinu võimet ühendada serveripoolne loogika ja silmapaistev kasutajaliides ühtseks, toimivaks lahenduseks.'
    }
  ];

  return (
    <section id="fields" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h1 className="font-bold text-2xl sm:text-3xl md:text-4xl text-center">
            VALDKONNAD
          </h1>
        </div>

        {/* Field Tabs */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {fields.map((field, index) => (
            <Button
              key={index}
              variant={activeField === index ? "default" : "outline"}
              onClick={() => setActiveField(index)}
              className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                activeField === index 
                  ? 'bg-[hsl(var(--enginaator-red))] text-white shadow-lg' 
                  : 'border-2 border-[hsl(var(--enginaator-red))] text-[hsl(var(--enginaator-red))] hover:bg-[hsl(var(--enginaator-red))] hover:text-white'
              }`}
            >
              <field.icon className="w-5 h-5" />
              <span>{field.name}</span>
            </Button>
          ))}
        </div>

        {/* Active Field Content */}
        <div className="max-w-4xl mx-auto">
          <div className="field-card animate-fade-in">
            <div className="flex items-center space-x-4 mb-6">
              <div className="bg-gradient-accent rounded-full w-12 h-12 flex items-center justify-center">
                {(() => {
                  const IconComponent = fields[activeField].icon;
                  return <IconComponent className="w-6 h-6 text-white" />;
                })()}
              </div>
              <h3 className="text-2xl font-bold text-enginaator-black">
                {fields[activeField].name}
              </h3>
            </div>
            <p className="text-enginaator-gray leading-relaxed text-lg">
              {fields[activeField].description}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FieldsSection;