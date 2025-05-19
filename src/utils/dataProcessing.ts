import { EmailData, ProcessedData, ColumnMapping, FilterState } from '../types';
import { format, parseISO, isValid } from 'date-fns';

// Process raw email data into structured format for visualizations
export const processEmailData = (
  data: EmailData[],
  mapping: ColumnMapping,
  filters: FilterState
): ProcessedData => {
  // Apply column mapping to normalize data
  const mappedData = data.map(row => {
    const mappedRow: EmailData = {};
    Object.entries(mapping).forEach(([key, columnName]) => {
      if (columnName && row[columnName] !== undefined) {
        mappedRow[key] = row[columnName];
      }
    });
    return mappedRow;
  });

  // Apply filters
  const filteredData = applyFilters(mappedData, filters);

  // Calculate core metrics
  const totalSent = filteredData.length;
  const totalDelivered = filteredData.filter(row => 
    row.status?.toLowerCase() !== 'bounced' && 
    row.status?.toLowerCase() !== 'failed'
  ).length;
  
  const totalOpened = filteredData.filter(row => !!row.openTime).length;
  const totalClicked = filteredData.filter(row => !!row.clickTime).length;
  
  const openRate = totalDelivered > 0 ? (totalOpened / totalDelivered) * 100 : 0;
  const clickRate = totalDelivered > 0 ? (totalClicked / totalDelivered) * 100 : 0;
  const bounceRate = totalSent > 0 ? ((totalSent - totalDelivered) / totalSent) * 100 : 0;
  
  // Calculate bounce types
  const softBounces = filteredData.filter(row => 
    row.bounceType?.toLowerCase().includes('soft') || 
    (row.status?.toLowerCase() === 'bounced' && row.bounceType?.toLowerCase()?.includes('temp'))
  ).length;
  
  const hardBounces = filteredData.filter(row => 
    row.bounceType?.toLowerCase().includes('hard') || 
    (row.status?.toLowerCase() === 'bounced' && !row.bounceType?.toLowerCase()?.includes('temp'))
  ).length;

  // Calculate engagement over time
  const engagementOverTime = calculateEngagementOverTime(filteredData);
  
  // Calculate opens by hour
  const opensByHour = calculateOpensByHour(filteredData);
  
  // Calculate campaign comparison
  const campaignComparison = calculateCampaignComparison(filteredData);
  
  // Calculate location data
  const locationData = calculateLocationData(filteredData);

  return {
    rawData: filteredData,
    totalSent,
    totalDelivered,
    totalOpened,
    totalClicked,
    openRate,
    clickRate,
    bounceRate,
    softBounces,
    hardBounces,
    engagementOverTime,
    opensByHour,
    campaignComparison,
    locationData
  };
};

// Apply filters to data
const applyFilters = (data: EmailData[], filters: FilterState): EmailData[] => {
  let filtered = [...data];
  
  // Filter by campaign
  if (filters.selectedCampaigns.length > 0) {
    filtered = filtered.filter(row => 
      row.campaignName && filters.selectedCampaigns.includes(row.campaignName)
    );
  }
  
  // Filter by date range
  if (filters.dateRange[0] && filters.dateRange[1]) {
    filtered = filtered.filter(row => {
      if (!row.timestamp) return true;
      
      const date = new Date(row.timestamp);
      return (
        date >= filters.dateRange[0]! && 
        date <= filters.dateRange[1]!
      );
    });
  }
  
  // Filter by provider (would extract provider from email address)
  if (filters.selectedProviders.length > 0) {
    filtered = filtered.filter(row => {
      if (!row.emailAddress) return true;
      
      const provider = row.emailAddress.split('@')[1]?.split('.')[0];
      return provider && filters.selectedProviders.includes(provider);
    });
  }
  
  return filtered;
};

