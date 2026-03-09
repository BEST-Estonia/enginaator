"use client";

import React from 'react';
import { Mail, Phone, MapPin, Facebook, Instagram, Linkedin } from 'lucide-react';
import { getFooterSection } from '@/services/footerService';

const FALLBACK_FOOTER = {
  logoUrl: '/enginaator.png',
  tagline: 'Eesti suurim insenerivõistlus tudengitele',
  contactEmail: 'Projektijuht@enginaator.ee',
  contactPhone: '+372 56827565',
  contactAddress: 'Ehitajate tee 5, Tallinn',
  facebookUrl: 'https://www.facebook.com/Enginaator',
  instagramUrl: 'https://www.instagram.com/enginaator.official/',
  linkedinUrl: 'https://www.linkedin.com/company/enginaator/',
  partner1Name: 'Best Estonia',
  partner1LogoUrl: '/best.png',
  partner2Name: 'TalTech',
  partner2LogoUrl: '/taltech.png',
  copyrightText: '© 2026 Enginaator. Kõik õigused kaitstud.'
};

const Footer = () => {
  const [footer, setFooter] = React.useState(FALLBACK_FOOTER);

  React.useEffect(() => {
    const load = async () => {
      try {
        const data = await getFooterSection();
        setFooter({
          logoUrl: data.logoUrl,
          tagline: data.tagline,
          contactEmail: data.contactEmail,
          contactPhone: data.contactPhone,
          contactAddress: data.contactAddress,
          facebookUrl: data.facebookUrl,
          instagramUrl: data.instagramUrl,
          linkedinUrl: data.linkedinUrl,
          partner1Name: data.partner1Name,
          partner1LogoUrl: data.partner1LogoUrl,
          partner2Name: data.partner2Name,
          partner2LogoUrl: data.partner2LogoUrl,
          copyrightText: data.copyrightText
        });
      } catch (error) {
        console.error('Failed to load footer section:', error);
        setFooter(FALLBACK_FOOTER);
      }
    };

    load();
  }, []);

  return (
    <footer id="kontakt" className="bg-[hsl(var(--enginaator-black))] text-white py-16">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Logo + small image*/}
          <div>
            <img
              src={footer.logoUrl}
              alt="enginaator logo"
              className="w-[180px] h-auto"
            />
            
            <p className="text-gray-400 text-sm leading-relaxed mt-3">
              {footer.tagline}
            </p>
          </div>
          
          {/* Contacts */}
          <div>
            <h4 className="text-lg font-semibold mb-4">
                Kontakt
            </h4>
            <div className="space-y-3">
                <a 
                href={`mailto:${footer.contactEmail}`}
                className="flex items-center space-x-3 text-gray-300 hover:text-[hsl(var(--enginaator-red))] transition-colors duration-200"
              >
                  <Mail className="w-4 h-4" />
                  <span className="text-sm">{footer.contactEmail}</span>
              </a>
              <a 
                href={`tel:${footer.contactPhone.replace(/\s+/g, '')}`}
                className="flex items-center space-x-3 text-gray-300 hover:text-[hsl(var(--enginaator-red))] transition-colors duration-200"
              >
                <Phone className="w-4 h-4" />
                <span className="text-sm">{footer.contactPhone}</span>
              </a>

              <div className="flex items-center space-x-3 text-gray-300">
                <MapPin className="w-4 h-4" />
                <span className="text-sm">{footer.contactAddress}</span>
              </div>
            </div>
          </div>

          {/*Social Media */}
          <div>
            <h4 className="text-lg font-semibold mb-4">
                Jälgi meid
            </h4>
            
            <div className="flex space-x-4">
                <a 
                  href={footer.facebookUrl} 
                  className="w-10 h-10 bg-[hsl(var(--enginaator-black-soft))] rounded-full flex items-center justify-center hover:bg-[hsl(var(--enginaator-red))] transition-colors duration-200"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Facebook className="w-5 h-5" />
                </a>

                <a 
                  href={footer.instagramUrl} 
                  className="w-10 h-10 bg-[hsl(var(--enginaator-black-soft))] rounded-full flex items-center justify-center hover:bg-[hsl(var(--enginaator-red))] transition-colors duration-200"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Instagram className="w-5 h-5" />
                </a>

                <a 
                  href={footer.linkedinUrl} 
                  className="w-10 h-10 bg-[hsl(var(--enginaator-black-soft))] rounded-full flex items-center justify-center hover:bg-[hsl(var(--enginaator-red))] transition-colors duration-200"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Linkedin className="w-5 h-5" />
                </a>
            </div>
          </div>

          {/*Partnerid*/}
          <div>
            <h4 className="text-lg font-semibold mb-4">
                Partnerid
            </h4>
            <div className="grid grid-cols-2 gap-5">
              <img 
              src={footer.partner1LogoUrl}
              alt={footer.partner1Name}
              className="w-full h-auto object-contain"
                />
              <img 
              src={footer.partner2LogoUrl}
              alt={footer.partner2Name}
              className='w-full h-auto object-contain mt-4'
                />
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-[hsl(var(--enginaator-black-soft))] pt-8">
          <p className="text-center text-gray-400 text-sm">
            {footer.copyrightText}
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer;
