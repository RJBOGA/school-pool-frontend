// LocationInput.tsx
import React, { useState } from "react";
import { MapPin } from "lucide-react";
import { LocationInputProps } from "../../types/LocationInputTypes";

const LocationInput: React.FC<LocationInputProps> = ({
  placeholder,
  error,
  name,
  register,
  value,
  onChange,
}) => {
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const searchLocation = async (query: string) => {
    if (query.length < 3) {
      setSuggestions([]);
      return;
    }

    try {
      const apiKey = import.meta.env.VITE_MAP_API_KEY;
      console.log(`API Key being used: ${apiKey}`);
      const response = await fetch(
        `https://api.locationiq.com/v1/autocomplete?key=${apiKey}&q=${encodeURIComponent(
          query
        )}&limit=5&countrycodes=us`
      );

      const data = await response.json();
      setSuggestions(data || []);
    } catch (error) {
      console.error("Location search failed:", error);
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
          value={value}
          onChange={(e) => {
            searchLocation(e.target.value);
            onChange(e.target.value);
            setShowSuggestions(true);
          }}
          onFocus={() => setShowSuggestions(true)}
          onBlur={() => {
            setTimeout(() => setShowSuggestions(false), 200);
          }}
        />
      </div>

      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute z-50 w-full mt-1 bg-white rounded-md shadow-lg border border-gray-200 max-h-60 overflow-y-auto">
          {suggestions.map((suggestion) => (
            <div
              key={suggestion.place_id}
              className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm"
              onClick={() => {
                const input = document.querySelector(
                  `input[name="${name}"]`
                ) as HTMLInputElement;
                if (input) {
                  input.value = suggestion.display_name;
                  input.dispatchEvent(new Event("input", { bubbles: true }));
                }
                setShowSuggestions(false);
              }}
            >
              {suggestion.display_name}
            </div>
          ))}
        </div>
      )}

      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
};

export default LocationInput;