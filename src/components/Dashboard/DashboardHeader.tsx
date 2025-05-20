import React from 'react';
import { Download, RefreshCw, Settings } from 'lucide-react';

interface DashboardHeaderProps {
  onExport: () => void;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({ onExport }) => {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Data Visualization Dashboard</h1>
        <p className="text-gray-500 mt-1">Automatically generated insights and analytics</p>
      </div>
      
      <div className="flex space-x-3 mt-4 sm:mt-0">
        <button 
          className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          onClick={onExport}
        >
          <Download className="h-4 w-4 mr-2" />
          Export
        </button>
        
        <button className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </button>
        
        <button className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
          <Settings className="h-4 w-4 mr-2" />
          Settings
        </button>
      </div>
    </div>
  );
};

export default DashboardHeader;