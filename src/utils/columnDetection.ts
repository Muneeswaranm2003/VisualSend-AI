import { ColumnMapping } from '../types';

// Map of patterns to look for in column headers
const columnPatterns: Record<string, RegExp[]> = {
  value: [
    /value/i,
    /amount/i,
    /quantity/i,
    /number/i,
    /count/i
  ],
  category: [
    /category/i,
    /type/i,
    /class/i,
    /group/i,
    /segment/i
  ],
  timestamp: [
    /date/i,
    /time/i,
    /timestamp/i,
    /period/i
  ],
  location: [
    /location/i,
    /country/i,
    /region/i,
    /city/i,
    /area/i,
    /geography/i
  ],
  metric: [
    /metric/i,
    /measure/i,
    /score/i,
    /index/i,
    /ratio/i
  ],
  dimension: [
    /dimension/i,
    /attribute/i,
    /feature/i,
    /factor/i
  ],
  label: [
    /label/i,
    /name/i,
    /title/i,
    /description/i
  ],
  group: [
    /group/i,
    /cluster/i,
    /segment/i,
    /division/i
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
    value: null,
    category: null,
    timestamp: null,
    location: null,
    metric: null,
    dimension: null,
    label: null,
    group: null
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