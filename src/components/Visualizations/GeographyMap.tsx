import React from 'react';
import { ComposableMap, Geographies, Geography, Marker } from 'react-simple-maps';

interface GeographyMapProps {
  data: Array<{
    location: string;
    opens: number;
    clicks: number;
  }>;
}

// This is a simplified map for demonstration purposes
// In a real application, you would use a more detailed map and geocoding
const GeographyMap: React.FC<GeographyMapProps> = ({ data }) => {
  // Sample position mapping (in a real app, you would use geocoding)
  const locationToPosition: Record<string, [number, number]> = {
    'US': [-95, 36],
    'UK': [0, 52],
    'Canada': [-100, 56],
    'Australia': [133, -25],
    'Germany': [10, 51],
    'France': [2, 46],
    'Japan': [138, 36],
    'Brazil': [-53, -10],
    'India': [78, 21],
    'China': [105, 35],
    'Mexico': [-102, 23],
    'Spain': [-4, 40],
    'Italy': [12, 42],
    'Russia': [90, 60],
    'South Africa': [25, -29],
  };
  
  // In a real app, you would need to normalize the data properly
  const maxOpens = Math.max(...data.map(d => d.opens), 1);
  
  return (
    <div className="h-60">
      {data.length > 0 ? (
        <ComposableMap
          projection="geoEqualEarth"
          projectionConfig={{
            scale: 120,
          }}
        >
          <Geographies geography="/world-110m.json">
            {({ geographies }) =>
              geographies.map((geo) => (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  fill="#e5e7eb"
                  stroke="#d1d5db"
                  style={{
                    default: { outline: 'none' },
                    hover: { outline: 'none', fill: '#f3f4f6' },
                    pressed: { outline: 'none' },
                  }}
                />
              ))
            }
          </Geographies>
          
          {data.map((d, i) => {
            const position = locationToPosition[d.location];
            if (!position) return null;
            
            // Calculate size based on opens (normalized)
            const size = (d.opens / maxOpens) * 20 + 5;
            
            return (
              <Marker key={i} coordinates={position}>
                <circle
                  r={size}
                  fill="#8b5cf6"
                  fillOpacity={0.7}
                  stroke="#8b5cf6"
                  strokeWidth={1}
                />
                <circle
                  r={3}
                  fill="#8b5cf6"
                  stroke="#fff"
                  strokeWidth={1}
                />
              </Marker>
            );
          })}
        </ComposableMap>
      ) : (
        <div className="h-full flex items-center justify-center">
          <p className="text-gray-500 text-sm">No location data available</p>
        </div>
      )}
    </div>
  );
};

export default GeographyMap;