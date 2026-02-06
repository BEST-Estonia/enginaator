"use client"
import { useState, useEffect, type SVGProps } from 'react';
import { Cpu, Cog, Building, Code } from 'lucide-react';
import { Button } from '../components/ui/button';
import { getFields, Field } from '@/services/fieldService';

const DroneIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <rect x="9" y="9" width="6" height="6" rx="1" />
    <path d="M12 4v3M12 17v3M4 12h3M17 12h3" />
    <circle cx="6" cy="6" r="2" />
    <circle cx="18" cy="6" r="2" />
    <circle cx="6" cy="18" r="2" />
    <circle cx="18" cy="18" r="2" />
    <path d="M8 8l1.5 1.5M16 8l-1.5 1.5M8 16l1.5-1.5M16 16l-1.5-1.5" />
  </svg>
);

const ICONS: Record<string, React.ElementType> = {
  Cpu,
  Cog,
  Building,
  Code,
  Drone: DroneIcon,
  Droonid: DroneIcon,
};

const getFieldIcon = (field: Field, className: string) => {
  const IconComponent = ICONS[field.icon]
    || (field.name.toLowerCase().includes('droon') ? DroneIcon : undefined);
  return IconComponent ? <IconComponent className={className} /> : null;
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
                {getFieldIcon(field, "w-5 h-5")}
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
                  {getFieldIcon(fields[activeField], "w-6 h-6 text-white")}
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