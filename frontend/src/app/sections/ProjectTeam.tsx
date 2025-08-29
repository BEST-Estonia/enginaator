import React from 'react';
import Image from 'next/image';

// Import team member images
import nadimImage from '@/assets/nadim.jpg';
import kertImage from '@/assets/kert.jpg';
import lisandraImage from '@/assets/lisandra.jpg';
import rometImage from '@/assets/romet.jpg';
import hansImage from '@/assets/hans.jpg';

const ProjectTeam = () => {
    const teamMembers = [
    {
      name: 'NADIM METWALLI',
      role: 'TURUNDUSJUHT',
      phone: '+372 56983182',
      email: 'nametw@taltech.ee',
      image: nadimImage
    },
    {
      name: 'KERT KALLAS',
      role: 'OSALEJATE JA LOGISTIKAJUHT',
      phone: '+372 56273153',
      email: 'kertka@taltech.ee',
      image: kertImage
    },
    {
      name: 'LISANDRA SOMMERMAN',
      role: 'PROJEKTIJUHT',
      phone: '+372 56827565',
      email: 'lisomm@taltech.ee',
      image: lisandraImage
    },
    {
      name: 'ROMET KALF',
      role: 'MÜÜGIJUHT',
      phone: '+372 57871007',
      email: 'rokalf@taltech.ee',
      image: rometImage
    },
    {
      name: 'HANS MARKUS KIILMAA',
      role: 'PROGRAMMIJUHT',
      phone: '+372 55678737',
      email: 'hakiil@taltech.ee',
      image: hansImage
    }
  ];
  return (
    <section id='team' className='py-20 bg-white'>
        <div className="container mx-auto px-4">
            <div className="text-center mb-16">
                <h1 className="font-bold text-2xl sm:text-3xl md:text-4xl text-center [font-family:var(--font-poppins)]">
                    PROJEKTITIIM
                </h1>
                <p className="section-subheader">
                    Tutvuge meie korraldustiimiga
                </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 max-w-7xl mx-auto">
              {teamMembers.map((member, index) => (
                  <div key={index} className="text-center">
                      <div className="rounded-lg overflow-hidden mb-4">
                          <Image
                              src={member.image}
                              alt={`${member.name}`}
                              width={240}
                              height={320}
                              className="w-full object-cover aspect-[3/4]"
                          />
                      </div>

                      <h3 className="text-lg font-bold mb-1">
                          {member.name}
                      </h3>

                      <p className="text-sm font-semibold text-[hsl(var(--enginaator-red))] mb-2">
                          {member.role}
                      </p>
                      
                      <div className="text-sm">
                        <p className="mb-1">{member.phone}</p>
                        <p>{member.email}</p>
                      </div>
                  </div>
              ))}
            </div>
        </div>
    </section>
  )
}

export default ProjectTeam
