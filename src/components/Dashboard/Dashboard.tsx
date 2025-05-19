import React from 'react';
import { useData } from '../../context/DataContext';
import DashboardHeader from './DashboardHeader';
import DashboardFilters from './DashboardFilters';
import EmailMetrics from '../Visualizations/EmailMetrics';
import RatesChart from '../Visualizations/RatesChart';
import EngagementTimeline from '../Visualizations/EngagementTimeline';
import BounceTypesChart from '../Visualizations/BounceTypesChart';
import GeographyMap from '../Visualizations/GeographyMap';
import TimeHeatmap from '../Visualizations/TimeHeatmap';
import CampaignComparison from '../Visualizations/CampaignComparison';
import InsightsPanel from '../Insights/InsightsPanel';
import { exportDashboardAsPdf } from '../../utils/exportUtils';

const Dashboard: React.FC = () => {
  const { processedData, hasData } = useData();

  const handleExportDashboard = () => {
    exportDashboardAsPdf('email-campaign-dashboard');
  };

  if (!hasData || !processedData) {
    return null;
  }

  return (
    <div id="email-dashboard" className="p-4 md:p-6 w-full">
      <DashboardHeader onExport={handleExportDashboard} />
      <DashboardFilters />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
        {/* Email Metrics */}
        <div className="visualization-card lg:col-span-3 bg-white rounded-lg shadow-sm p-4 overflow-hidden">
          <EmailMetrics data={processedData} />
        </div>
        
        {/* Engagement Timeline */}
        <div className="visualization-card lg:col-span-2 bg-white rounded-lg shadow-sm p-4 overflow-hidden">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Engagement Over Time</h3>
          <EngagementTimeline data={processedData.engagementOverTime} />
        </div>
        
        {/* Rates Chart */}
        <div className="visualization-card bg-white rounded-lg shadow-sm p-4 overflow-hidden">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Email Performance Rates</h3>
          <RatesChart 
            openRate={processedData.openRate} 
            clickRate={processedData.clickRate} 
            bounceRate={processedData.bounceRate} 
          />
        </div>
        
        {/* Bounce Types */}
        <div className="visualization-card bg-white rounded-lg shadow-sm p-4 overflow-hidden">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Bounce Types</h3>
          <BounceTypesChart 
            softBounces={processedData.softBounces} 
            hardBounces={processedData.hardBounces} 
          />
        </div>
        
        {/* Time Heatmap */}
        <div className="visualization-card bg-white rounded-lg shadow-sm p-4 overflow-hidden">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Opens by Hour</h3>
          <TimeHeatmap data={processedData.opensByHour} />
        </div>
        
        {/* Location Map */}
        <div className="visualization-card bg-white rounded-lg shadow-sm p-4 overflow-hidden">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Geographic Distribution</h3>
          <GeographyMap data={processedData.locationData} />
        </div>
        
        {/* Campaign Comparison */}
        <div className="visualization-card lg:col-span-3 bg-white rounded-lg shadow-sm p-4 overflow-hidden">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Campaign Comparison</h3>
          <CampaignComparison data={processedData.campaignComparison} />
        </div>
        
        {/* Insights Panel */}
        <div className="visualization-card lg:col-span-3 bg-white rounded-lg shadow-sm p-4 overflow-hidden">
          <InsightsPanel />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;