import React from 'react';
import { useState } from 'react';
import { X } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { useToast } from '../components/hooks/use-toast';

interface RegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const RegistrationModal = ({ isOpen, onClose }: RegistrationModalProps) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    teamName: '',
    leaderName: '',
    leaderEmail: '',
    leaderPhone: '',
    field: '',
    members: [
      { name: '', age: '', email: '', phone: '' },
      { name: '', age: '', email: '', phone: '' },
      { name: '', age: '', email: '', phone: '' },
      { name: '', age: '', email: '', phone: '' }
    ]
  });

  const fields = ['Elektroonika', 'Mehaanika', 'Ehitus', 'IT'];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.teamName || !formData.leaderName || !formData.leaderEmail || !formData.field) {
      toast({
        title: "Viga",
        description: "Palun täida kõik vajalikud väljad",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Edukalt saadetud!",
      description: "Tiim registreeritud edukalt!",
    });

    onClose();
  };

  const updateMember = (index: number, field: string, value: string) => {
    const newMembers = [...formData.members];
    newMembers[index] = { ...newMembers[index], [field]: value };
    setFormData({ ...formData, members: newMembers });
  };

  if (!isOpen) return null;
};

const RegisterForm = () => {
  return (
    <div>
      Register Form
    </div>
  )
}

export default RegisterForm
