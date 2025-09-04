"use client"

import React, { useState } from 'react';

interface HeroEditorProps {
  setActiveSection: (section: string) => void;
}

const HeroEditor: React.FC<HeroEditorProps> = ({ setActiveSection }) => {
  // Current hero content (matches your Hero.tsx component)
  const [heroData, setHeroData] = useState({
    dateText: "17-20 APRILL 2025",
    mainTitle: "ÜLE-EESTILINE INSENERIVÕISTLUS", 
    eventDate: "April 17, 2026 00:00:00",
    backgroundImage: "/assets/hero-img.jpg",
    // Bottom info bar
    eventDateInfo: "17-20. aprill 2026",
    location: "TalTech",
    audience: "Insenerihuvilistele noortele", 
    duration: "4 päeva"
  });

  const [isLoading, setIsLoading] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Edit Hero Section</h2>
          <p className="text-gray-600">Customize the main banner and countdown of your website</p>
        </div>
        <button
          onClick={() => setActiveSection('dashboard')}
          className="text-gray-500 hover:text-gray-700 transition-colors"
        >
          ← Back to Dashboard
        </button>
      </div>

      {/* Live Preview */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Live Preview</h3>
        <div className="relative h-64 bg-gray-800 rounded-lg flex flex-col items-center justify-center text-white overflow-hidden">
          {/* Background simulation */}
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 opacity-75"></div>
          
          {/* Content */}
          <div className="relative z-10 text-center">
            <h1 className="text-lg font-medium mb-2">{heroData.dateText}</h1>
            <h2 className="text-2xl font-bold mb-4">{heroData.mainTitle}</h2>
            
            {/* Mini countdown preview */}
            <div className="flex gap-4 mb-4">
              <div className="text-center">
                <div className="text-xl font-bold">223</div>
                <div className="text-xs">päeva</div>
              </div>
              <div className="text-center">
                <div className="text-xl font-bold">22</div>
                <div className="text-xs">tundi</div>
              </div>
              <div className="text-center">
                <div className="text-xl font-bold">38</div>
                <div className="text-xs">minutid</div>
              </div>
              <div className="text-center">
                <div className="text-xl font-bold">56</div>
                <div className="text-xs">sekundit</div>
              </div>
            </div>

            {/* Bottom info bar preview */}
            <div className="bg-red-600 rounded-full px-4 py-1 text-xs flex justify-center gap-4">
              <span>📅 {heroData.eventDateInfo}</span>
              <span>📍 {heroData.location}</span>
              <span>👥 {heroData.audience}</span>
              <span>⏰ {heroData.duration}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Form */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Edit Content</h3>
        
        <div className="space-y-4">
          {/* Date Text */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Date Display Text
            </label>
            <input
              type="text"
              value={heroData.dateText}
              onChange={(e) => setHeroData({...heroData, dateText: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
              placeholder="17-20 APRILL 2025"
            />
          </div>

          {/* Main Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Main Title
            </label>
            <input
              type="text"
              value={heroData.mainTitle}
              onChange={(e) => setHeroData({...heroData, mainTitle: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
              placeholder="ÜLE-EESTILINE INSENERIVÕISTLUS"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroEditor;