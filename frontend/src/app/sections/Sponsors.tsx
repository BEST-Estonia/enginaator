import React from 'react';
import Image from 'next/image';
import gym from '@/assets/gym.png'
import myfitness from '@/assets/myfitness.png'
import pizzakiosk from '@/assets/pizzakiosk.png'
import wurth from '@/assets/würth.png'
import makita from '@/assets/makita.png';
import kuulsaal from '@/assets/kuulsaal.png';



const sponsors = [
    gym, myfitness, pizzakiosk, wurth, makita, kuulsaal
];

const Sponsors = () => {
  return (

    <section className='py-12 bg-[hsl(0,0%,97%)]'>
      <div className="container mx-auto px-4 mb-8">
        <h2 className="text-2xl font-bold text-center text-black">
            MEIE SPONSORID
        </h2>
      </div>

      {/*Infinite scroll container */}
      <div className="relative overflow-hidden">
        <div className="flex animate-scroll whitespace-nowrap w-[200%]">
          {/* First set of sponsors */}
          {sponsors.map((sponsor, index) => (
            <div
              key={`first-${index}`}
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
          ))}
          
          {/* Duplicate set for seamless loop */}
          {sponsors.map((sponsor, index) => (
            <div
              key={`second-${index}`}
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
          ))}
        </div>
      </div>
    </section>
  );
};

export default Sponsors;
