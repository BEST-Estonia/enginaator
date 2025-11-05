"use client"
import { useState } from 'react';
import { X, Check } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Checkbox } from './ui/checkbox';
import { useToast } from './hooks/use-toast';
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
      { name: '', age: '', email: '', phone: '', accommodation: false, shirtSize: '', diet: '', school: '', consent: false},
      { name: '', age: '', email: '', phone: '', accommodation: false, shirtSize: '', diet: '', school: '', consent: false},
      { name: '', age: '', email: '', phone: '', accommodation: false, shirtSize: '', diet: '', school: '', consent: false},
      { name: '', age: '', email: '', phone: '', accommodation: false, shirtSize: '', diet: '', school: '', consent: false},
    ]
  });

  const fields = ['Elektroonika', 'Mehaanika', 'Ehitus', 'IT'];
  const [submitting, setSubmitting] = useState(false);

  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return;

    if (!formData.teamName || !formData.leaderName || !formData.leaderEmail || !formData.field) {
      toast({ title: "Viga", description: "Palun täida kõik vajalikud väljad", variant: "destructive" });
      return;
    }

    setSubmitting(true);
    try {
      const cleanedMembers = formData.members.filter(m =>
        (m.name && m.name.trim()) ||
        (m.email && m.email.trim()) ||
        (m.phone && m.phone.trim()) ||
        (m.age && m.age.trim()) ||
        (m.school && m.school.trim()) ||
        (m.diet && m.diet.trim()) ||
        m.shirtSize || m.accommodation
      );

      for (const [i, m] of cleanedMembers.entries()) {
      const nonEmpty =
        (m.name?.trim() ||
         m.email?.trim() ||
         m.phone?.trim() ||
         m.age?.trim() ||
         m.school?.trim() ||
         m.diet?.trim() ||
         m.shirtSize ||
         m.accommodation);

      if (nonEmpty && !m.consent) {
        toast({
          title: "Nõusolek puudu",
          description: `Liikmel #${i + 1} peab nõusolek märgitud olema.`,
          variant: "destructive",
        });
        return;
      }
    }

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000"}/api/teams/register`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            teamName: formData.teamName,
            field: formData.field,
            leaderName: formData.leaderName,
            leaderEmail: formData.leaderEmail,
            leaderPhone: formData.leaderPhone,
                members: cleanedMembers.map(m => ({
            name: m.name?.trim() || "",
            age: m.age?.trim() || "",
            email: m.email?.trim() || null,
            phone: m.phone?.trim() || null,
            accommodation: !!m.accommodation,
            shirtSize: m.shirtSize || null,
            school: m.school?.trim() || null,
            diet: m.diet?.trim() || null,
            consent: !!m.consent,
          })),
          }),
        }
      );

      const data = await res.json();
      if (!res.ok) {
        // logi toores objekt
        console.error("Register 400 details (raw):", data);

        // vorminda fieldErrors loetavaks
        const fieldErrors = data?.details?.fieldErrors ?? {};
        const pretty = Object.entries(fieldErrors)
          .map(([field, msgs]) => `${field}: ${(msgs as string[]).join(", ")}`)
          .join(" | ");

        console.error("Register 400 details (pretty):", pretty || "(no fieldErrors)");
        toast({
          title: "Viga",
          description: pretty || data?.error || "Serveri viga",
          variant: "destructive",
        });
        return;
      }


        toast({ title: "Edukalt saadetud!", description: "Tiim registreeritud!" });
        onClose();
      } catch (err) {
        console.error(err);
        toast({ title: "Võrguviga", description: "Proovi uuesti.", variant: "destructive" });
      } finally {
        setSubmitting(false);
      }
    };


  const updateMember = (
    index: number,
    field: 'name' | 'age' | 'email' | 'phone' | 'accommodation' | 'shirtSize' | 'school' | 'diet' | 'consent',
    value: string | boolean
  ) => {
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
                  required
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

                  <div>
                    <Label>Särgi suurus</Label>
                    <Select
                      value={member.shirtSize}
                      onValueChange={(v) => updateMember(index, 'shirtSize', v)}
                    >
                      <SelectTrigger
                        className="mt-2 h-10 w-full rounded-md border border-gray-300 bg-white
                                  px-3 py-2 text-sm
                                  focus:outline-none focus:ring-2 focus:ring-[hsl(var(--enginaator-red))] focus:ring-offset-0
                                  focus:border-[hsl(var(--enginaator-red))]"
                      >
                        <SelectValue placeholder="Vali suurus" />
                      </SelectTrigger>
                      <SelectContent
                        position="popper"
                        className="z-[999] bg-white border border-gray-200"
                        sideOffset={5}
                        align="center"
                        avoidCollisions
                      >
                        {['XS','S','M','L','XL','XXL'].map(s => (
                          <SelectItem
                            key={s}
                            value={s}
                            className="text-sm h-9 py-2 focus:bg-red-100 data-[state=checked]:bg-red-600 data-[state=checked]:text-white"
                          >
                            {s}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                    <div className="lg:col-span-2">
                      <Label htmlFor={`acc-${index}`}>Kas soovid majutust?</Label>
                      <div className="mt-2 h-10 w-full rounded-md border border-gray-300 px-3 flex items-center gap-3
                                      focus-within:ring-2 focus-within:ring-[hsl(var(--enginaator-red))] focus-within:border-[hsl(var(--enginaator-red))]">
                        <Checkbox
                          id={`acc-${index}`}
                          checked={!!member.accommodation}
                          onCheckedChange={(checked) => updateMember(index, "accommodation", Boolean(checked))}
                        />
                        <span className="text-sm select-none">{member.accommodation ? "Jah" : "Ei"}</span>
                      </div>
                    </div>

                    <div className="lg:col-span-3">
                      <Label>Mis koolist/ülikoolist tuled?</Label>
                      <Input
                        value={member.school || ""}
                        onChange={(e) => updateMember(index, "school", e.target.value)}
                          className="
                          mt-2 border-gray-300
                          placeholder:text-xs
                          placeholder:text-black/40
                          focus:placeholder:text-black/60
                          focus:border-[hsl(var(--enginaator-red))]
                          focus:ring-[hsl(var(--enginaator-red))]
                        "
                        placeholder="nt TalTech / Tartu Ülikool / ..."
                      />
                    </div>

                  <div className="lg:col-span-3">
                    <Label>Toitumiseelistused</Label>
                    <Input
                      value={member.diet || ""}
                      onChange={(e) => updateMember(index, "diet", e.target.value)}
                      className="mt-2 border-gray-300 focus:border-[hsl(var(--enginaator-red))] focus:ring-[hsl(var(--enginaator-red))]"
                    />
                  </div>
                    <div className="lg:col-span-5 col-span-full">
                      <div className="rounded-xl border border-gray-200 p-4">
                        <div className="flex items-start gap-3">
                        <Checkbox
                          id={`consent-${index}`}
                          checked={!!member.consent}
                          onCheckedChange={(checked) => updateMember(index, "consent", Boolean(checked))}
                        />
                        <label htmlFor={`consent-${index}`} className="text-xs leading-5 cursor-pointer">
                          <span className="font-medium">Nõusolek *</span> —
                          Luban, et minu isikuandmeid kasutatakse Enginaator 2025 korraldamise jaoks /
                          I agree that my personal data will be used for the organization of Enginaator 2025
                        </label>
                        </div>
                      </div>
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
              disabled={submitting}
              className={cn(
                "flex-1 bg-[#ce1f22] hover:bg-[#B8252A] text-white font-medium py-3 rounded-md transition-all duration-200 hover:scale-[1.02]",
                submitting && "opacity-60 cursor-not-allowed hover:scale-100"
              )}
            >
              {submitting ? "Saadan..." : "Registreeri tiim"}
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