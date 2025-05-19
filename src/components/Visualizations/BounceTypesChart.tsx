import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

interface BounceTypesChartProps {
  softBounces: number;
  hardBounces: number;
}

const BounceTypesChart: React.FC<BounceTypesChartProps> = ({ softBounces, hardBounces }) => {
  const totalBounces = softBounces + hardBounces;
  
  const data = [
    { name: 'Soft Bounces', value: softBounces, description: 'Temporary delivery issues (e.g., full mailbox)' },
    { name: 'Hard Bounces', value: hardBounces, description: 'Permanent delivery failures (e.g., invalid address)' }
  ];
  
  const COLORS = ['#fbbf24', '#ef4444'];
  
  const customTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const percentage = ((payload[0].value / totalBounces) * 100).toFixed(1);
      
      return (
        <div className="bg-white p-3 border border-gray-200 shadow-sm rounded-md">
          <p className="font-medium text-gray-800">{payload[0].name}</p>
          <p className="text-sm text-gray-600">
            Count: <span className="font-medium">{payload[0].value}</span>
          </p>
          <p className="text-sm text-gray-600">
            Percentage: <span className="font-medium">{percentage}%</span>
          </p>
          <p className="text-xs text-gray-500 mt-1">{payload[0].payload.description}</p>
        </div>
      );
    }
    return null;
  };
  
  const renderLegend = (props: any) => {
    const { payload } = props;
    
    return (
      <div className="flex justify-center mt-2">
        {payload.map((entry: any, index: number) => (
          <div key={`item-${index}`} className="flex items-center mx-2">
            <div 
              className="w-3 h-3 rounded-full mr-1" 
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-xs text-gray-600">{entry.value}</span>
          </div>
        ))}
      </div>
    );
  };
  
  return (
    <div className="h-60">
      {totalBounces > 0 ? (
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={40}
              outerRadius={80}
              paddingAngle={2}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip content={customTooltip} />
            <Legend content={renderLegend} />
          </PieChart>
        </ResponsiveContainer>
      ) : (
        <div className="h-full flex items-center justify-center">
          <p className="text-gray-500 text-sm">No bounce data available</p>
        </div>
      )}
    </div>
  );
};

export default BounceTypesChart;