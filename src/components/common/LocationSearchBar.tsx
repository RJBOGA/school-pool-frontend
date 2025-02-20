// src/components/common/LocationSearchBar.tsx
import React, { useState, useEffect, useRef } from 'react';
import { MapPin, X, Loader } from 'lucide-react';
import { LocationSearchBarProps, LocationResult } from '../../types/LocationTypes';

const LocationSearchBar: React.FC<LocationSearchBarProps> = ({
  onSelect,
  placeholder,
  initialValue = ''
}) => {
  const [inputValue, setInputValue] = useState(initialValue);
  const [isFocused, setIsFocused] = useState(false);
  const [searchResults, setSearchResults] = useState<LocationResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    setInputValue(initialValue);
  }, [initialValue]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current && 
        !dropdownRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setIsFocused(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const searchLocation = async (query: string) => {
    if (query.length < 3) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    setError(null);

    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=5&addressdetails=1`,
        {
          headers: {
            'Accept': 'application/json',
            'User-Agent': 'SchoolPool-App' // Recommended for Nominatim API
          }
        }
      );

      if (!response.ok) {
        throw new Error(`Search failed with status: ${response.status}`);
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
      console.error('Location search error:', err);
      setError('Failed to search locations. Please try again.');
    } finally {
      setIsSearching(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);
    searchLocation(value);
  };

  const handleResultClick = (result: LocationResult) => {
    setInputValue(result.displayName);
    onSelect(result);
    setIsFocused(false);
    setSearchResults([]);
  };

  const handleClearInput = () => {
    setInputValue('');
    setSearchResults([]);
    inputRef.current?.focus();
  };

  return (
    <div className="relative w-full">
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <MapPin className="h-5 w-5 text-gray-400" />
        </div>
        
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onFocus={() => setIsFocused(true)}
          placeholder={placeholder}
          className="block w-full pl-10 pr-10 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 text-sm"
          autoComplete="off"
        />
        
        {inputValue && (
          <button
            type="button"
            onClick={handleClearInput}
            className="absolute inset-y-0 right-0 pr-3 flex items-center"
            aria-label="Clear input"
          >
            <X className="h-4 w-4 text-gray-400 hover:text-gray-600" />
          </button>
        )}
      </div>

      {isFocused && (inputValue.length >= 2 || isSearching || error || searchResults.length > 0) && (
        <div 
          ref={dropdownRef}
          className="absolute z-20 mt-1 w-full bg-white shadow-lg max-h-60 rounded-md py-1 text-base overflow-auto focus:outline-none sm:text-sm border border-gray-200"
        >
          {isSearching && (
            <div className="flex items-center px-4 py-2 text-sm text-gray-500">
              <Loader className="animate-spin h-4 w-4 mr-2" />
              Searching...
            </div>
          )}
          
          {error && !isSearching && (
            <div className="px-4 py-2 text-sm text-red-500">
              {error}
            </div>
          )}
          
          {!isSearching && !error && searchResults.length === 0 && inputValue.length >= 2 && (
            <div className="px-4 py-2 text-sm text-gray-500">
              No results found
            </div>
          )}

          {searchResults.map((result, index) => (
            <div
              key={`${result.placeId || index}`}
              className="cursor-pointer hover:bg-gray-100 px-4 py-2 text-sm text-gray-900"
              onClick={() => handleResultClick(result)}
            >
              <div className="flex items-start">
                <MapPin className="h-4 w-4 text-gray-400 mt-1 mr-2 flex-shrink-0" />
                <span className="line-clamp-2">{result.displayName}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default LocationSearchBar;