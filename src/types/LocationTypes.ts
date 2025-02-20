// src/types/LocationTypes.ts
export interface Coordinates {
    lat: number;
    lng: number;
  }
  
  export interface LocationResult {
    displayName: string;
    coordinates: Coordinates;
    boundingBox?: [string, string, string, string];
    placeId?: string;
  }
  
  export interface MapLocationSelectorProps {
    value: string;
    coordinates: Coordinates | null;
    onChange: (address: string, coordinates: Coordinates) => void;
    placeholder: string;
    error?: string;
    mapHeight?: string;
    name: string;
    register?: any;
  }
  
  export interface LocationSearchBarProps {
    onSelect: (result: LocationResult) => void;
    placeholder: string;
    initialValue?: string;
  }
  
  export interface ReverseGeocodeResult {
    displayName: string;
    address: {
      road?: string;
      city?: string;
      state?: string;
      country?: string;
      postcode?: string;
    };
  }
  