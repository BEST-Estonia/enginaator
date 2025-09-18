"use client";
import { useToast } from '@/app/components/hooks/use-toast';
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { fetchGalleryImages, createGalleryImage, deleteGalleryImage, GalleryImage } from '@/services/galleryService';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

interface GalleryEditorProps {
  setActiveSection: (section: string) => void;
}

const GalleryEditor: React.FC<GalleryEditorProps> = ({ setActiveSection }) => {
  // Loading and message states
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Gallery Data
  const [images, setImages] = useState<GalleryImage[]>([]);

  // Form data for uploading
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [alt, setAlt] = useState('');
  const [caption, setCaption] = useState('');
  
  const { toast } = useToast();

  // Load gallery images on component mount
  useEffect(() => {
    loadGalleryImages();
  }, []);

  const loadGalleryImages = async () => {
    setLoading(true);
    try {
      const data = await fetchGalleryImages();
      setImages(data);
    } catch (error) {
      console.error("Error fetching images:", error);
      toast({
        title: "Error",
        description: "Failed to load image data.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file size (10MB max)
    if (file.size > 10 * 1024 * 1024) {
      toast({
        title: "Error",
        description: "Image file is too large. Maximum size is 10MB.",
        variant: "destructive"
      });
      return;
    }

    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedFile) {
      toast({
        title: "Error",
        description: "Please select an image file.",
        variant: "destructive"
      });
      return;
    }

    setUploading(true);
    try {
      const newImage = await createGalleryImage(selectedFile, alt, caption);

      if (newImage) {
        toast({
          title: "Success!",
          description: "Image uploaded successfully!"
        });

        // Reset form
        setSelectedFile(null);
        setPreviewUrl(null);
        setAlt('');
        setCaption('');

        // Reload images
        await loadGalleryImages();
      } else {
        throw new Error('Upload failed');
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      toast({
        title: "Error",
        description: "Failed to upload image.",
        variant: "destructive"
      });
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteImage = async (id: string) => {
    if (confirm("Are you sure you want to delete this image?")) {
      setIsSaving(true);
      try {
        const success = await deleteGalleryImage(id);
        if (success) {
          toast({
            title: "Success!",
            description: "Image deleted successfully",
          });
          loadGalleryImages();
        } else {
          throw new Error("Failed to delete Image");
        }
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to delete image. Please try again.",
          variant: "destructive"
        });
      } finally {
        setIsSaving(false);
      }
    }
  };
  
  return (
    <div className='space-y-6'>
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Gallery Management</h2>
          <p className="text-gray-600">Manage gallery images for your website</p>
        </div>
        <button 
          onClick={() => setActiveSection('dashboard')}
          className="text-gray-500 hover:text-gray-700 transition-colors"
        >
          ← Back to Dashboard
        </button>
      </div>

      {/* Add New Image Form */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Upload New Image</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-2'>
              Gallery Image
            </label>
            <div className="space-y-3">
              {/* Custom styled file input */}
              <div className="relative">
                <label 
                  htmlFor="gallery-image-upload" 
                  className="flex items-center justify-center px-6 py-3 border border-gray-300 rounded-lg cursor-pointer bg-white hover:bg-gray-50 transition-colors group"
                >
                  <span className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400 mr-2 group-hover:text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span className="text-gray-600 group-hover:text-gray-700">
                      {selectedFile ? 'Change Gallery Image' : 'Select Gallery Image'}
                    </span>
                  </span>
                </label>
                <input 
                  id="gallery-image-upload"
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
                  <div className="h-32 flex items-center justify-center">
                    <Image 
                      src={previewUrl} 
                      alt="Preview" 
                      width={200} 
                      height={128}
                      className="max-h-32 object-contain rounded"
                      unoptimized
                    />
                  </div>
                </div>
              )}
              
              <p className="text-sm text-gray-500 mt-1">Upload JPG, PNG, or GIF. Max size: 10MB</p>
            </div>
          </div>
          
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-2'>
              Alt Text (Optional)
            </label>
            <input 
              type='text'
              value={alt}
              onChange={(e) => setAlt(e.target.value)}
              className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500'
              placeholder='Describe the image for accessibility'
            />
          </div>
          
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-2'>
              Caption (Optional)
            </label>
            <input 
              type='text'
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500'
              placeholder='Image caption'
            />
          </div>
          
          <div className="mt-6">
            <button
              type="submit"
              disabled={uploading || !selectedFile}
              className={`bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg font-medium transition-colors ${(uploading || !selectedFile) ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              {uploading ? 'Uploading...' : 'Upload Image'}
            </button>
          </div>
        </form>
      </div>

      {/* Current Gallery Images */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Current Gallery Images</h3>
        
        {loading ? (
          <div className="text-center py-8">
            <p className="text-gray-500">Loading images...</p>
          </div>
        ) : images.length === 0 ? (
          <div className="text-center py-8 border-dashed border-2 border-gray-200 rounded-lg">
            <p className="text-gray-500">No images in gallery yet. Upload your first image above.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {images.map((image) => (
              <div 
                key={image.id}
                className="border rounded-lg p-4 flex flex-col hover:shadow-md transition-shadow"
              >
                {/* Image Display */}
                <div className="aspect-square mb-3 overflow-hidden rounded-lg bg-gray-100">
                  <Image 
                    src={`${API_URL}${image.url}`}
                    alt={image.alt || 'Gallery image'} 
                    width={200}
                    height={200}
                    className="w-full h-full object-cover"
                    unoptimized
                  />
                </div>

                {/* Image info */}
                <div className="flex-1">
                  {image.alt && (
                    <p className="text-sm text-gray-600 mb-1">
                      <strong>Alt:</strong> {image.alt}
                    </p>
                  )}
                  {image.caption && (
                    <p className="text-sm text-gray-600 mb-2">
                      <strong>Caption:</strong> {image.caption}
                    </p>
                  )}
                </div>

                {/* Delete Button */}
                <button
                  onClick={() => handleDeleteImage(image.id)}
                  disabled={isSaving}
                  className='text-sm text-red-500 hover:text-red-700 focus:outline-none mt-auto'
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

export default GalleryEditor;