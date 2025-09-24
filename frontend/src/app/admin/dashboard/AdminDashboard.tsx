"use client"
import React, {useState, useEffect} from 'react';
import { useRouter } from 'next/navigation';
import { FaPeopleGroup } from "react-icons/fa6";
import { FaPerson } from "react-icons/fa6";
import { FaHandshake } from "react-icons/fa6";
import QuickActionSection from './QuickActionSection';
import HeroEditor from './HeroEditor';
import SponsorEditor from './SponsorEditor';  // Add this import
import MainSponsorEditor from './MainSponsorEditor'; // Add this import
import engikaLogo from '@/assets/enginaatorLogo.png';
import Image from 'next/image';
import { IoMdImages } from "react-icons/io";
import { fetchSponsors } from '@/services/sponsorService';  // Add this import
import IntroductionEditor from './IntroductionEditor';
import GalleryEditor from './GalleryEditor';
import AboutEditor from './AboutEditor';



const AdminDashboard = () => {
  const [activeSection, setActiveSection] = useState('dashboard');
  const router = useRouter();

  const [stats, setStats] = useState({
    totalregistrations: 0,
    totalTeams: 0,
    activeSponsors: 0,
    galleryImages: 0
  });

  // Fetch stats when dashboard is loaded
  useEffect(() => {
    const loadStats = async () => {
      // Example: Fetch sponsor count
      try {
        const sponsors = await fetchSponsors();
        setStats(prev => ({
          ...prev,
          activeSponsors: sponsors.length
        }));
      } catch (error) {
        console.error("Error fetching stats:", error);
      }
    };

    if (activeSection === 'dashboard') {
      loadStats();
    }
  }, [activeSection]);

  return (
    <div className='min-h-screen bg-gray-50 flex'>
      
      {/*Sidebar*/}
      <div className="w-64 bg-white shadow-lg">
        {/*Sidebar header*/}
        <div className="p-4 border-b border-gray-200 flex items-center space-x-2">
          <div className="w-8 h-8 bg-red-500 rounded flex items-center justify-center">
            <span className="text-white text-sm font-bold">
              <Image src={engikaLogo} alt='Enginaator Logo'/>
            </span>
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

                {/* Main Sponsors button */}
                <button 
                  onClick={() => setActiveSection('mainSponsors')}
                  className={`w-full flex items-center space-x-3 p-2 rounded-lg text-left transition-colors ${
                    activeSection === 'mainSponsors' ? 'bg-red-50 text-red-600'
                    : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <span className="font-medium">Main Sponsors</span>
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
        <header className='bg-white shadow-sm border-b border-gray-200 p-6'>
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Welcome back, Admin!</h1>
              <p className="text-gray-600">Here's what's happening with your Enginaator website today.</p>
            </div>
            <div className="flex items-center space-x-4">
              <span className='text-sm text-gray-500 mt-6'>Last updated: Just now</span>
              <button
                onClick={() => {
                  localStorage.removeItem('adminAuth');
                  router.push('/admin/login');
                }} 
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors">Sign Out</button>
            </div>
          </div>
        </header>

        {/*Dashboard content*/}
        <main className="p-6">
          {activeSection === 'dashboard' && (
            <div className="space-y-6">
              {/*Stats Cards*/}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Total Registrations</p>
                      <p className="text-3xl font-bold text-gray-900">{stats.totalregistrations}</p>
                      <p className="text-sm text-gray-500">Team registrations received</p>
                    </div>
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <span className="text-blue-600 text-xl"><FaPerson /></span>
                  </div>
                  </div>
                </div>


                {/*All teams registered section*/}
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Teams</p>
                    <p className="text-3xl font-bold text-gray-900">{stats.totalTeams}</p>
                    <p className="text-sm text-gray-500">Current teams</p>
                  </div>
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <span className="text-green-600 text-xl"><FaPeopleGroup /></span>
                  </div>
                </div>
              </div>

              {/*Active sponsors section*/}
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Active Sponsors</p>
                    <p className="text-3xl font-bold text-gray-900">{stats.activeSponsors}</p>
                    <p className="text-sm text-gray-500">Current event Sponsors</p>
                  </div>
                  <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                    <span className="text-yellow-600 text-xl"><FaHandshake /></span>
                  </div>
                </div>
              </div>

              {/*Gallery Images section*/}
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Gallery Images</p>
                    <p className="text-3xl font-bold text-gray-900">{stats.galleryImages}</p>
                    <p className="text-sm text-gray-500">Photos in gallery</p>
                  </div>
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                    <span className="text-purple-600 text-xl">
                      <IoMdImages />
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions Section */}
            <QuickActionSection setActiveSection={setActiveSection} />
            </div>
            )}

            {/* Hero Section Editor */}
            {activeSection === 'hero' && (
              <HeroEditor setActiveSection={setActiveSection} />
            )}

            {/* Sponsor Section Editor */}
            {activeSection === 'sponsors' && (
              <SponsorEditor setActiveSection={setActiveSection} />
            )}

            {/* Main Sponsor Section Editor */}
            {activeSection === 'mainSponsors' && (
              <MainSponsorEditor setActiveSection={setActiveSection} />
            )}

            {/* Introduction/About Section Editor */}
            {activeSection === 'about' && (
              <IntroductionEditor setActiveSection={setActiveSection} />
            )}

            {/* Gallery Section Editor */}
            {activeSection === 'gallery' && (
              <GalleryEditor setActiveSection={setActiveSection} />
            )}

            {/* About Section Editor */}
            {activeSection === 'events' && (
              <AboutEditor setActiveSection={setActiveSection} />
            )}
          </main>
        </div>
      </div>
  )
}

export default AdminDashboard;
