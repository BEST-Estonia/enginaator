"use client"

import React, {useState} from 'react';
import { TbBackground } from 'react-icons/tb';

interface HeroEditorProps {
  setActiveSection: (section: string) => void;
}

const HeroEditor: React.FC<HeroEditorProps> = ({ setActiveSection }) => {

  const [heroData, setHeroData] = useState({
    dateText: "17-20 APRILL 2025",
    mainTitle: "ÜLE-EESTILINE INSENERIVÕISTLUS",
    eventDate: "April 17, 2026 00:00:00",
    backgroundImage: "/assets/hero-img.jpg", // <- static path
    eventDateInfo: "17-20. aprill 2026",
    location: "TalTech",
    audience: "Insenerihuvilistele noortele",
    duration: "4 päeva"
  })
  return (
    <div className='space-y-6'>
      {/*Header section*/}
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

      {/*Step 4: We'll add Live Preview Here*/}
      <div className='bg-white p-6 rounded-lg shadow-sm border border-gray-200'>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Live Preview</h3>
        
        {/*Mini Hero Preview */}
        <div className="relative h-64 bg-gray-800 rounded-lg flex flex-col items-center justify-center text-white overflow-hidden">
          {/*background simulation*/}
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 opacity-75"></div>

          {/*Content*/}
          <div className="relative z-10 text-center space-y-4">
            {/*Date text*/}
            <h1 className="text-lg font-medium">{heroData.dateText}</h1>

            {/*Main Title*/}
            <div className="text-2xl font-bold">{heroData.mainTitle}</div>

            {/*Mini Countdown Preview */}
            <div className="flex gap-4">
              <div className="text-center">
                <div className="text-xl font-bold">223</div>
                <div className="text-xs">PÄEVA</div>
              </div>
              <div className="text-center">
                <div className="text-xl font-bold">22</div>
                <div className="text-xs">TUNDI</div>
              </div>
              <div className="text-center">
                <div className="text-xl font-bold">38</div>
                <div className="text-xs">MINUTID</div>
              </div>
              <div className="text-center">
                <div className="text-xl font-bold">56</div>
                <div className="text-xs">SEKUNDIT</div>
              </div>
            </div>

            {/*Bottom info bar preview*/}
            <div className="bg-red-600 rounded-full px-4 py-2 text-xs flex justify-center gap-4">
              <span>{heroData.eventDateInfo}</span>
              <span>{heroData.location}</span>
              <span>{heroData.audience}</span>
              <span>{heroData.duration}</span>
            </div>
          </div>
        </div>

      </div>
        {/*Edit form*/}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Edit Content</h3>

          <div className="space-y-4">
            {/*Date Text Input*/}
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

            {/*Main Title Input*/}
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

            {/*Event Data Info Input*/}
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

            {/*Location Input*/}
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

            {/*TalTech Audience Input*/}
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

            {/* Duration Input */}
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

            {/*Background Image Upload */}
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-2'>
                Background Image
              </label>
              <div className="space-y-3">
                {/*Current Image Display*/}
                <div className="relative h-32 bg-gray-100 rounded-lg overflow-hidden">
                  <img
                    src={heroData.backgroundImage}
                    alt='Current background'
                    className='w-full h-full object-cover'
                    onError={(e) => {
                      e.currentTarget.src = 'https://via.placeholder.com/600x300/gray/white?text=No+Image';
                    }} 
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-25 flex items-center justify-center">
                    <span className="text-white text-sm font-medium">Current Background</span>
                  </div>
                </div>

                {/*File Upload */}
                <input 
                  type='file'
                  accept='image/*'
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      //Create preview URL
                      const imageUrl = URL.createObjectURL(file);
                      setHeroData({...heroData, backgroundImage: imageUrl})
                    }
                  }}
                  className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500'  
                />
                <p className="text-sm text-gray-500">Upload JPG, PNG, or WebP. Max size: 5MB</p>
              </div>
            </div>
          </div>

          {/*Save Button*/}
          <div className="mt-6 flex justify-between items-center">
            <div>
              {/*Success message will go here*/}
            </div>
            <button
              onClick={() => alert('Saving functionality will be added with backend!')}
              className='bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-lg font-medium transition-colors'
            >
              Save Changes
            </button>
          </div>
        </div>

      
    </div>
  );
};

export default HeroEditor;