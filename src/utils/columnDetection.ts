import { ColumnMapping } from '../types';

// Map of patterns to look for in column headers
const columnPatterns: Record<string, RegExp[]> = {
  emailAddress: [
    /email/i, 
    /e-?mail address/i, 
    /recipient/i,
    /subscriber/i
  ],
  status: [
    /status/i,
    /delivery status/i,
    /email status/i,
    /result/i
  ],
  openTime: [
    /open(ed)?[ _-]?(time|date)/i,
    /time[ _-]?opened/i,
    /open timestamp/i
  ],
  clickTime: [
    /click(ed)?[ _-]?(time|date)/i,
    /time[ _-]?clicked/i,
    /click timestamp/i
  ],
  campaignName: [
    /campaign[ _-]?name/i,
    /campaign[ _-]?title/i,
    /campaign[ _-]?id/i,
    /email[ _-]?campaign/i
  ],
  timestamp: [
    /sent[ _-]?(time|date)/i,
    /timestamp/i,
    /date[ _-]?sent/i,
    /time[ _-]?sent/i
  ],
  bounceType: [
    /bounce[ _-]?type/i,
    /bounce[ _-]?category/i,
    /bounce[ _-]?reason/i
  ],
  location: [
    /location/i,
    /country/i,
    /region/i,
    /geo/i,
    /geography/i
  ],
  device: [
    /device/i,
    /platform/i,
    /user[ _-]?agent/i,
    /browser/i
  ],
  subject: [
    /subject/i,
    /subject[ _-]?line/i,
    /email[ _-]?subject/i
  ]
};

// Score column headers based on match confidence
const scoreColumns = (headers: string[], field: string): Record<string, number> => {
  const patterns = columnPatterns[field];
  const scores: Record<string, number> = {};
  
  headers.forEach(header => {
    scores[header] = 0;
    patterns.forEach(pattern => {
      if (pattern.test(header)) {
        // Exact match gets higher score
        if (header.toLowerCase() === field.toLowerCase()) {
          scores[header] += 3;
        } else {
          scores[header] += 1;
        }
      }
    });
  });
  
  return scores;
};

// Get best matching column for a field
const getBestMatch = (scores: Record<string, number>): string | null => {
  let bestMatch: string | null = null;
  let highestScore = 0;
  
  Object.entries(scores).forEach(([header, score]) => {
    if (score > highestScore) {
      highestScore = score;
      bestMatch = header;
    }
  });
  
  return highestScore > 0 ? bestMatch : null;
};

// Detect likely columns for each field
export const detectColumns = (headers: string[]): ColumnMapping => {
  const mapping: ColumnMapping = {
    emailAddress: null,
    status: null,
    openTime: null,
    clickTime: null,
    campaignName: null,
    timestamp: null,
    bounceType: null,
    location: null,
    device: null,
    subject: null
  };
  
  Object.keys(mapping).forEach(field => {
    const scores = scoreColumns(headers, field);
    const bestMatch = getBestMatch(scores);
    
    if (bestMatch) {
      mapping[field] = bestMatch;
    }
  });
  
  return mapping;
};

// Suggest a mapping when automatic detection isn't sufficient
export const suggestMapping = (headers: string[]): ColumnMapping => {
  // First try automatic detection
  const automaticMapping = detectColumns(headers);
  
  // For any fields that weren't detected, make best guesses based on data types
  // This would be more sophisticated in a real implementation
  
  return automaticMapping;
};