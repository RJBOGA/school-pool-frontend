import React, { useState } from 'react';
import { MapPin } from 'lucide-react';

interface LocationInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  error?: string;
  name: string;
  register: any;
}

const LocationInput: React.FC<LocationInputProps> = ({
  placeholder,
  error,
  name,
  register,
}) => {
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const searchLocation = async (query: string) => {
    if (query.length < 3) {
      setSuggestions([]);
      return;
    }

    try {
      const response = await fetch(
        `https://api.locationiq.com/v1/autocomplete?key=${process.env.REACT_APP_LOCATIONIQ_TOKEN}&q=${encodeURIComponent(query)}&limit=5&countrycodes=us`
      );
      const data = await response.json();
      setSuggestions(data || []);
    } catch (error) {
      console.error('Location search failed:', error);
      setSuggestions([]);
    }
  };

  return (
    <div>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <MapPin className="h-5 w-5 text-gray-400" />
        </div>
        <input
          {...register(name)}
          type="text"
          className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500"
          placeholder={placeholder}
          onChange={(e) => {
            searchLocation(e.target.value);
            setShowSuggestions(true);
          }}
          onFocus={() => setShowSuggestions(true)}
          onBlur={() => {
            // Delay hiding suggestions to allow clicking them
            setTimeout(() => setShowSuggestions(false), 200);
          }}
        />
      </div>

      {/* Suggestions dropdown */}
      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute z-50 w-full mt-1 bg-white rounded-md shadow-lg border border-gray-200 max-h-60 overflow-y-auto">
          {suggestions.map((suggestion) => (
            <div
              key={suggestion.place_id}
              className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm"
              onClick={() => {
                const input = document.querySelector(`input[name="${name}"]`) as HTMLInputElement;
                if (input) {
                  input.value = suggestion.display_name;
                  input.dispatchEvent(new Event('input', { bubbles: true }));
                }
                setShowSuggestions(false);
              }}
            >
              {suggestion.display_name}
            </div>
          ))}
        </div>
      )}

      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
};

export default LocationInput;