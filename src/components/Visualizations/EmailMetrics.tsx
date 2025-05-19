import React from 'react';
import { ProcessedData } from '../../types';
import { Mail, CheckCircle, Eye, MousePointer, AlertTriangle } from 'lucide-react';

interface EmailMetricsProps {
  data: ProcessedData;
}

const EmailMetrics: React.FC<EmailMetricsProps> = ({ data }) => {
  const { totalSent, totalDelivered, totalOpened, totalClicked, openRate, clickRate, bounceRate } = data;
  
  const metrics = [
    {
      title: 'Total Sent',
      value: totalSent.toLocaleString(),
      icon: <Mail className="h-8 w-8 text-blue-400" />,
      color: 'bg-blue-50',
      iconColor: 'text-blue-400'
    },
    {
      title: 'Delivered',
      value: totalDelivered.toLocaleString(),
      icon: <CheckCircle className="h-8 w-8 text-green-400" />,
      color: 'bg-green-50',
      iconColor: 'text-green-400'
    },
    {
      title: 'Opened',
      value: totalOpened.toLocaleString(),
      icon: <Eye className="h-8 w-8 text-purple-400" />,
      color: 'bg-purple-50',
      iconColor: 'text-purple-400'
    },
    {
      title: 'Clicked',
      value: totalClicked.toLocaleString(),
      icon: <MousePointer className="h-8 w-8 text-indigo-400" />,
      color: 'bg-indigo-50',
      iconColor: 'text-indigo-400'
    },
    {
      title: 'Bounce Rate',
      value: `${bounceRate.toFixed(1)}%`,
      icon: <AlertTriangle className="h-8 w-8 text-amber-400" />,
      color: 'bg-amber-50',
      iconColor: 'text-amber-400'
    }
  ];
  
  return (
    <div>
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Email Campaign Metrics</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {metrics.map((metric, index) => (
          <div 
            key={index}
            className={`${metric.color} rounded-lg p-4 flex items-center transition-transform duration-200 hover:scale-102 cursor-default`}
          >
            <div className="mr-4">{metric.icon}</div>
            <div>
              <p className="text-sm font-medium text-gray-500">{metric.title}</p>
              <p className="text-xl font-bold text-gray-800">{metric.value}</p>
            </div>
          </div>
        ))}
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
        <div className="relative pt-1">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-semibold inline-block text-blue-600">
                Open Rate
              </span>
            </div>
            <div className="text-right">
              <span className="text-xs font-semibold inline-block text-blue-600">
                {openRate.toFixed(1)}%
              </span>
            </div>
          </div>
          <div className="overflow-hidden h-2 mb-1 text-xs flex rounded bg-blue-200">
            <div style={{ width: `${openRate}%` }} className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-500 transition-all duration-500"></div>
          </div>
        </div>
        
        <div className="relative pt-1">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-semibold inline-block text-purple-600">
                Click-through Rate
              </span>
            </div>
            <div className="text-right">
              <span className="text-xs font-semibold inline-block text-purple-600">
                {clickRate.toFixed(1)}%
              </span>
            </div>
          </div>
          <div className="overflow-hidden h-2 mb-1 text-xs flex rounded bg-purple-200">
            <div style={{ width: `${clickRate}%` }} className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-purple-500 transition-all duration-500"></div>
          </div>
        </div>
        
        <div className="relative pt-1">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-semibold inline-block text-amber-600">
                Bounce Rate
              </span>
            </div>
            <div className="text-right">
              <span className="text-xs font-semibold inline-block text-amber-600">
                {bounceRate.toFixed(1)}%
              </span>
            </div>
          </div>
          <div className="overflow-hidden h-2 mb-1 text-xs flex rounded bg-amber-200">
            <div style={{ width: `${bounceRate}%` }} className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-amber-500 transition-all duration-500"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmailMetrics;