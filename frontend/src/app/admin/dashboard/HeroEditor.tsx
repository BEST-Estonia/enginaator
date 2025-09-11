"use client"

import { useToast } from '@/app/components/hooks/use-toast';
import React, {useState, useEffect} from 'react';
import Hero from "@/app/sections/Hero";

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

interface HeroEditorProps {
  setActiveSection: (section: string) => void;
}

const HeroEditor: React.FC<HeroEditorProps> = ({ setActiveSection }) => {
  const {toast} = useToast();
  const [heroData, setHeroData] = useState({
    dateText: "",
    mainTitle: "",
    eventDate: "",
    backgroundImage: "",
    eventDateInfo: "",
    location: "",
    audience: "",
    duration: ""
  });

  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [previewKey, setPreviewKey] = useState(Date.now()); // Force re-render of preview

  // Fetch hero data on mount
  useEffect(() => {
    async function fetchData() {
      setIsLoading(true);
      try {
        const res = await fetch(`${API_URL}/api/hero`);
        const data = await res.json();
        if (data.success && data.data) {
          setHeroData(data.data);
        } else {
          throw new Error(data.error || "Failed to load data");
        }
      } catch (err) {
        console.error("Error fetching hero data:", err);
        toast({
          title: "Error",
          description: "Failed to load hero section data.",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, []);

  // Save changes
  const handleSaveChanges = async () => {
    setIsSaving(true);
    try {
      const res = await fetch(`${API_URL}/api/hero`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(heroData)
      });
      const result = await res.json();
      if (result.success) {
        toast({
          title: "Success!",
          description: "Hero section updated.",
        });
        // Force preview to refresh
        setPreviewKey(Date.now());
      } else {
        throw new Error(result.error || "Unknown error");
      }
    } catch (err) {
      toast({
        title: "Error",
        description: err.message || "Failed to update hero section.",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "Error",
        description: "Image file is too large. Maximum size is 5MB.",
        variant: "destructive"
      });
      return;
    }

    // Preview URL for immediate feedback
    const previewUrl = URL.createObjectURL(file);
    setHeroData({...heroData, backgroundImage: previewUrl });
    setPreviewKey(Date.now()); // Update preview with new image

    try {
      setIsSaving(true);
      
      // Create FormData for file upload
      const formData = new FormData();
      formData.append('image', file);
      
      // Upload the image
      const uploadRes = await fetch(`${API_URL}/api/upload`, {
        method: 'POST',
        body: formData
      });
      
      const uploadResult = await uploadRes.json();
      
      if (uploadResult.success) {
        // Update hero data with the real URL from the server
        setHeroData(prev => ({...prev, backgroundImage: uploadResult.url}));
        setPreviewKey(Date.now()); // Update preview again with server URL
        
        toast({
          title: "Success!",
          description: "Image uploaded successfully",
        });
      } else {
        throw new Error(uploadResult.error || "Upload failed");
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to upload image. Please try again.",
        variant: "destructive"
      });
      
      // Revert to previous image URL on error
      setHeroData(prev => ({
        ...prev,
        backgroundImage: prev.backgroundImage.startsWith('blob:')
          ? '' // Reset to empty to trigger fallback
          : prev.backgroundImage
      }));
      setPreviewKey(Date.now());
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className='space-y-6'>
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Edit Hero Section</h2>
          <p className="text-gray-600">Customize the hero section</p>
        </div>
        <button 
          onClick={() => setActiveSection('dashboard')}
          className="text-gray-500 hover:text-gray-700 transition-colors"
        >
          ← Back to Dashboard
        </button>
      </div>

      {isLoading ? (
        <div className="bg-white p-12 rounded-lg shadow-sm border border-gray-200 text-center">
          <p className="text-gray-500">Loading hero section data...</p>
        </div>
      ) : (
        <>
          <div className='bg-white p-6 rounded-lg shadow-sm border border-gray-200'>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Live Preview</h3>
            <div className="overflow-hidden rounded-lg border border-gray-100" style={{ height: "800px", position: "relative" }}>
              <Hero key={previewKey} {...heroData} />
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Edit Content</h3>
            <div className="space-y-4">
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>
                  Date Display Text
                </label>
                <input 
                  type='text'
                  value={heroData.dateText}
                  onChange={(e) => setHeroData({...heroData, dateText: e.target.value})}
                  className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500'
                  placeholder='17-20 APRILL 2025'
                />
              </div>
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>
                  Main Title
                </label>
                <input
                  type='text'
                  value={heroData.mainTitle}
                  onChange={(e) => setHeroData({...heroData, mainTitle: e.target.value})}
                  className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500'
                  placeholder='ÜLE-EESTILINE INSENERIVÕISTLUS'
                />
              </div>
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>
                  Event Date Info (Bottom Bar)
                </label>
                <input
                  type='text'
                  value={heroData.eventDateInfo}
                  onChange={(e) => setHeroData({...heroData, eventDateInfo: e.target.value})}
                  className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-red-500'
                  placeholder='17-20. aprill 2026'
                />
              </div>
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>
                  Event Location
                </label>
                <input 
                  type='text'
                  value={heroData.location}
                  onChange={(e) => setHeroData({...heroData, location: e.target.value})}
                  className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500'
                  placeholder='TalTech'
                  />
              </div>
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>
                  Target Audience
                </label>
                <input
                  type='text'
                  value={heroData.audience}
                  onChange={(e) => setHeroData({...heroData, audience: e.target.value})}
                  className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500'
                  placeholder='Insenerihuvilistele noortele'
                />
              </div>
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>
                  Event Duration
                </label>
                <input
                  type='text'
                  value={heroData.duration}
                  onChange={(e) => setHeroData({...heroData, duration: e.target.value})}
                  className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500'
                  placeholder='4 päeva'
                />
              </div>
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>
                  Event Countdown Date
                </label>
                <input
                  type='text'
                  value={heroData.eventDate}
                  onChange={(e) => setHeroData({...heroData, eventDate: e.target.value})}
                  className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500'
                  placeholder='April 17, 2026 00:00:00'
                />
                <p className="text-xs text-gray-500 mt-1">Format: "Month Day, Year HH:MM:SS"</p>
              </div>
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>
                  Background Image
                </label>
                <div className="space-y-3">
                  <div className="relative h-32 bg-gray-100 rounded-lg overflow-hidden">
                    <img
                      src={heroData.backgroundImage || '/assets/hero-img.jpg'}
                      alt='Current background'
                      className='w-full h-full object-cover'
                      onError={(e) => {
                        e.currentTarget.src = '/assets/hero-img.jpg';
                      }} 
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-25 flex items-center justify-center">
                      <span className="text-white text-sm font-medium">Current Background</span>
                    </div>
                  </div>
                  <input 
                    type='file'
                    accept='image/*'
                    onChange={handleFileChange}
                    className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500'  
                  />
                  <p className="text-sm text-gray-500">Upload JPG, PNG, or WebP. Max size: 5MB</p>
                </div>
              </div>
            </div>
            <div className="mt-6 flex justify-between items-center">
              <div>
                {isSaving && <span className="text-gray-500">Saving changes...</span>}
              </div>
              <button
                onClick={handleSaveChanges}
                disabled={isSaving}
                className={`bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-lg font-medium transition-colors ${isSaving ? 'opacity-70 cursor-not-allowed' : ''}`}
              >
                {isSaving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default HeroEditor;