// Calculate engagement metrics over time
const calculateEngagementOverTime = (data: EmailData[]): Array<{date: string; opens: number; clicks: number}> => {
  const engagementByDate: Record<string, {opens: number; clicks: number}> = {};
  
  data.forEach(row => {
    if (row.timestamp) {
      let dateStr: string;
      
      // Parse date from timestamp
      if (typeof row.timestamp === 'string') {
        try {
          const date = parseISO(row.timestamp);
          if (isValid(date)) {
            dateStr = format(date, 'yyyy-MM-dd');
          } else {
            dateStr = row.timestamp.split('T')[0] || 'Unknown';
          }
        } catch (e) {
          dateStr = 'Unknown';
        }
      } else {
        dateStr = format(row.timestamp, 'yyyy-MM-dd');
      }
      
      // Initialize if not exists
      if (!engagementByDate[dateStr]) {
        engagementByDate[dateStr] = { opens: 0, clicks: 0 };
      }
      
      // Count opens and clicks
      if (row.openTime) {
        engagementByDate[dateStr].opens += 1;
      }
      
      if (row.clickTime) {
        engagementByDate[dateStr].clicks += 1;
      }
    }
  });
  
  // Convert to array and sort by date
  return Object.entries(engagementByDate)
    .map(([date, counts]) => ({ date, ...counts }))
    .sort((a, b) => a.date.localeCompare(b.date));
};

// Calculate opens by hour of day
const calculateOpensByHour = (data: EmailData[]): Array<{hour: number; count: number}> => {
  const opensByHour: Record<number, number> = {};
  
  // Initialize hours
  for (let i = 0; i < 24; i++) {
    opensByHour[i] = 0;
  }
  
  data.forEach(row => {
    if (row.openTime) {
      let openDate: Date;
      
      // Parse date from openTime
      if (typeof row.openTime === 'string') {
        try {
          openDate = parseISO(row.openTime);
          if (isValid(openDate)) {
            const hour = openDate.getHours();
            opensByHour[hour] += 1;
          }
        } catch (e) {
          // Skip invalid dates
        }
      } else if (row.openTime instanceof Date) {
        const hour = row.openTime.getHours();
        opensByHour[hour] += 1;
      }
    }
  });
  
  // Convert to array
  return Object.entries(opensByHour)
    .map(([hour, count]) => ({ hour: parseInt(hour), count }))
    .sort((a, b) => a.hour - b.hour);
};

// Calculate metrics by campaign
const calculateCampaignComparison = (data: EmailData[]): Array<{
  campaign: string;
  sent: number;
  opened: number;
  clicked: number;
  openRate: number;
  clickRate: number;
}> => {
  const campaignStats: Record<string, {
    sent: number;
    opened: number;
    clicked: number;
  }> = {};
  
  data.forEach(row => {
    const campaign = row.campaignName || 'Unknown';
    
    if (!campaignStats[campaign]) {
      campaignStats[campaign] = { sent: 0, opened: 0, clicked: 0 };
    }
    
    campaignStats[campaign].sent += 1;
    
    if (row.openTime) {
      campaignStats[campaign].opened += 1;
    }
    
    if (row.clickTime) {
      campaignStats[campaign].clicked += 1;
    }
  });
  
  // Calculate rates and convert to array
  return Object.entries(campaignStats)
    .map(([campaign, stats]) => ({
      campaign,
      ...stats,
      openRate: stats.sent > 0 ? (stats.opened / stats.sent) * 100 : 0,
      clickRate: stats.sent > 0 ? (stats.clicked / stats.sent) * 100 : 0
    }))
    .sort((a, b) => b.sent - a.sent);
};

// Calculate location data
const calculateLocationData = (data: EmailData[]): Array<{
  location: string;
  opens: number;
  clicks: number;
}> => {
  const locationStats: Record<string, { opens: number; clicks: number }> = {};
  
  data.forEach(row => {
    if (row.location) {
      const location = row.location;
      
      if (!locationStats[location]) {
        locationStats[location] = { opens: 0, clicks: 0 };
      }
      
      if (row.openTime) {
        locationStats[location].opens += 1;
      }
      
      if (row.clickTime) {
        locationStats[location].clicks += 1;
      }
    }
  });
  
  // Convert to array
  return Object.entries(locationStats)
    .map(([location, stats]) => ({ location, ...stats }))
    .sort((a, b) => b.opens - a.opens);
};