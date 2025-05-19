import React, { createContext, useState, useContext, ReactNode } from 'react';
import { EmailData, ProcessedData, ColumnMapping, FilterState, Insight } from '../types';
import { processEmailData } from '../utils/dataProcessing';

interface DataContextType {
  rawData: EmailData[];
  processedData: ProcessedData | null;
  columnMapping: ColumnMapping;
  filterState: FilterState;
  insights: Insight[];
  hasData: boolean;
  setRawData: (data: EmailData[]) => void;
  setColumnMapping: (mapping: ColumnMapping) => void;
  updateFilter: (newFilter: Partial<FilterState>) => void;
  processData: () => void;
}

const initialColumnMapping: ColumnMapping = {
  emailAddress: null,
  status: null,
  openTime: null,
  clickTime: null,
  campaignName: null,
  timestamp: null,
  bounceType: null,
  location: null,
  device: null,
  subject: null,
};

const initialFilterState: FilterState = {
  selectedCampaigns: [],
  dateRange: [null, null],
  selectedProviders: [],
};

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider = ({ children }: { children: ReactNode }) => {
  const [rawData, setRawData] = useState<EmailData[]>([]);
  const [processedData, setProcessedData] = useState<ProcessedData | null>(null);
  const [columnMapping, setColumnMapping] = useState<ColumnMapping>(initialColumnMapping);
  const [filterState, setFilterState] = useState<FilterState>(initialFilterState);
  const [insights, setInsights] = useState<Insight[]>([]);
  
  const processData = () => {
    if (rawData.length > 0) {
      const processed = processEmailData(rawData, columnMapping, filterState);
      setProcessedData(processed);
      
      // Generate insights would be called here in a real implementation
      setInsights([
        {
          id: '1',
          title: 'Best Performing Day',
          description: 'Tuesday shows the highest open rates across campaigns.',
          type: 'positive',
          metric: 'Open Rate',
          value: '28.5%'
        },
        {
          id: '2',
          title: 'Optimal Send Time',
          description: 'Emails sent between 10-11 AM show 22% higher engagement.',
          type: 'positive',
          metric: 'Engagement',
          value: '+22%'
        },
        {
          id: '3',
          title: 'Underperforming Segment',
          description: 'Free tier users have 35% lower click rates than premium users.',
          type: 'negative',
          metric: 'Click Rate',
          value: '-35%'
        }
      ]);
    }
  };

  const updateFilter = (newFilter: Partial<FilterState>) => {
    setFilterState(prev => ({ ...prev, ...newFilter }));
    // We would reprocess data here in a real implementation
  };

  const value = {
    rawData,
    processedData,
    columnMapping,
    filterState,
    insights,
    hasData: rawData.length > 0,
    setRawData,
    setColumnMapping,
    updateFilter,
    processData
  };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
};

export const useData = (): DataContextType => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};