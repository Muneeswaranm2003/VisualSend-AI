import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

interface RatesChartProps {
  openRate: number;
  clickRate: number;
  bounceRate: number;
}

const RatesChart: React.FC<RatesChartProps> = ({ openRate, clickRate, bounceRate }) => {
  // Calculate the remaining percentage for unopened but delivered emails
  const unopenedRate = 100 - openRate - bounceRate;
  
  // Calculate unclicked but opened rate
  const openedNotClickedRate = openRate - clickRate;
  
  const deliveryData = [
    { name: 'Delivered', value: 100 - bounceRate },
    { name: 'Bounced', value: bounceRate }
  ];
  
  const engagementData = [
    { name: 'Clicked', value: clickRate },
    { name: 'Opened (no click)', value: openedNotClickedRate },
    { name: 'Unopened', value: unopenedRate }
  ];
  
  const DELIVERY_COLORS = ['#4ade80', '#f87171'];
  const ENGAGEMENT_COLORS = ['#8b5cf6', '#93c5fd', '#e5e7eb'];
  
  const customTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-2 border border-gray-200 shadow-sm rounded-md">
          <p className="text-sm font-medium">{`${payload[0].name}: ${payload[0].value.toFixed(1)}%`}</p>
        </div>
      );
    }
    return null;
  };
  
  return (
    <div className="h-80">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-full">
        <div>
          <p className="text-sm font-medium text-gray-600 text-center mb-2">Delivery Status</p>
          <ResponsiveContainer width="100%" height="90%">
            <PieChart>
              <Pie
                data={deliveryData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                fill="#8884d8"
                paddingAngle={2}
                dataKey="value"
                label={({ name, value }) => `${name}: ${value.toFixed(1)}%`}
                labelLine={false}
              >
                {deliveryData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={DELIVERY_COLORS[index % DELIVERY_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip content={customTooltip} />
            </PieChart>
          </ResponsiveContainer>
        </div>
        
        <div>
          <p className="text-sm font-medium text-gray-600 text-center mb-2">Engagement Breakdown</p>
          <ResponsiveContainer width="100%" height="90%">
            <PieChart>
              <Pie
                data={engagementData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                fill="#8884d8"
                paddingAngle={2}
                dataKey="value"
                label={({ name, value }) => `${name}: ${value.toFixed(1)}%`}
                labelLine={false}
              >
                {engagementData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={ENGAGEMENT_COLORS[index % ENGAGEMENT_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip content={customTooltip} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default RatesChart;