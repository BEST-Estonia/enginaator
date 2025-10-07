"use client"

import React from 'react';
import { useModal } from '../context/ModalContext';
import RegistrationModal from './RegistrationModal';

const RegistrationModalWrapper = () => {
  const { isModalOpen, closeModal } = useModal();
  
  return (
    <RegistrationModal 
      isOpen={isModalOpen}
      onClose={closeModal}
    />
  );
};

export default RegistrationModalWrapper;