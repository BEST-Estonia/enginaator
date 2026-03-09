"use client";

import { useState, useEffect } from "react";
import { getIntroduction, updateIntroduction, createDefaultIntroduction, Introduction, Feature } from "@/services/introductionService";
import Image from "next/image";

interface IntroductionEditorProps {
  setActiveSection: (section: string) => void;
}

const IntroductionEditor = ({ setActiveSection }: IntroductionEditorProps) => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  
  // Form state
  const [introduction, setIntroduction] = useState<Introduction | null>(null);
  const [showCreateButton, setShowCreateButton] = useState(false);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        setError(null);
        const data = await getIntroduction();
        setIntroduction(data);
        setShowCreateButton(false);
      } catch (err: any) {
        console.error("Failed to fetch introduction:", err);
        if (err.message === 'INTRODUCTION_NOT_FOUND') {
          setShowCreateButton(true);
          setError(null);
        } else {
          setError("Failed to load introduction content");
        }
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!introduction) return;
    setIntroduction({
      ...introduction,
      title: e.target.value
    });
  };

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (!introduction) return;
    setIntroduction({
      ...introduction,
      description: e.target.value
    });
  };

  const handleFeatureChange = (index: number, field: keyof Feature, value: string) => {
    if (!introduction) return;
    const updatedFeatures = [...introduction.features];
    updatedFeatures[index] = {
      ...updatedFeatures[index],
      [field]: value
    };
    
    setIntroduction({
      ...introduction,
      features: updatedFeatures
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!introduction) return;
    
    try {
      setSaving(true);
      setError(null);
      setSuccess(null);
      
      await updateIntroduction(introduction);
      setSuccess("Introduction updated successfully!");
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccess(null);
      }, 3000);
    } catch (err) {
      console.error("Failed to update introduction:", err);
      setError("Failed to save changes. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleCreateDefault = async () => {
    try {
      setLoading(true);
      setError(null);
      setSuccess(null);
      const data = await createDefaultIntroduction();
      setIntroduction(data);
      setShowCreateButton(false);
      setSuccess("Default introduction created successfully!");
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccess(null);
      }, 3000);
    } catch (err) {
      console.error("Failed to create default introduction:", err);
      setError("Failed to create default content. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white shadow-sm rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Introduction Section Editor</h2>
        <button
          onClick={() => setActiveSection('dashboard')}
          className="text-sm text-gray-500 hover:text-gray-700"
        >
          Back to Dashboard
        </button>
      </div>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      {success && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
          {success}
        </div>
      )}
      
      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
          <p className="mt-2 text-gray-600">Loading...</p>
        </div>
      ) : showCreateButton ? (
        <div className="text-center py-12">
          <p className="mb-4 text-gray-600">No introduction content found.</p>
          <button
            onClick={handleCreateDefault}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
          >
            Create Default Introduction
          </button>
        </div>
      ) : introduction ? (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Title
            </label>
            <input
              type="text"
              value={introduction.title}
              onChange={handleTitleChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              value={introduction.description}
              onChange={handleDescriptionChange}
              className="w-full p-3 border border-gray-300 rounded-lg h-32 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
          
          <h3 className="text-lg font-medium mt-8 mb-4">Features</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {introduction.features.map((feature, index) => (
              <div key={feature.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex justify-between items-start mb-4">
                  <h4 className="font-medium">Feature {index + 1}</h4>
                  <div className="w-12 h-12 relative">
                    {feature.iconPath && (
                      <Image
                        src={feature.iconPath}
                        alt={feature.title}
                        width={48}
                        height={48}
                        className="object-contain"
                      />
                    )}
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Title
                    </label>
                    <input
                      type="text"
                      value={feature.title}
                      onChange={(e) => handleFeatureChange(index, 'title', e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Description
                    </label>
                    <input
                      type="text"
                      value={feature.description}
                      onChange={(e) => handleFeatureChange(index, 'description', e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Icon Path
                    </label>
                    <input
                      type="text"
                      value={feature.iconPath}
                      onChange={(e) => handleFeatureChange(index, 'iconPath', e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="flex justify-end mt-8">
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-300 font-medium"
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      ) : (
        <div className="text-center py-8">
          <p className="text-gray-500">Something went wrong. Please refresh the page.</p>
        </div>
      )}
    </div>
  );
};

export default IntroductionEditor;