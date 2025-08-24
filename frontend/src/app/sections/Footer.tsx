import React from 'react';
import { Mail, Phone, MapPin, Facebook, Instagram, Linkedin } from 'lucide-react';
import Image from 'next/image';
import enginaator from '@/assets/enginaator.png';
import best from '@/assets/best.png';
import taltech from '@/assets/taltech.png';

const Footer = () => {
  return (
    <footer className="bg-[hsl(var(--enginaator-black))] text-white py-16">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Logo + small image*/}
          <div>
            <Image
              src={enginaator}
              alt='enginaator logo'
              width={180}
              height={180}
            />
            
            <p className="text-gray-400 text-sm leading-relaxed mt-3">
              Eesti suurim insenerivõistlus tudengitele
            </p>
          </div>
          
          {/* Contacts */}
          <div>
            <h4 className="text-lg font-semibold mb-4">
                Kontakt
            </h4>
            <div className="space-y-3">
                <a 
                href="mailto:info@enginaator.ee"
                className="flex items-center space-x-3 text-gray-300 hover:text-[hsl(var(--enginaator-red))] transition-colors duration-200"
              >
                  <Mail className="w-4 h-4" />
                  <span className="text-sm">info@enginaator.ee</span>
              </a>
              <a 
                href="tel:+37256273153"
                className="flex items-center space-x-3 text-gray-300 hover:text-[hsl(var(--enginaator-red))] transition-colors duration-200"
              >
                <Phone className="w-4 h-4" />
                <span className="text-sm">+372 56273153</span>
              </a>

              <div className="flex items-center space-x-3 text-gray-300">
                <MapPin className="w-4 h-4" />
                <span className="text-sm">Ehitajate tee 5, Tallinn</span>
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
                  href="https://www.facebook.com/Enginaator" 
                  className="w-10 h-10 bg-[hsl(var(--enginaator-black-soft))] rounded-full flex items-center justify-center hover:bg-[hsl(var(--enginaator-red))] transition-colors duration-200"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Facebook className="w-5 h-5" />
                </a>

                <a 
                  href="https://www.instagram.com/enginaator.official/" 
                  className="w-10 h-10 bg-[hsl(var(--enginaator-black-soft))] rounded-full flex items-center justify-center hover:bg-[hsl(var(--enginaator-red))] transition-colors duration-200"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Instagram className="w-5 h-5" />
                </a>

                <a 
                  href="https://www.linkedin.com/company/enginaator/" 
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
                <Image 
                src={best}
                alt='Best Estonia logo'
                />
                <Image 
                src={taltech}
                alt='TalTech logo'
                width={120}
                height={110}
                className='mt-4'
                />
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-[hsl(var(--enginaator-black-soft))] pt-8">
          <p className="text-center text-gray-400 text-sm">
            © 2025 Enginaator. Kõik õigused kaitstud.
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer;
