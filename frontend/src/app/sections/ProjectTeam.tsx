'use client'
import React, { useState, useEffect } from 'react';
import { FaInfoCircle } from 'react-icons/fa';
import InfoModal from '../components/InfoModal';
import { ProjectMember, getProjectMembers } from '@/services/projectMemberService';

const ProjectTeam = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState<ProjectMember | null>(null);
  const [teamMembers, setTeamMembers] = useState<ProjectMember[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getProjectMembers()
      .then(setTeamMembers)
      .finally(() => setLoading(false));
  }, []);

  return (
    <section id='kontakt' className='py-20 bg-white'>
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h1 className="font-bold text-2xl sm:text-3xl md:text-4xl text-center [font-family:var(--font-poppins)]">
            PROJEKTITIIM
          </h1>
          <p className="section-subheader">
            Tutvuge meie korraldustiimiga
          </p>
        </div>

        {loading ? (
          <div>Loading...</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 max-w-7xl mx-auto">
            {teamMembers.map((member, index) => (
              <div key={member.id} className="text-center">
                <div className="relative rounded-lg overflow-hidden mb-4 group hover:scale-110 transition-transform duration-300">
                  <img
                    src={member.imageUrl}
                    alt={member.name}
                    width={240}
                    height={320}
                    className="w-full object-cover aspect-[3/4]"
                  />
                  <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-50 transition-opacity duration-300 pointer-events-none" />
                  <button
                    onClick={() => {
                      setIsModalOpen(true);
                      setSelectedMember(member);
                    }}
                    className="absolute inset-0 flex items-center justify-center hover:cursor-pointer"
                  >
                    <FaInfoCircle className="text-white text-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </button>
                </div>
                <h3 className="text-lg font-bold mb-1">{member.name}</h3>
                <p className="text-sm font-semibold text-[hsl(var(--enginaator-red))] mb-2">
                  {member.role}
                </p>
                <div className="text-sm">
                  <p className="mb-1">{member.phone}</p>
                  <p>{member.email}</p>
                </div>
              </div>
            ))}
            {selectedMember && (
              <InfoModal
                isOpen={isModalOpen}
                onClose={() => {
                  setIsModalOpen(false);
                  setSelectedMember(null);
                }}
                member={selectedMember}
              />
            )}
          </div>
        )}
      </div>
    </section>
  );
};

export default ProjectTeam;
