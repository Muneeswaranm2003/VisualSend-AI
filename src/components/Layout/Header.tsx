import React from 'react';
import { BarChart2, LineChart } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <header className="bg-white shadow-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <LineChart className="h-8 w-8 text-blue-600 mr-2" />
            <h1 className="text-xl font-bold text-gray-800">DataViz AI</h1>
          </div>
          
          <div className="flex items-center">
            <BarChart2 className="h-5 w-5 text-gray-600 mr-2" />
            <span className="text-sm font-medium text-gray-600">Auto-Analytics Dashboard</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;