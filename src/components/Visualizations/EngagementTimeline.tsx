import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface EngagementTimelineProps {
  data: Array<{date: string; opens: number; clicks: number}>;
}

const EngagementTimeline: React.FC<EngagementTimelineProps> = ({ data }) => {
  const formatDate = (dateStr: string) => {
    if (dateStr === 'Unknown') return dateStr;
    
    const date = new Date(dateStr);
    return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
  };
  
  const customTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 shadow-sm rounded-md">
          <p className="font-medium text-gray-800">{formatDate(label)}</p>
          <p className="text-sm text-purple-500">
            Opens: <span className="font-medium">{payload[0].value}</span>
          </p>
          <p className="text-sm text-blue-500">
            Clicks: <span className="font-medium">{payload[1].value}</span>
          </p>
        </div>
      );
    }
    return null;
  };
  
  return (
    <div className="h-72">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={data}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis 
            dataKey="date" 
            tickFormatter={formatDate}
            tick={{ fontSize: 12 }}
          />
          <YAxis tick={{ fontSize: 12 }} />
          <Tooltip content={customTooltip} />
          <Legend />
          <Line 
            type="monotone" 
            dataKey="opens" 
            stroke="#8b5cf6" 
            strokeWidth={2} 
            activeDot={{ r: 6 }} 
            name="Opens"
          />
          <Line 
            type="monotone" 
            dataKey="clicks" 
            stroke="#3b82f6" 
            strokeWidth={2} 
            activeDot={{ r: 6 }} 
            name="Clicks"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default EngagementTimeline;