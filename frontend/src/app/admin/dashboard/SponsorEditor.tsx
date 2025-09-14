"use client";

import { useToast } from '@/app/components/hooks/use-toast';
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { fetchSponsors, createSponsor, deleteSponsor, Sponsor } from '@/services/sponsorService';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

interface SponsorEditorProps {
  setActiveSection: (section: string) => void;
}

const SponsorEditor: React.FC<SponsorEditorProps> = ({ setActiveSection }) => {
  const { toast } = useToast();
  const [sponsors, setSponsors] = useState<Sponsor[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  
  // Form state
  const [sponsorName, setSponsorName] = useState('');
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [sponsorWebsite, setSponsorWebsite] = useState('');
  const [sponsorTier, setSponsorTier] = useState('');

  // Fetch sponsors on mount
  useEffect(() => {
    loadSponsors();
  }, []);

  const loadSponsors = async () => {
    setIsLoading(true);
    try {
      const data = await fetchSponsors();
      setSponsors(data);
    } catch (err) {
      console.error("Error fetching sponsors:", err);
      toast({
        title: "Error",
        description: "Failed to load sponsors data.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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

    setSelectedImage(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedImage) {
      toast({
        title: "Error",
        description: "Please select an image.",
        variant: "destructive"
      });
      return;
    }

    setIsSaving(true);
    try {
      // Use the createSponsor service function directly
      const result = await createSponsor(
        sponsorName || 'Unnamed Sponsor', 
        selectedImage,
        sponsorWebsite || undefined,
        sponsorTier || undefined
      );
      
      if (result) {
        toast({
          title: "Success!",
          description: "Sponsor added successfully",
        });
        
        // Reset form
        setSponsorName('');
        setSelectedImage(null);
        setPreviewUrl(null);
        setSponsorWebsite('');
        setSponsorTier('');
        
        // Refresh sponsor list
        loadSponsors();
      } else {
        throw new Error("Failed to create sponsor");
      }
    } catch (error) {
      console.error("Error adding sponsor:", error);
      toast({
        title: "Error",
        description: "Failed to add sponsor. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteSponsor = async (id: string) => {
    if (confirm("Are you sure you want to delete this sponsor?")) {
      setIsSaving(true);
      try {
        const success = await deleteSponsor(id);
        if (success) {
          toast({
            title: "Success!",
            description: "Sponsor deleted successfully",
          });
          loadSponsors();
        } else {
          throw new Error("Failed to delete sponsor");
        }
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to delete sponsor. Please try again.",
          variant: "destructive"
        });
      } finally {
        setIsSaving(false);
      }
    }
  };

  return (
    <div className='space-y-6'>
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Edit Sponsors</h2>
          <p className="text-gray-600">Manage sponsors for your website</p>
        </div>
        <button 
          onClick={() => setActiveSection('dashboard')}
          className="text-gray-500 hover:text-gray-700 transition-colors"
        >
          ← Back to Dashboard
        </button>
      </div>

      {/* Add New Sponsor Form */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Add New Sponsor</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-2'>
              Sponsor Name
            </label>
            <input 
              type='text'
              value={sponsorName}
              onChange={(e) => setSponsorName(e.target.value)}
              className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500'
              placeholder='Enter sponsor name'
            />
          </div>
          
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-2'>
              Website (Optional)
            </label>
            <input 
              type='text'
              value={sponsorWebsite}
              onChange={(e) => setSponsorWebsite(e.target.value)}
              className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500'
              placeholder='https://example.com'
            />
          </div>
          
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-2'>
              Sponsor Logo
            </label>
            <div className="space-y-3">
              {/* Custom styled file input */}
              <div className="relative">
                <label 
                  htmlFor="sponsor-logo-upload" 
                  className="flex items-center justify-center px-6 py-3 border border-gray-300 rounded-lg cursor-pointer bg-white hover:bg-gray-50 transition-colors group"
                >
                  <span className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400 mr-2 group-hover:text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span className="text-gray-600 group-hover:text-gray-700">
                      {selectedImage ? 'Change Logo Image' : 'Select Logo Image'}
                    </span>
                  </span>
                </label>
                <input 
                  id="sponsor-logo-upload"
                  type='file'
                  accept='image/*'
                  onChange={handleImageChange}
                  className='absolute inset-0 w-full h-full opacity-0 cursor-pointer'
                />
              </div>
              
              {/* Preview selected image */}
              {previewUrl && (
                <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                  <p className="text-xs text-gray-500 mb-2">Preview:</p>
                  <div className="h-20 flex items-center justify-center">
                    <Image 
                      src={previewUrl} 
                      alt="Preview" 
                      width={160} 
                      height={64}
                      className="max-h-16 object-contain"
                      unoptimized
                    />
                  </div>
                </div>
              )}
              
              <p className="text-sm text-gray-500 mt-1">Upload JPG, PNG, or WebP. Max size: 5MB</p>
            </div>
          </div>
          
          <div className="mt-6">
            <button
              type="submit"
              disabled={isSaving || !selectedImage}
              className={`bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-lg font-medium transition-colors ${(isSaving || !selectedImage) ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              {isSaving ? 'Adding...' : 'Add Sponsor'}
            </button>
          </div>
        </form>
      </div>

      {/* Current Sponsors List */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Current Sponsors</h3>
        
        {isLoading ? (
          <div className="text-center py-8">
            <p className="text-gray-500">Loading sponsors...</p>
          </div>
        ) : sponsors.length === 0 ? (
          <div className="text-center py-8 border-dashed border-2 border-gray-200 rounded-lg">
            <p className="text-gray-500">No sponsors added yet. Add your first sponsor above.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {sponsors.map((sponsor) => (
              <div 
                key={sponsor.id} 
                className="border rounded-lg p-4 flex flex-col items-center hover:shadow-md transition-shadow"
              >
                <div className="h-24 flex items-center justify-center mb-3">
                  <Image 
                    src={sponsor.imageUrl.startsWith('/') 
                      ? `http://localhost:8000${sponsor.imageUrl}` 
                      : sponsor.imageUrl} 
                    alt={sponsor.name} 
                    width={160}
                    height={80}
                    className="max-h-20 object-contain"
                    unoptimized
                  />
                </div>
                <div className="text-center mb-3">
                  <h4 className="font-medium text-gray-900">{sponsor.name}</h4>
                  {sponsor.website && (
                    <a 
                      href={sponsor.website} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-sm text-blue-500 hover:underline"
                    >
                      Visit Website
                    </a>
                  )}
                  {sponsor.tier && (
                    <span className="block text-xs text-gray-500 mt-1">
                      {sponsor.tier.charAt(0).toUpperCase() + sponsor.tier.slice(1)} Tier
                    </span>
                  )}
                </div>
                <button
                  onClick={() => handleDeleteSponsor(sponsor.id)}
                  disabled={isSaving}
                  className="text-sm text-red-500 hover:text-red-700 focus:outline-none mt-auto"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SponsorEditor;