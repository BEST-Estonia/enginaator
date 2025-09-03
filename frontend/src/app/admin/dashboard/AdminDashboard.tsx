"use client"
import React, {useState} from 'react';
import { useRouter } from 'next/navigation';

const AdminDashboard = () => {
  const [activeSection, setActiveSection] = useState('dashboard');
  const router = useRouter();
  return (
    <div className='min-h-screen bg-gray-50 flex'>
      
      {/*Sidebar*/}
      <div className="w-64 bg-white shadow-lg">
        {/*Sidebar header*/}
        <div className="p-4 border-b border-gray-200 flex items-center space-x-2">
          <div className="w-8 h-8 bg-red-500 rounded flex items-center justify-center">
            <span className="text-white text-sm font-bold">🛡️</span>
          </div>
          <span className="font-semibold text-gray-800">Admin</span>
        </div>

        {/*Navigation menu */}
        <div className="p-4 space-y-6">
          {/*Dashboard section*/}
          <div>
            <h3 className="font-semibold text-gray-400 uppercase tracking-wider mb-2">
              Dashboard
            </h3>
            <button
              onClick={() => setActiveSection('dashboard')}
              className={`w-full flex items-center space-x-3 p-2 rounded-lg text-left transition-colors ${
                activeSection === 'dashboard' ? 'bg-red-50 text-red-600'
                : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <span className="font-medium">Dashboard</span>
            </button>
          </div>

          {/*Content Management Section*/}
          <div>
            <h3 className="font-semibold text-gray-400 uppercase tracking-wider mb-2">
              Content management
            </h3>
            <div className="space-y-1">
              <button
                onClick={() => setActiveSection('hero')}
                className={`w-full flex items-center space-x-3 p-2 rounded-lg text-left transition-colors ${
                  activeSection === 'hero' ? 'bg-red-50 text-red-600'
                  : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <span className="font-medium">Hero Section</span>
              </button>

              <button 
                onClick={() => setActiveSection('about')}
                className={`w-full flex items-center space-x-3 p-2 rounded-lg text-left transition-colors ${
                  activeSection === 'about' ? 'bg-red-50 text-red-600'
                  : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <span className="font-medium">About Section</span>
              </button>

              <button 
                onClick={() => setActiveSection('fields')}
                className={`w-full flex items-center space-x-3 p-2 rounded-lg text-left transition-colors ${
                  activeSection === 'fields' ? 'bg-red-50 text-red-600'
                  : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <span className="font-medium">Fields Management</span>
              </button>

              <button 
                onClick={() => setActiveSection('events')}
                className={`w-full flex items-center space-x-3 p-2 rounded-lg text-left transition-colors ${
                  activeSection === 'events' ? 'bg-red-50 text-red-600'
                  : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <span className="font-medium">Event Information</span>
              </button>
            </div>

            {/*Content section*/}
            <div>
              <h3 className="font-semibold text-gray-400 uppercase tracking-wider mb-2 mt-6">
                Contents
              </h3>
              <div className="space-y-1">
                <button 
                  onClick={() => setActiveSection('team')}
                  className={`w-full flex items-center space-x-3 p-2 rounded-lg text-left transition-colors ${
                    activeSection === 'team' ? 'bg-red-50 text-red-600'
                    : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <span className="font-medium">Team Members</span>
                </button>

                <button 
                  onClick={() => setActiveSection('sponsors')}
                  className={`w-full flex items-center space-x-3 p-2 rounded-lg text-left transition-colors ${
                    activeSection === 'sponsors' ? 'bg-red-50 text-red-600'
                    : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <span className="font-medium">Sponsors</span>
                </button>

                <button 
                  onClick={() => setActiveSection('faq')}
                  className={`w-full flex items-center space-x-3 p-2 rounded-lg text-left transition-colors ${
                    activeSection === 'faq' ? 'bg-red-50 text-red-600'
                    : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <span className="font-medium">FAQ Management</span>
                </button>

                <button 
                  onClick={() => setActiveSection('gallery')}
                  className={`w-full flex items-center space-x-3 p-2 rounded-lg text-left transition-colors ${
                    activeSection === 'gallery' ? 'bg-red-50 text-red-600'
                    : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <span className="font-medium">Gallery</span>
                </button>
              </div>
            </div>

            {/*Registration Section*/}
            <div>
              <h3 className="font-semibold text-gray-400 uppercase tracking-wider mb-2 mt-6">
                Registrations
              </h3>
              <button 
                onClick={() => setActiveSection('registrations')}
                className={`w-full flex items-center space-x-3 p-2 rounded-lg text-left transition-colors ${
                  activeSection === 'registrations' ? 'bg-red-50 text-red-600'
                  : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <span className="font-medium">Team Registrations</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/*Main Content */}
      <div className="flex-1">
        <p className="p-4">Main Content</p>
      </div>

      

    </div>
  )
}

export default AdminDashboard;
