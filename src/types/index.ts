export interface EmailData {
  emailAddress?: string;
  status?: string;
  openTime?: string | Date | null;
  clickTime?: string | Date | null;
  campaignName?: string;
  timestamp?: string | Date;
  bounceType?: string;
  location?: string;
  device?: string;
  subject?: string;
  [key: string]: any;
}

export interface ColumnMapping {
  emailAddress: string | null;
  status: string | null;
  openTime: string | null;
  clickTime: string | null;
  campaignName: string | null;
  timestamp: string | null;
  bounceType: string | null;
  location: string | null;
  device: string | null;
  subject: string | null;
  [key: string]: string | null;
}

export interface ProcessedData {
  rawData: EmailData[];
  totalSent: number;
  totalDelivered: number;
  totalOpened: number;
  totalClicked: number;
  openRate: number;
  clickRate: number;
  bounceRate: number;
  softBounces: number;
  hardBounces: number;
  engagementOverTime: Array<{date: string; opens: number; clicks: number}>;
  opensByHour: Array<{hour: number; count: number}>;
  campaignComparison: Array<{
    campaign: string;
    sent: number;
    opened: number;
    clicked: number;
    openRate: number;
    clickRate: number;
  }>;
  locationData: Array<{
    location: string;
    opens: number;
    clicks: number;
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
  campaigns: string[];
  startDate: Date | null;
  endDate: Date | null;
  emailProviders: string[];
}

export interface FilterState {
  selectedCampaigns: string[];
  dateRange: [Date | null, Date | null];
  selectedProviders: string[];
}