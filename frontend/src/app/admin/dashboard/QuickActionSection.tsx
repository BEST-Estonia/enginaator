import React from 'react';
import { IoPeopleSharp } from "react-icons/io5";


interface QuickActionSectionProps {
  setActiveSection: (section: string) => void;
}

const QuickActionSection: React.FC<QuickActionSectionProps> = ({ setActiveSection }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mt-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
      {/* Grid container will go here */}
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
      </div>
    </div>
  );
};

export default QuickActionSection;

