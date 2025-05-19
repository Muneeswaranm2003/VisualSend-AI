import React from 'react';
import { useData } from '../../context/DataContext';
import { ColumnMapping } from '../../types';
import { Check } from 'lucide-react';

interface ColumnMapperProps {
  headers: string[];
}

const ColumnMapper: React.FC<ColumnMapperProps> = ({ headers }) => {
  const { columnMapping, setColumnMapping } = useData();
  
  const handleColumnSelect = (field: keyof ColumnMapping, header: string) => {
    setColumnMapping({
      ...columnMapping,
      [field]: header
    });
  };
  
  const requiredFields = [
    { key: 'emailAddress', label: 'Email Address' },
    { key: 'status', label: 'Status' },
    { key: 'campaignName', label: 'Campaign Name' },
    { key: 'timestamp', label: 'Sent Time' }
  ];
  
  const optionalFields = [
    { key: 'openTime', label: 'Open Time' },
    { key: 'clickTime', label: 'Click Time' },
    { key: 'bounceType', label: 'Bounce Type' },
    { key: 'location', label: 'Location' },
    { key: 'device', label: 'Device' },
    { key: 'subject', label: 'Subject' }
  ];
  
  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h4 className="text-md font-medium text-gray-700">Required Fields</h4>
        {requiredFields.map(({ key, label }) => (
          <div key={key} className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
            <div className="relative">
              <select
                value={columnMapping[key as keyof ColumnMapping] || ''}
                onChange={(e) => handleColumnSelect(key as keyof ColumnMapping, e.target.value)}
                className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
              >
                <option value="">-- Select column --</option>
                {headers.map((header) => (
                  <option key={header} value={header}>{header}</option>
                ))}
              </select>
              {columnMapping[key as keyof ColumnMapping] && (
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <Check className="h-4 w-4 text-green-500" />
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
      
      <div className="space-y-4">
        <h4 className="text-md font-medium text-gray-700">Optional Fields</h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {optionalFields.map(({ key, label }) => (
            <div key={key} className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
              <div className="relative">
                <select
                  value={columnMapping[key as keyof ColumnMapping] || ''}
                  onChange={(e) => handleColumnSelect(key as keyof ColumnMapping, e.target.value)}
                  className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                >
                  <option value="">-- Select column --</option>
                  {headers.map((header) => (
                    <option key={header} value={header}>{header}</option>
                  ))}
                </select>
                {columnMapping[key as keyof ColumnMapping] && (
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <Check className="h-4 w-4 text-green-500" />
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <div className="bg-blue-50 p-3 rounded-md border border-blue-100">
        <p className="text-sm text-blue-700">
          <span className="font-medium">Tip:</span> We've automatically detected the most likely columns, but please review and correct if needed.
        </p>
      </div>
    </div>
  );
};

export default ColumnMapper;