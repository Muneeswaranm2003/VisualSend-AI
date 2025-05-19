import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { Filter, ChevronDown, ChevronUp } from 'lucide-react';

const DashboardFilters: React.FC = () => {
  const { processedData, filterState, updateFilter } = useData();
  const [isExpanded, setIsExpanded] = useState(false);
  
  // Extract unique campaign names
  const campaigns = processedData 
    ? [...new Set(processedData.rawData.map(item => item.campaignName).filter(Boolean))]
    : [];
  
  // Extract unique email providers
  const providers = processedData
    ? [...new Set(processedData.rawData
        .map(item => item.emailAddress?.split('@')[1]?.split('.')[0])
        .filter(Boolean))]
    : [];
  
  const handleCampaignChange = (campaign: string) => {
    const newCampaigns = filterState.selectedCampaigns.includes(campaign)
      ? filterState.selectedCampaigns.filter(c => c !== campaign)
      : [...filterState.selectedCampaigns, campaign];
    
    updateFilter({ selectedCampaigns: newCampaigns });
  };
  
  const handleProviderChange = (provider: string) => {
    const newProviders = filterState.selectedProviders.includes(provider)
      ? filterState.selectedProviders.filter(p => p !== provider)
      : [...filterState.selectedProviders, provider];
    
    updateFilter({ selectedProviders: newProviders });
  };
  
  const handleDateChange = (index: number, date: string) => {
    const newDateRange = [...filterState.dateRange];
    newDateRange[index] = date ? new Date(date) : null;
    updateFilter({ dateRange: newDateRange as [Date | null, Date | null] });
  };
  
  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };
  
  return (
    <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center">
          <Filter className="h-5 w-5 text-gray-500 mr-2" />
          <h3 className="text-lg font-medium text-gray-800">Filters</h3>
        </div>
        <button 
          onClick={toggleExpand}
          className="text-gray-500 hover:text-gray-700 focus:outline-none"
        >
          {isExpanded ? (
            <ChevronUp className="h-5 w-5" />
          ) : (
            <ChevronDown className="h-5 w-5" />
          )}
        </button>
      </div>
      
      {isExpanded && (
        <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Campaign Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Campaign
            </label>
            <div className="max-h-32 overflow-y-auto border border-gray-300 rounded-md p-2">
              {campaigns.length > 0 ? (
                campaigns.map(campaign => (
                  <div key={campaign} className="flex items-center mb-1">
                    <input
                      type="checkbox"
                      id={`campaign-${campaign}`}
                      checked={filterState.selectedCampaigns.includes(campaign)}
                      onChange={() => handleCampaignChange(campaign)}
                      className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                    />
                    <label
                      htmlFor={`campaign-${campaign}`}
                      className="ml-2 text-sm text-gray-700 truncate"
                    >
                      {campaign}
                    </label>
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-500">No campaigns available</p>
              )}
            </div>
          </div>
          
          {/* Date Range Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Date Range
            </label>
            <div className="space-y-2">
              <div>
                <label className="block text-xs text-gray-500 mb-1">From</label>
                <input
                  type="date"
                  value={filterState.dateRange[0] ? filterState.dateRange[0].toISOString().substr(0, 10) : ''}
                  onChange={(e) => handleDateChange(0, e.target.value)}
                  className="block w-full border border-gray-300 rounded-md shadow-sm py-1.5 px-3 text-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">To</label>
                <input
                  type="date"
                  value={filterState.dateRange[1] ? filterState.dateRange[1].toISOString().substr(0, 10) : ''}
                  onChange={(e) => handleDateChange(1, e.target.value)}
                  className="block w-full border border-gray-300 rounded-md shadow-sm py-1.5 px-3 text-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
          </div>
          
          {/* Email Provider Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email Provider
            </label>
            <div className="max-h-32 overflow-y-auto border border-gray-300 rounded-md p-2">
              {providers.length > 0 ? (
                providers.map(provider => (
                  <div key={provider} className="flex items-center mb-1">
                    <input
                      type="checkbox"
                      id={`provider-${provider}`}
                      checked={filterState.selectedProviders.includes(provider)}
                      onChange={() => handleProviderChange(provider)}
                      className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                    />
                    <label
                      htmlFor={`provider-${provider}`}
                      className="ml-2 text-sm text-gray-700 truncate"
                    >
                      {provider}
                    </label>
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-500">No providers available</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardFilters;