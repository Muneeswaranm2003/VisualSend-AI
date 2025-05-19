import React from 'react';
import { ResponsiveContainer, ScatterChart, Scatter, XAxis, YAxis, ZAxis, Tooltip } from 'recharts';

interface TimeHeatmapProps {
  data: Array<{hour: number; count: number}>;
}

const TimeHeatmap: React.FC<TimeHeatmapProps> = ({ data }) => {
  // Transform data for the heatmap
  const heatmapData = data.map(({ hour, count }) => ({
    x: hour,
    y: 0, // We're only showing one row
    z: count, // z determines the size/color
  }));
  
  // Format hour for display
  const formatHour = (hour: number) => {
    const h = hour % 12 || 12;
    const ampm = hour < 12 ? 'AM' : 'PM';
    return `${h}${ampm}`;
  };
  
  const customTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const hour = payload[0].payload.x;
      const count = payload[0].payload.z;
      
      return (
        <div className="bg-white p-2 border border-gray-200 shadow-sm rounded-md">
          <p className="font-medium text-gray-800">{formatHour(hour)}</p>
          <p className="text-sm text-gray-600">
            Opens: <span className="font-medium">{count}</span>
          </p>
        </div>
      );
    }
    return null;
  };
  
  return (
    <div className="h-60">
      <ResponsiveContainer width="100%" height="100%">
        <ScatterChart
          margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
        >
          <XAxis
            type="number"
            dataKey="x"
            name="Hour"
            domain={[0, 23]}
            tickCount={8}
            tickFormatter={formatHour}
            tick={{ fontSize: 12 }}
          />
          <YAxis
            type="number"
            dataKey="y"
            height={10}
            width={80}
            tick={false}
            tickLine={false}
            axisLine={false}
          />
          <ZAxis
            type="number"
            dataKey="z"
            range={[10, 50]}
            domain={['auto', 'auto']}
          />
          <Tooltip cursor={{ strokeDasharray: '3 3' }} content={customTooltip} />
          <Scatter
            data={heatmapData}
            fill="#8b5cf6"
            shape="circle"
            fillOpacity={0.6}
          />
        </ScatterChart>
      </ResponsiveContainer>
    </div>
  );
};

export default TimeHeatmap;