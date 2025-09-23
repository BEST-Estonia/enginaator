"use client"
import React, { useState, useEffect } from 'react';
import { useToast } from '@/app/components/hooks/use-toast';
import { getAbout, updateAbout, createDefaultAbout, About } from '@/services/aboutService';


const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

interface AboutEditorProps {
    setActiveSection: (section: string) => void;
}

const AboutEditor: React.FC<AboutEditorProps> = ({ setActiveSection }) => {
    const {toast} = useToast();
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

    //form state
    const [about, setAbout] = useState<About>();

    //Fetch about section on mount
    useEffect(() => {
      loadAbout();
    }, []);

    const loadAbout = async () => {
      setIsLoading(true);
      try {
        const data = await getAbout();
        setAbout(data);
      } catch (error: any) {
        //If no about content exists, create default content
        if (error.message === "About content not found") {
          try {
            const defaultData = await createDefaultAbout();
            setAbout(defaultData);
            toast({
              title: "Info",
              description: "Created default about content",
            });
          } catch (createError) {
            console.error("Error creating default about:", createError);
            toast({
              title: "Error",
              description: "Failed to create default about content",
              variant: "destructive"
            });
          }
        } else {
          console.error("Error fetching about section:", error);
          toast({
            title: "Error",
            description: "Failed to load about section data",
            variant: "destructive"
          });
        }
  
      } finally {
        setIsLoading(false);
      }
    }
    
    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();

      if (!about) {
        toast({
          title: "Error",
          description: "No about section data to save.",
          variant: "destructive"
        });
        setIsSaving(false);
        return;
      }

      setIsSaving(true);

      // Add a 1 second delay before saving
      setTimeout(async () => {
        try {
          const updated = await updateAbout(about);
          setAbout(updated);
          toast({
            title: "Success",
            description: "Event information updated successfully."
          });
        } catch (error) {
          console.error("Error updating about section:", error);
          toast({
            title: "Error",
            description: "Failed to update event information.",
            variant: "destructive"
          });
        } finally {
          setIsSaving(false);
        }
      }, 1000); // 1000ms = 1 second
    }
    
    return (
      <div className="max-w-2xl mx-auto bg-white shadow-lg rounded-lg p-8 mt-8">
        <h2 className="text-2xl font-bold mb-6 text-black-800">Edit Event Information</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="font-semibold block mb-2 text-gray-700">Kus (Location)</label>
            <textarea
              value={about?.kusContent || ""}
              onChange={e => setAbout(about => about ? { ...about, kusContent: e.target.value } : about)}
              className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-red-400 transition"
              rows={5}
              disabled={isLoading || isSaving}
              placeholder="Enter location details..."
            />
          </div>
          <div>
            <label className="font-semibold block mb-2 text-gray-700">Osalejad (Participants)</label>
            <textarea
              value={about?.osalejadContent || ""}
              onChange={e => setAbout(about => about ? { ...about, osalejadContent: e.target.value } : about)}
              className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-red-400 transition"
              rows={5}
              disabled={isLoading || isSaving}
              placeholder="Enter participants details..."
            />
          </div>
          <div>
            <label className="font-semibold block mb-2 text-gray-700">Auhinnad (Prizes)</label>
            <textarea
              value={about?.auhinnadContent || ""}
              onChange={e => setAbout(about => about ? { ...about, auhinnadContent: e.target.value } : about)}
              className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-red-400 transition"
              rows={5}
              disabled={isLoading || isSaving}
              placeholder="Enter prizes details..."
            />
          </div>
          <button
            type="submit"
            className={`bg-red-500 hover:bg-red-600 transition text-white px-6 py-2 rounded-lg font-semibold shadow ${isSaving || isLoading ? "opacity-60 cursor-not-allowed" : ""}`}
            disabled={isSaving || isLoading}
          >
            {isSaving ? "Saving..." : "Save"}
          </button>
        </form>
        {isLoading && (
          <div className="mt-6 text-center text-gray-500 animate-pulse">Loading event information...</div>
        )}
      </div>
    );
};

export default AboutEditor;
