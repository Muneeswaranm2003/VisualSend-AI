import React from 'react';
import { useData } from '../../context/DataContext';
import { LightbulbIcon, TrendingUpIcon, TrendingDownIcon, HelpCircleIcon } from 'lucide-react';

const InsightsPanel: React.FC = () => {
  const { insights } = useData();
  
  const getIcon = (type: string) => {
    switch (type) {
      case 'positive':
        return <TrendingUpIcon className="h-5 w-5 text-green-500" />;
      case 'negative':
        return <TrendingDownIcon className="h-5 w-5 text-red-500" />;
      case 'suggestion':
        return <LightbulbIcon className="h-5 w-5 text-amber-500" />;
      default:
        return <HelpCircleIcon className="h-5 w-5 text-blue-500" />;
    }
  };
  
  const getColor = (type: string) => {
    switch (type) {
      case 'positive':
        return 'bg-green-50 border-green-100';
      case 'negative':
        return 'bg-red-50 border-red-100';
      case 'suggestion':
        return 'bg-amber-50 border-amber-100';
      default:
        return 'bg-blue-50 border-blue-100';
    }
  };
  
  return (
    <div>
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Smart Insights</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {insights.map((insight) => (
          <div 
            key={insight.id}
            className={`rounded-lg p-4 border ${getColor(insight.type)}`}
          >
            <div className="flex items-center mb-2">
              {getIcon(insight.type)}
              <h4 className="text-md font-medium text-gray-800 ml-2">{insight.title}</h4>
            </div>
            <p className="text-sm text-gray-600">{insight.description}</p>
            {insight.metric && (
              <div className="mt-2 flex items-center">
                <span className="text-xs text-gray-500">{insight.metric}:</span>
                <span className="text-sm font-medium ml-1">{insight.value}</span>
              </div>
            )}
          </div>
        ))}
      </div>
      
      <div className="mt-6 bg-gray-50 p-4 rounded-lg border border-gray-200">
        <div className="flex items-center">
          <LightbulbIcon className="h-5 w-5 text-blue-500 mr-2" />
          <h4 className="text-md font-medium text-gray-800">Further Analysis</h4>
        </div>
        <p className="text-sm text-gray-600 mt-2">
          The dashboard automatically identifies patterns and suggests optimizations. For deeper insights, try uploading more campaign data or adding subscriber segments.
        </p>
      </div>
    </div>
  );
};

export default InsightsPanel;