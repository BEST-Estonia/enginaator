"use client"
import { useState } from 'react';
import { X, Check } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { toast } from './hooks/use-toast';
import { cn } from '@/lib/utils';

interface RegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const RegistrationModal = ({ isOpen, onClose }: RegistrationModalProps) => {
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

    // Success toast
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl p-8 max-w-4xl max-h-[90vh] overflow-y-auto mx-4 w-full">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold text-[hsl(var(--enginaator-black))]">
            Registreeri oma tiim
          </h2>
          <Button variant="ghost" onClick={onClose}>
            <X className="w-6 h-6" />
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Team Information */}
          <div>
            <h3 className="text-xl font-semibold text-[hsl(var(--enginaator-black))] mb-6">
              Tiimi info
            </h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="teamName">Tiimi nimi *</Label>
                <Input
                  id="teamName"
                  value={formData.teamName}
                  onChange={(e) => setFormData({...formData, teamName: e.target.value})}
                  className="mt-2 border-gray-300 focus:border-[hsl(var(--enginaator-red))] focus:ring-[hsl(var(--enginaator-red))]"
                  required
                />
              </div>
              <div style={{ position: 'relative', zIndex: 100 }}>
                <Label htmlFor="field">Valdkond *</Label>
                <Select value={formData.field} onValueChange={(value) => setFormData({...formData, field: value})}>
                  <SelectTrigger 
                    className="mt-2 border-gray-300 focus:border-[hsl(var(--enginaator-red))] focus:ring-[hsl(var(--enginaator-red))]"
                  >
                    <SelectValue placeholder="Vali valdkond" />
                  </SelectTrigger>
                  <SelectContent 
                    position="popper" 
                    className="z-[999] bg-white border border-gray-200" 
                    sideOffset={5} 
                    align="center"
                    avoidCollisions={true}
                  >
                    {fields.map((field) => (
                      <SelectItem 
                        key={field} 
                        value={field}
                        className="focus:bg-red-100 data-[state=checked]:bg-red-600 data-[state=checked]:text-white"
                      >
                        <div className="flex items-center">
                          <span className="mr-2 opacity-0 data-[state=checked]:opacity-100">
                            <Check className="h-4 w-4" />
                          </span>
                          {field}
                        </div>
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
                  className="mt-2 border-gray-300 focus:border-[hsl(var(--enginaator-red))] focus:ring-[hsl(var(--enginaator-red))]"
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
                  className="mt-2 border-gray-300 focus:border-[hsl(var(--enginaator-red))] focus:ring-[hsl(var(--enginaator-red))]"
                  required
                />
              </div>
              <div>
                <Label htmlFor="leaderPhone">Tiimijuhi telefon</Label>
                <Input
                  id="leaderPhone"
                  value={formData.leaderPhone}
                  onChange={(e) => setFormData({...formData, leaderPhone: e.target.value})}
                  className="mt-2 border-gray-300 focus:border-[hsl(var(--enginaator-red))] focus:ring-[hsl(var(--enginaator-red))]"
                />
              </div>
            </div>
          </div>

          {/* Team Members */}
          <div>
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
                        className="mt-2 border-gray-300 focus:border-[hsl(var(--enginaator-red))] focus:ring-[hsl(var(--enginaator-red))]"
                      />
                    </div>
                    <div>
                      <Label>Vanus</Label>
                      <Input
                        value={member.age}
                        onChange={(e) => updateMember(index, 'age', e.target.value)}
                        className="mt-2 border-gray-300 focus:border-[hsl(var(--enginaator-red))] focus:ring-[hsl(var(--enginaator-red))]"
                      />
                    </div>
                    <div>
                      <Label>E-mail</Label>
                      <Input
                        type="email"
                        value={member.email}
                        onChange={(e) => updateMember(index, 'email', e.target.value)}
                        className="mt-2 border-gray-300 focus:border-[hsl(var(--enginaator-red))] focus:ring-[hsl(var(--enginaator-red))]"
                      />
                    </div>
                    <div>
                      <Label>Telefon</Label>
                      <Input
                        value={member.phone}
                        onChange={(e) => updateMember(index, 'phone', e.target.value)}
                        className="mt-2 border-gray-300 focus:border-[hsl(var(--enginaator-red))] focus:ring-[hsl(var(--enginaator-red))]"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Find Teammates Info */}
          <div className="bg-[hsl(var(--enginaator-light))] rounded-xl p-6">
            <p className="text-[hsl(var(--enginaator-gray))] text-center">
              Vajad tiimikaaslasi? Võta ühendust meie korraldusmeeskonnaga!
            </p>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4 pt-6">
            <button 
              type="submit" 
              className="flex-1 bg-[#ce1f22] hover:bg-[#B8252A] text-white font-medium py-3 rounded-md transition-all duration-200 hover:scale-[1.02]"
            >
              Registreeri tiim
            </button>
            <button 
              type="button" 
              onClick={onClose} 
              className="flex-1 bg-white border border-gray-300 text-black font-medium py-3 rounded-md transition-colors hover:border-[#D12A2D] hover:text-[#D12A2D]"
            >
              Tühista
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegistrationModal;