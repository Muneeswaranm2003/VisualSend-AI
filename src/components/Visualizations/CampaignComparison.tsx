import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface CampaignComparisonProps {
  data: Array<{
    campaign: string;
    sent: number;
    opened: number;
    clicked: number;
    openRate: number;
    clickRate: number;
  }>;
}

const CampaignComparison: React.FC<CampaignComparisonProps> = ({ data }) => {
  // Format campaign names for display
  const formatCampaignName = (name: string): string => {
    if (name.length > 20) {
      return name.substring(0, 17) + '...';
    }
    return name;
  };
  
  // Prepare data for chart
  const chartData = data.map(campaign => ({
    name: formatCampaignName(campaign.campaign),
    'Open Rate': campaign.openRate,
    'Click Rate': campaign.clickRate,
    'Delivery Rate': 100 - (campaign.sent > 0 ? ((campaign.sent - campaign.opened - campaign.clicked) / campaign.sent) * 100 : 0)
  }));
  
  const customTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 shadow-sm rounded-md">
          <p className="font-medium text-gray-800">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={`item-${index}`} className="text-sm" style={{ color: entry.color }}>
              {entry.name}: <span className="font-medium">{entry.value.toFixed(1)}%</span>
            </p>
          ))}
        </div>
      );
    }
    return null;
  };
  
  return (
    <div className="h-72">
      {data.length > 0 ? (
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="name" tick={{ fontSize: 12 }} />
            <YAxis 
              tick={{ fontSize: 12 }} 
              label={{ value: 'Percentage (%)', angle: -90, position: 'insideLeft', style: { textAnchor: 'middle', fontSize: 12 } }} 
            />
            <Tooltip content={customTooltip} />
            <Legend />
            <Bar dataKey="Open Rate" fill="#8b5cf6" />
            <Bar dataKey="Click Rate" fill="#3b82f6" />
          </BarChart>
        </ResponsiveContainer>
      ) : (
        <div className="h-full flex items-center justify-center">
          <p className="text-gray-500 text-sm">No campaign comparison data available</p>
        </div>
      )}
    </div>
  );
};

export default CampaignComparison;