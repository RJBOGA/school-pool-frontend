import { UserRole, RideStatus, BookingStatus } from './enums';

export interface Vehicle {
    make: string;
    model: string;
    licensePlate: string;
    driversLicense: string;
  }
  
  export interface User {
    phone: string;  // Using as ID
    firstName: string;
    lastName: string;
    email: string;
    universityEmail: string;
    university: string;
    password: string;
    role: UserRole;
    rating: number;
    isDriverVerified: boolean;
    vehicleDetails?: Vehicle[];
  }

export interface GeoJsonPoint {
  type: 'Point';
  coordinates: [number, number]; // [longitude, latitude]
}

export interface Ride {
  id: string;
  driver: User;
  origin: string;
  destination: string;
  departureTime: string; // ISO date string
  totalSeats: number;
  availableSeats: number;
  price: number;
  status: RideStatus;
  locations?: string[];
  coordinates?: GeoJsonPoint[];
}

export interface Booking {
  id: string;
  ride: Ride;
  passenger: User;
  status: BookingStatus;
  bookingTime: string; // ISO date string
}

// Add these to your types/models.ts
export interface LoginRequest {
    phone: string;
    password: string;
  }
  
  export interface LoginResponse {
    success: boolean;
    message: string;
    user?: User;
    // Add any other fields your backend returns
  }

export interface RegisterRequest extends User {
  password: string;
}

export interface ApiResponse<T> {
  data: T;
  message: string;
  status: number;
}