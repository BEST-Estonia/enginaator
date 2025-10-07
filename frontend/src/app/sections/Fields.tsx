"use client"
import { useState, useEffect } from 'react';
import { Cpu, Cog, Building, Code } from 'lucide-react';
import { Button } from '../components/ui/button';
import { getFields, Field } from '@/services/fieldService';

const ICONS: Record<string, React.ElementType> = {
  Cpu,
  Cog,
  Building,
  Code,
};

const FieldsSection = () => {
  const [fields, setFields] = useState<Field[]>([]);
  const [activeField, setActiveField] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getFields()
      .then(setFields)
      .finally(() => setLoading(false));
  }, []);

  return (
    <section id="fields" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h1 className="font-bold text-2xl sm:text-3xl md:text-4xl text-center [font-family:var(--font-poppins)]">
            VALDKONNAD
          </h1>
        </div>

        {/* Field Tabs */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {loading ? (
            <div>Loading fields...</div>
          ) : (
            fields.map((field, index) => (
              <Button
                key={field.id}
                variant={activeField === index ? "default" : "outline"}
                onClick={() => setActiveField(index)}
                className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                  activeField === index 
                    ? 'bg-[hsl(var(--enginaator-red))] text-white shadow-lg' 
                    : 'border-2 border-[hsl(var(--enginaator-red))] text-[hsl(var(--enginaator-red))] hover:bg-[hsl(var(--enginaator-red))] hover:text-white'
                }`}
              >
                {(() => {
                  const IconComponent = ICONS[field.icon];
                  return IconComponent ? <IconComponent className="w-5 h-5" /> : null;
                })()}
                <span>{field.name}</span>
              </Button>
            ))
          )}
        </div>

        {/* Active Field Content */}
        <div className="max-w-4xl mx-auto">
          {loading ? (
            <div>Loading...</div>
          ) : fields.length > 0 ? (
            <div className="field-card animate-fade-in">
              <div className="flex items-center space-x-4 mb-6">
                <div className="bg-gradient-accent rounded-full w-12 h-12 flex items-center justify-center">
                  {(() => {
                    const IconComponent = ICONS[fields[activeField].icon];
                    return IconComponent ? <IconComponent className="w-6 h-6 text-white" /> : null;
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
          ) : (
            <div>No fields available.</div>
          )}
        </div>
      </div>
    </section>
  );
};

export default FieldsSection;