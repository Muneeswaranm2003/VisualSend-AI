export interface DataRow {
  value?: string | number;
  category?: string;
  timestamp?: string | Date;
  location?: string;
  metric?: number;
  dimension?: string;
  label?: string;
  group?: string;
  [key: string]: any;
}

export interface ColumnMapping {
  value: string | null;
  category: string | null;
  timestamp: string | null;
  location: string | null;
  metric: string | null;
  dimension: string | null;
  label: string | null;
  group: string | null;
  [key: string]: string | null;
}

export interface ProcessedData {
  rawData: DataRow[];
  totalRecords: number;
  metrics: {
    min: number;
    max: number;
    average: number;
    sum: number;
  };
  categoricalData: Array<{
    category: string;
    count: number;
    percentage: number;
  }>;
  timeSeriesData: Array<{
    timestamp: string;
    value: number;
  }>;
  geographicData: Array<{
    location: string;
    value: number;
  }>;
  dimensionalData: Array<{
    dimension: string;
    metrics: {
      value: number;
      change: number;
      trend: 'up' | 'down' | 'stable';
    };
  }>;
}

export interface Insight {
  id: string;
  title: string;
  description: string;
  type: 'positive' | 'negative' | 'neutral' | 'suggestion';
  metric?: string;
  value?: string | number;
}

export interface FilterOptions {
  categories: string[];
  startDate: Date | null;
  endDate: Date | null;
  dimensions: string[];
}

export interface FilterState {
  selectedCategories: string[];
  dateRange: [Date | null, Date | null];
  selectedDimensions: string[];
}