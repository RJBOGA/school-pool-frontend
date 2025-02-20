// src/hooks/useMapLocation.ts
import { useState, useCallback } from 'react';
import { Coordinates, LocationResult, ReverseGeocodeResult } from '../types/LocationTypes';

const NOMINATIM_BASE_URL = 'https://nominatim.openstreetmap.org';

export const useMapLocation = (initialAddress = '', initialCoordinates: Coordinates | null = null) => {
  const [address, setAddress] = useState<string>(initialAddress);
  const [coordinates, setCoordinates] = useState<Coordinates | null>(initialCoordinates);
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [searchResults, setSearchResults] = useState<LocationResult[]>([]);
  const [error, setError] = useState<string | null>(null);

  const searchLocation = useCallback(async (query: string) => {
    if (query.length < 3) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    setError(null);

    try {
      const response = await fetch(
        `${NOMINATIM_BASE_URL}/search?format=json&q=${encodeURIComponent(query)}&limit=5&addressdetails=1`
      );

      if (!response.ok) {
        throw new Error('Location search failed');
      }

      const data = await response.json();
      
      const results: LocationResult[] = data.map((item: any) => ({
        displayName: item.display_name,
        coordinates: {
          lat: parseFloat(item.lat),
          lng: parseFloat(item.lon)
        },
        boundingBox: item.boundingbox,
        placeId: item.place_id
      }));

      setSearchResults(results);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to search location');
      console.error('Location search error:', err);
    } finally {
      setIsSearching(false);
    }
  }, []);

  const reverseGeocode = useCallback(async (lat: number, lng: number): Promise<string> => {
    try {
      const response = await fetch(
        `${NOMINATIM_BASE_URL}/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`
      );

      if (!response.ok) {
        throw new Error('Reverse geocoding failed');
      }

      const data: ReverseGeocodeResult = await response.json();
      return data.displayName;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to get address from coordinates');
      console.error('Reverse geocoding error:', err);
      return `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
    }
  }, []);

  const selectLocation = useCallback(async (result: LocationResult) => {
    setAddress(result.displayName);
    setCoordinates(result.coordinates);
    setSearchResults([]);
  }, []);

  const selectLocationByCoordinates = useCallback(async (lat: number, lng: number) => {
    const newCoordinates = { lat, lng };
    setCoordinates(newCoordinates);
    
    const addressName = await reverseGeocode(lat, lng);
    setAddress(addressName);
  }, [reverseGeocode]);

  const clearLocation = useCallback(() => {
    setAddress('');
    setCoordinates(null);
    setSearchResults([]);
  }, []);

  return {
    address,
    coordinates,
    searchResults,
    isSearching,
    error,
    searchLocation,
    selectLocation,
    selectLocationByCoordinates,
    clearLocation,
    setAddress
  };
};