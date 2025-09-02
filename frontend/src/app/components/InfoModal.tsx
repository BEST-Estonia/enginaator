import React from 'react';
import Image from 'next/image';
import { Member } from './types';

interface InfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  member: Member;
}

const InfoModal: React.FC<InfoModalProps> = ({ isOpen, onClose, member }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center px-4">

      <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-4xl p-8 sm:p-10 flex flex-col sm:flex-row gap-6
             transition-all duration-300 ease-out
             opacity-100 scale-100 animate-[fadeIn_0.3s_ease-out]">

        <button
        onClick={onClose}
        className="absolute top-0 rounded-r-xl right-0 h-full w-12 bg-[hsl(var(--enginaator-red))] flex items-center justify-center text-white text-2xl hover:bg-red-700 transition-colors duration-200 cursor-pointer"
        aria-label="Close modal"
        >
        ✕
        </button>



        <div className="flex-shrink-0 mx-auto sm:mx-0">
          <Image
            src={member.image}
            alt={member.name}
            width={200}
            height={260}
            className="rounded-md object-cover aspect-[3/4]"
          />
        </div>

        <div className="flex flex-col justify-center [font-family:var(--font-poppins)]">
          <h2 className="text-2xl font-bold mb-1">{member.name}</h2>
          <p className="text-[hsl(var(--enginaator-red))] font-semibold mb-4">{member.role}</p>

          <p className="text-sm mb-2"><strong>Telefon:</strong> {member.phone}</p>
          <p className="text-sm mb-4"><strong>Email:</strong> {member.email}</p>

          <p className="text-gray-700 text-sm">{member.description}</p>
        </div>
      </div>
    </div>
  );
};

export default InfoModal;
