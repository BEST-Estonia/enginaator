import React from 'react';
import { IoPeopleSharp } from "react-icons/io5";
import { FaEdit } from "react-icons/fa";
import { TbMoneybag } from "react-icons/tb";
import { IoImages } from "react-icons/io5";
import { BsFillLightningChargeFill } from "react-icons/bs";
import { IoStatsChartSharp } from "react-icons/io5";






interface QuickActionSectionProps {
  setActiveSection: (section: string) => void;
}

const QuickActionSection: React.FC<QuickActionSectionProps> = ({ setActiveSection }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mt-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">

        {/* Manage Registrations Card */}
        <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
          <div className="flex items-center space-x-3 mb-3">
              <div className="w-8 h-8 bg-red-500 rounded flex items-center justify-center">
                  <span className="text-white text-sm">
                      <IoPeopleSharp />
                  </span>
              </div>
              <h3 className="font-semibold text-gray-900">Manage Registrations</h3>
          </div>
          <p className="text-sm text-gray-600 mb-4">View and manage team registrations</p>
          <button 
              onClick={() => setActiveSection('registrations')}
              className="w-full bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-4 rounded-lg transition-colors">
                  Open
              </button>
        </div>

        {/*Update Hero Part*/}
        <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
            <div className="flex items-center space-x-3 mb-3">
                <div className="w-8 h-8 bg-blue-500 rounded flex items-center justify-center">
                    <span className="text-white text-sm">
                        <FaEdit />
                    </span>
                </div>
                <h3 className="font-semibold text-gray-900">Update Hero Section</h3>
            </div>
            <p className="text-sm text-gray-600 mb-4">Edit website content and sections</p>
            <button 
                onClick={() => setActiveSection('hero')}
                className="w-full bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-4 rounded-lg transition-colors">
                    Open
                </button>
        </div>

        {/*Manage Sponsors*/}
        <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
            <div className="flex items-center space-x-3 mb-3">
                <div className="w-8 h-8 bg-green-500 rounded flex items-center justify-center">
                    <span className="text-white text-sm">
                        <TbMoneybag />
                    </span>
                </div>
                <h3 className="font-semibold text-gray-900">Manage Sponsors</h3>
            </div>
            <p className="text-sm text-gray-600 mb-4">Add and edit sponsor information</p>
            <button
                onClick={() => setActiveSection('sponsors')}
                className="w-full bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-4 rounded-lg transition-colors">
                    Open
                </button>
        </div>

        {/*Update Gallery*/}
        <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
            <div className="flex items-center space-x-3 mb-3">
                <div className="w-8 h-8 bg-purple-500 rounded flex items-center justify-center">
                    <span className="text-white text-sm">
                        <IoImages />
                    </span>
                </div>
                <h3 className="font-semibold text-gray-900">Update Gallery</h3>
            </div>
            <p className="text-sm text-gray-600 mb-4">Upload and organize event photos</p>
            <button
                onClick={() => setActiveSection('gallery')} 
                className="w-full bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-4 rounded-lg transition-colors">
                    Open
                </button>
        </div>
      </div>

      {/*Recent activity section */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mt-6">
        <div className="flex items-center space-x-2 mb-4">
            <span className="text-xl">
                <BsFillLightningChargeFill />
            </span>
            <h2 className="text-xl font-semibold text-gray-900">Recent Activity</h2>
        </div>
        <p className="text-gray-600 mb-4">Latest updates and changes to your website</p>

        <div className="space-y-3">
            <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <span className="text-green-600 text-sm">
                        <IoStatsChartSharp />
                    </span>
                </div>
                <div className="flex-1">
                    <p className="font-medium text-gray-900">Website Statistics</p>
                    <p className="text-sm text-gray-600">Dashboard loaded successfully with current statistics</p>
                </div>
                <span className="text-sm text-gray-500">Just now</span>
            </div>
        </div>
      </div>
    </div>
  );
};

export default QuickActionSection;

