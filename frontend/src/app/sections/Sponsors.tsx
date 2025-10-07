'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { fetchSponsors, Sponsor } from '@/services/sponsorService';

// Keep the static imports as fallbacks
import gymLogo from '@/assets/gym.png';
import myfitnessLogo from '@/assets/myfitness.png';
import pizzakioskLogo from '@/assets/pizzakiosk.png';
import wurthLogo from '@/assets/würth.png';
import makitaLogo from '@/assets/makita.png';
import kuulsaalLogo from '@/assets/kuulsaal.png';

// Fallback sponsors if API fails
const fallbackSponsors = [
  gymLogo, myfitnessLogo, pizzakioskLogo, wurthLogo, makitaLogo, kuulsaalLogo
];

const Sponsors = () => {
  const [sponsors, setSponsors] = useState<Sponsor[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadSponsors = async () => {
      const data = await fetchSponsors();
      setSponsors(data);
      setIsLoading(false);
    };

    loadSponsors();
  }, []);

  // Use fallback images if no sponsors from API or still loading
  const displaySponsors = sponsors.length > 0 ? sponsors : [];
  const useStaticFallback = isLoading || displaySponsors.length === 0;

  return (
    <section className='py-12 bg-[hsl(0,0%,97%)]'>
      <div className="container mx-auto px-4 mb-8">
        <h2 className="text-2xl font-bold text-center text-black font-dm-sans [font-family:var(--font-poppins)]">
            MEIE SPONSORID
        </h2>
      </div>

      {/*Infinite scroll container */}
      <div className="relative overflow-hidden">
        <div className="flex animate-scroll whitespace-nowrap w-[200%]">
          {/* First set of sponsors */}
          {useStaticFallback ? (
            // Use static fallback sponsors if needed
            fallbackSponsors.map((sponsor, index) => (
              <div
                key={`first-static-${index}`}
                className="mx-8 inline-flex items-center justify-center min-w-[200px] h-24"
              >
                <Image
                  src={sponsor}
                  alt={`Sponsor ${index + 1}`}
                  className="object-contain"
                  width={160}
                  height={64}
                  style={{ maxHeight: '64px', width: 'auto' }}
                />
              </div>
            ))
          ) : (
            // Use dynamic sponsors from API
            displaySponsors.map((sponsor, index) => (
              <div
                key={`first-${sponsor.id}`}
                className="mx-8 inline-flex items-center justify-center min-w-[200px] h-24"
              >
                <Image
                  src={sponsor.imageUrl.startsWith('/') 
                    ? `http://localhost:8000${sponsor.imageUrl}` 
                    : sponsor.imageUrl}
                  alt={sponsor.name}
                  className="object-contain"
                  width={160}
                  height={64}
                  style={{ maxHeight: '64px', width: 'auto' }}
                  unoptimized // For external URLs
                />
              </div>
            ))
          )}
          
          {/* Duplicate set for seamless loop */}
          {useStaticFallback ? (
            // Duplicate static fallback sponsors
            fallbackSponsors.map((sponsor, index) => (
              <div
                key={`second-static-${index}`}
                className="mx-8 inline-flex items-center justify-center min-w-[200px] h-24"
              >
                <Image
                  src={sponsor}
                  alt={`Sponsor duplicate ${index + 1}`}
                  className="object-contain"
                  width={160}
                  height={64}
                  style={{ maxHeight: '64px', width: 'auto' }}
                />
              </div>
            ))
          ) : (
            // Duplicate dynamic sponsors
            displaySponsors.map((sponsor, index) => (
              <div
                key={`second-${sponsor.id}`}
                className="mx-8 inline-flex items-center justify-center min-w-[200px] h-24"
              >
                <Image
                  src={sponsor.imageUrl.startsWith('/') 
                    ? `http://localhost:8000${sponsor.imageUrl}` 
                    : sponsor.imageUrl}
                  alt={sponsor.name}
                  className="object-contain"
                  width={160}
                  height={64}
                  style={{ maxHeight: '64px', width: 'auto' }}
                  unoptimized // For external URLs
                />
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  );
};

export default Sponsors;
