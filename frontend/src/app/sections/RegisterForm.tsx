"use client"

import React, { useState } from 'react';
import { X } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { useToast } from '../components/hooks/use-toast.tsx';

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
    
    // Basic validation
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
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div className="bg-white rounded-lg w-full max-w-3xl max-h-[90vh] overflow-y-auto p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">
            Registreeri oma tiim
          </h2>
          <button onClick={onClose} className="text-gray-500 hover:text-black">
            <X size={24} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit}>
          {/* Team Information */}
          <div className="space-y-4">
            <div>
              <Label htmlFor="teamName">Tiimi nimi *</Label>
              <Input
                id="teamName"
                value={formData.teamName}
                onChange={(e) => setFormData({...formData, teamName: e.target.value})}
                className="mt-2"
                required
              />
            </div>
            
            <div>
              <Label htmlFor="field">Valdkond *</Label>
              <Select 
                value={formData.field} 
                onValueChange={(value) => setFormData({...formData, field: value})}
              >
                <SelectTrigger className="mt-2">
                  <SelectValue placeholder="Vali valdkond" />
                </SelectTrigger>
                <SelectContent>
                  {fields.map((field) => (
                    <SelectItem key={field} value={field}>
                      {field}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="leaderName">Tiimijuhi nimi *</Label>
              <Input
                id="leaderName"
                value={formData.leaderName}
                onChange={(e) => setFormData({...formData, leaderName: e.target.value})}
                className="mt-2"
                required
              />
            </div>
            <div>
              <Label htmlFor="leaderEmail">Tiimijuhi e-mail *</Label>
              <Input
                id="leaderEmail"
                type="email"
                value={formData.leaderEmail}
                onChange={(e) => setFormData({...formData, leaderEmail: e.target.value})}
                className="mt-2"
                required
              />
            </div>
            <div>
              <Label htmlFor="leaderPhone">Tiimijuhi telefon</Label>
              <Input
                id="leaderPhone"
                value={formData.leaderPhone}
                onChange={(e) => setFormData({...formData, leaderPhone: e.target.value})}
                className="mt-2"
              />
            </div>
          </div>

          {/* Team Members */}
          <div className="mt-8">
            <h3 className="text-xl font-semibold text-[hsl(var(--enginaator-black))] mb-6">
              Tiimiliikmed
            </h3>
            <div className="space-y-6">
              {formData.members.map((member, index) => (
                <div key={index} className="border border-gray-200 rounded-xl p-6">
                  <h4 className="font-semibold text-[hsl(var(--enginaator-black))] mb-4">
                    Nimi {index + 1}
                  </h4>
                  <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div>
                      <Label>Nimi</Label>
                      <Input
                        value={member.name}
                        onChange={(e) => updateMember(index, 'name', e.target.value)}
                        className="mt-2"
                      />
                    </div>
                    <div>
                      <Label>Vanus</Label>
                      <Input
                        value={member.age}
                        onChange={(e) => updateMember(index, 'age', e.target.value)}
                        className="mt-2"
                      />
                    </div>
                    <div>
                      <Label>E-mail</Label>
                      <Input
                        type="email"
                        value={member.email}
                        onChange={(e) => updateMember(index, 'email', e.target.value)}
                        className="mt-2"
                      />
                    </div>
                    <div>
                      <Label>Telefon</Label>
                      <Input
                        value={member.phone}
                        onChange={(e) => updateMember(index, 'phone', e.target.value)}
                        className="mt-2"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Find Teammates Info */}
          <div className="bg-[hsl(var(--enginaator-light))] rounded-xl p-6 mt-8">
            <p className="text-[hsl(var(--enginaator-gray))] text-center">
              Vajad tiimikaaslasi? Võta ühendust meie korraldusmeeskonnaga!
            </p>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4 pt-6">
            <Button type="submit" className="btn-hero flex-1 bg-[hsl(var(--enginaator-red))]">
              Registreeri tiim
            </Button>
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">
              Tühista
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

const RegisterForm = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  return (
    <section id="panekirja" className="py-20 bg-gradient-subtle">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-8">Pane Kirja</h2>
        
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-lg text-gray-700 mb-6">
            Täida ankeet, et osaleda Enginaator võistlusel!
          </p>
          
          <Button 
            onClick={() => setIsModalOpen(true)}
            className="bg-[hsl(var(--enginaator-red))] hover:bg-[hsl(var(--enginaator-red-dark))]"
          >
            Registreeri oma tiim
          </Button>
        </div>
        
        <RegistrationModal 
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />
      </div>
    </section>
  );
};

export default RegisterForm;