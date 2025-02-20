// src/components/common/MapLocationSelector.tsx
import React, { useState, useEffect, useCallback, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { MapLocationSelectorProps, Coordinates, LocationResult } from '../../types/LocationTypes';
import LocationSearchBar from './LocationSearchBar';

// Fix Leaflet's default icon issue
const fixLeafletIcon = () => {
  // Get default icon image URLs
  const iconUrl = 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png';
  const shadowUrl = 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png';
  
  // Create default icon
  const DefaultIcon = L.icon({
    iconUrl,
    shadowUrl,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    tooltipAnchor: [16, -28],
    shadowSize: [41, 41]
  });
  
  // Set default icon for all markers
  L.Marker.prototype.options.icon = DefaultIcon;
};

// Call this once when component is imported
fixLeafletIcon();

const MapLocationSelector: React.FC<MapLocationSelectorProps> = ({
  value,
  coordinates,
  onChange,
  placeholder,
  error,
  mapHeight = '300px',
  name,
  register
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [markerPosition, setMarkerPosition] = useState<Coordinates | null>(coordinates);
  const [isMapReady, setIsMapReady] = useState(false);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);
  const defaultCenter: Coordinates = { lat: 39.0456, lng: -94.6275 }; // Kansas City area
  
  // Update marker position when coordinates prop changes
  useEffect(() => {
    setMarkerPosition(coordinates);
    
    // If map is initialized and coordinates change, update the marker and view
    if (mapInstanceRef.current && coordinates) {
      if (markerRef.current) {
        markerRef.current.setLatLng([coordinates.lat, coordinates.lng]);
      } else {
        createMarker(coordinates);
      }
      mapInstanceRef.current.setView([coordinates.lat, coordinates.lng], 13);
    }
  }, [coordinates]);

  // Clean up map on unmount
  useEffect(() => {
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
        markerRef.current = null;
      }
    };
  }, []);

  const createMarker = useCallback((coords: Coordinates) => {
    if (!mapInstanceRef.current) return;
    
    // Remove existing marker
    if (markerRef.current) {
      markerRef.current.remove();
    }
    
    // Create new marker
    markerRef.current = L.marker([coords.lat, coords.lng])
      .addTo(mapInstanceRef.current)
      .bindPopup('Selected location');
  }, []);

  const handleMapClick = useCallback((e: L.LeafletMouseEvent) => {
    const coords: Coordinates = {
      lat: e.latlng.lat,
      lng: e.latlng.lng
    };
    
    setMarkerPosition(coords);
    createMarker(coords);
    
    // Reverse geocoding to get address from coordinates
    fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${coords.lat}&lon=${coords.lng}&zoom=18&addressdetails=1`)
      .then(response => {
        if (!response.ok) throw new Error('Network response was not ok');
        return response.json();
      })
      .then(data => {
        const address = data.display_name || `${coords.lat.toFixed(6)}, ${coords.lng.toFixed(6)}`;
        onChange(address, coords);
      })
      .catch(error => {
        console.error('Error with reverse geocoding:', error);
        // Fallback to coordinates as string
        onChange(`${coords.lat.toFixed(6)}, ${coords.lng.toFixed(6)}`, coords);
      });
  }, [onChange, createMarker]);

  // Initialize map when component changes to expanded state
  useEffect(() => {
    if (!isExpanded || !mapContainerRef.current || mapInstanceRef.current) return;
    
    console.log('Initializing map...');
    
    // Use setTimeout to ensure DOM is ready
    const initMapTimer = setTimeout(() => {
      if (!mapContainerRef.current) {
        console.error('Map container ref is null');
        return;
      }
      
      try {
        // Create map instance
        const map = L.map(mapContainerRef.current, {
          center: markerPosition ? 
            [markerPosition.lat, markerPosition.lng] : 
            [defaultCenter.lat, defaultCenter.lng],
          zoom: 13,
          layers: [
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
              attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
              maxZoom: 19,
              minZoom: 2
            })
          ]
        });
        
        // Add click handler
        map.on('click', handleMapClick);
        
        // Add initial marker if coordinates exist
        if (markerPosition) {
          createMarker(markerPosition);
        }
        
        // Store map instance in ref
        mapInstanceRef.current = map;
        
        // Force a resize after a short delay to ensure proper rendering
        setTimeout(() => {
          map.invalidateSize();
          setIsMapReady(true);
          console.log('Map initialization complete');
        }, 300);
      } catch (err) {
        console.error('Error initializing map:', err);
      }
    }, 300); // Delay map initialization
    
    return () => clearTimeout(initMapTimer);
  }, [isExpanded, markerPosition, defaultCenter, handleMapClick, createMarker]);

  const handleLocationSelect = useCallback((result: LocationResult) => {
    setMarkerPosition(result.coordinates);
    onChange(result.displayName, result.coordinates);
    
    if (mapInstanceRef.current) {
      mapInstanceRef.current.setView(
        [result.coordinates.lat, result.coordinates.lng],
        13
      );
      createMarker(result.coordinates);
    }
  }, [onChange, createMarker]);

  const toggleMap = useCallback(() => {
    setIsExpanded(prev => !prev);
  }, []);

  return (
    <div className="map-location-selector">
      {/* Hidden input for form integration */}
      {register && (
        <input
          type="hidden"
          {...register(name)}
          value={value}
        />
      )}
      
      <div className="mb-2">
        <LocationSearchBar
          onSelect={handleLocationSelect}
          placeholder={placeholder}
          initialValue={value}
        />
      </div>
      
      <button
        type="button"
        onClick={toggleMap}
        className="text-sm text-primary-600 hover:text-primary-800 mb-2 flex items-center"
      >
        {isExpanded ? 'Hide map' : 'Show map'}
      </button>
      
      {isExpanded && (
        <div
          ref={mapContainerRef}
          className="map-container border border-gray-300 rounded-md overflow-hidden"
          style={{
            height: mapHeight,
            width: '100%',
            marginBottom: '1rem',
            position: 'relative',
            zIndex: 10
          }}
        >
          {!isMapReady && (
            <div className="absolute inset-0 bg-gray-100 flex items-center justify-center">
              Loading map...
            </div>
          )}
        </div>
      )}
      
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
      
      {coordinates && (
        <p className="text-xs text-gray-500 mt-1">
          Coordinates: {coordinates.lat.toFixed(6)}, {coordinates.lng.toFixed(6)}
        </p>
      )}
    </div>
  );
};

export default MapLocationSelector;