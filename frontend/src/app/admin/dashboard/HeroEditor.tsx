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
  const [isUploading, setIsUploading] = useState(false);
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

    try {
      setIsUploading(true);
      
      // Create FormData for file upload
      const formData = new FormData();
      formData.append('image', file);
      
      // Upload the image to Cloudinary via hero upload endpoint
      const uploadRes = await fetch(`${API_URL}/api/hero/upload`, {
        method: 'POST',
        body: formData,
      });
      
      if (!uploadRes.ok) {
        const errorText = await uploadRes.text();
        console.error("Upload error response:", errorText);
        throw new Error(`Upload failed: ${uploadRes.status}`);
      }
      
      const uploadResult = await uploadRes.json();
      
      if (uploadResult.success) {
        // Update hero data with the Cloudinary URL
        setHeroData(prev => ({...prev, backgroundImage: uploadResult.url}));
        
        toast({
          title: "Success!",
          description: "Hero image uploaded successfully",
        });
      } else {
        throw new Error(uploadResult.error || "Upload failed");
      }
    } catch (error) {
      console.error("File upload error:", error);
      
      toast({
        title: "Error",
        description: "Failed to upload image. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsUploading(false);
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
                  {/* Custom styled file input */}
                  <div className="relative">
                    <label 
                      htmlFor="background-image-upload" 
                      className="flex items-center justify-center px-6 py-3 border border-gray-300 rounded-lg cursor-pointer bg-white hover:bg-gray-50 transition-colors group"
                    >
                      <span className="flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400 mr-2 group-hover:text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <span className="text-gray-600 group-hover:text-gray-700">
                          {isUploading ? 'Uploading...' : (heroData.backgroundImage ? 'Change Background Image' : 'Select Background Image')}
                        </span>
                      </span>
                    </label>
                    <input 
                      id="background-image-upload"
                      type='file'
                      accept='image/*'
                      onChange={handleFileChange}
                      disabled={isUploading}
                      className='absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed'
                    />
                  </div>
                  
                  {/* Current image preview */}
                  {heroData.backgroundImage && (
                    <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                      <p className="text-xs text-gray-500 mb-2">Current background image:</p>
                      <div className="h-32 flex items-center justify-center">
                        <img
                          src={heroData.backgroundImage}
                          alt="Background preview"
                          className="max-h-28 object-contain rounded"
                        />
                      </div>
                    </div>
                  )}
                  
                  <p className="text-sm text-gray-500 mt-1">Upload JPG, PNG, or WebP. Max size: 5MB. Images will be stored on Cloudinary.</p>
                </div>
              </div>
            </div>
            <div className="mt-6 flex justify-between items-center">
              <div>
                {(isSaving || isUploading) && (
                  <span className="text-gray-500">
                    {isUploading ? 'Uploading image...' : 'Saving changes...'}
                  </span>
                )}
              </div>
              <button
                onClick={handleSaveChanges}
                disabled={isSaving || isUploading}
                className={`bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-lg font-medium transition-colors ${(isSaving || isUploading) ? 'opacity-70 cursor-not-allowed' : ''}`}
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