import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Clock, Users, BadgeDollarSign } from "lucide-react";
import Layout from "../../components/layout/Layout";
import { useAuth } from "../../contexts/AuthContext";
import { rideService } from "../../services";
import { RideStatus } from "../../types";
import { InformationCircleIcon } from "@heroicons/react/16/solid";
import MapLocationSelector from "../../components/common/MapLocationSelector";
import { Coordinates } from "../../types/LocationTypes";
import { GeoJsonPoint } from "../../types/GeoJsonTypes";
import { checkLeafletResources, fixCommonLeafletIssues } from "../../utils/mapDebugUtils";
import { initializeLeaflet } from "../../utils/leafletLoader";

// Ensure Leaflet CSS is loaded
import "leaflet/dist/leaflet.css";

// Update schema to include coordinates
const scheduleRideSchema = z.object({
  origin: z.string().min(1, "Starting location is required"),
  originCoordinates: z
    .object({
      lat: z.number(),
      lng: z.number(),
    })
    .optional(),
  destination: z.string().min(1, "Destination is required"),
  destinationCoordinates: z
    .object({
      lat: z.number(),
      lng: z.number(),
    })
    .optional(),
  departureTime: z.string().min(1, "Departure time is required"),
  totalSeats: z
    .number()
    .min(1, "Must offer at least 1 seat")
    .max(8, "Maximum 8 seats allowed"),
  price: z
    .number()
    .min(0, "Price must be positive")
    .max(1000, "Price too high"),
});

type ScheduleRideForm = z.infer<typeof scheduleRideSchema>;

const ScheduleRide = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // State for location data
  const [originAddress, setOriginAddress] = useState("");
  const [originCoordinates, setOriginCoordinates] = useState<Coordinates | null>(null);
  const [destinationAddress, setDestinationAddress] = useState("");
  const [destinationCoordinates, setDestinationCoordinates] = useState<Coordinates | null>(null);

  // Initialize Leaflet resources when component mounts
  useEffect(() => {
    initializeLeaflet()
      .then(() => {
        console.log('Leaflet resources initialized in ScheduleRide component');
      })
      .catch(error => {
        console.error('Failed to initialize Leaflet resources:', error);
        // Fallback - try to fix common issues
        fixCommonLeafletIssues();
      });
      
    // Debug Leaflet resource loading
    checkLeafletResources();
  }, []);

  const getNowAsLocalISOString = () => {
    const now = new Date();
    // Convert to local timezone and reset seconds/milliseconds
    now.setSeconds(0, 0);
    // Format the time for datetime-local input
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0"); // Months are 0-indexed
    const date = String(now.getDate()).padStart(2, "0");
    const hours = String(now.getHours()).padStart(2, "0");
    const minutes = String(now.getMinutes()).padStart(2, "0");
    return `${year}-${month}-${date}T${hours}:${minutes}`;
  };

  const [minTime, setMinTime] = useState(getNowAsLocalISOString());

  useEffect(() => {
    const intervalId = setInterval(() => {
      setMinTime(getNowAsLocalISOString());
    }, 60000); // Update every minute
    return () => clearInterval(intervalId);
  }, []);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<ScheduleRideForm>({
    resolver: zodResolver(scheduleRideSchema),
    defaultValues: {
      totalSeats: 1,
      price: 0,
    },
  });

  const handleOriginChange = (address: string, coordinates: Coordinates) => {
    console.log("Origin changed:", address, coordinates);
    setOriginAddress(address);
    setOriginCoordinates(coordinates);
    setValue("origin", address);
    setValue("originCoordinates", coordinates);
  };

  const handleDestinationChange = (address: string, coordinates: Coordinates) => {
    console.log("Destination changed:", address, coordinates);
    setDestinationAddress(address);
    setDestinationCoordinates(coordinates);
    setValue("destination", address);
    setValue("destinationCoordinates", coordinates);
  };

  const onSubmit = async (data: ScheduleRideForm) => {
    if (!user) return;
    console.log("Submitting form data:", data);

    try {
      setIsSubmitting(true);

      // Get all user rides
      const userRides = await rideService.getUserRides(user.phone);
      const newRideStart = new Date(data.departureTime);
      const newRideEnd = new Date(newRideStart.getTime() + 60 * 60000); // 1 hour window

      // Check for overlaps
      const overlappingRide = userRides.find((existingRide) => {
        const existingStart = new Date(existingRide.departureTime);
        const existingEnd = new Date(existingStart.getTime() + 60 * 60000);
        return newRideStart < existingEnd && newRideEnd > existingStart;
      });

      if (overlappingRide) {
        alert(
          "This ride overlaps with one of your existing rides. Please choose a different time."
        );
        return;
      }

      // Create properly formatted GeoJsonPoint objects
      const coordinates: GeoJsonPoint[] = [];
      
      if (data.originCoordinates) {
        coordinates.push({
          type: "Point",
          coordinates: [data.originCoordinates.lng, data.originCoordinates.lat]
        });
      }
      
      if (data.destinationCoordinates) {
        coordinates.push({
          type: "Point",
          coordinates: [data.destinationCoordinates.lng, data.destinationCoordinates.lat]
        });
      }

      // Create ride data
      const rideData = {
        origin: data.origin,
        destination: data.destination,
        departureTime: data.departureTime,
        totalSeats: data.totalSeats,
        price: data.price,
        driver: user,
        status: RideStatus.SCHEDULED,
        availableSeats: data.totalSeats,
        coordinates
      };
      
      console.log("Sending ride data to server:", rideData);
      await rideService.createRide(rideData);
      navigate("/dashboard");
    } catch (error) {
      console.error("Failed to schedule ride:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 mt-16">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">
            Schedule a Ride
          </h1>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-6 bg-white rounded-lg shadow p-6"
          >
            {/* Origin with Map */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Starting Location
              </label>
              <MapLocationSelector
                value={originAddress}
                coordinates={originCoordinates}
                onChange={handleOriginChange}
                placeholder="Search or click on map to set starting location"
                error={errors.origin?.message}
                name="origin"
                register={register}
                mapHeight="300px"
              />
            </div>

            {/* Destination with Map */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Destination
              </label>
              <MapLocationSelector
                value={destinationAddress}
                coordinates={destinationCoordinates}
                onChange={handleDestinationChange}
                placeholder="Search or click on map to set destination"
                error={errors.destination?.message}
                name="destination"
                register={register}
                mapHeight="300px"
              />
            </div>

            {/* Departure Time */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Departure Time
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Clock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  {...register("departureTime")}
                  type="datetime-local"
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500"
                  min={minTime}
                />
              </div>
              {errors.departureTime && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.departureTime.message}
                </p>
              )}
            </div>

            {/* Seats */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Available Seats
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Users className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  {...register("totalSeats", { valueAsNumber: true })}
                  type="number"
                  min="1"
                  max="8"
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
              {errors.totalSeats && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.totalSeats.message}
                </p>
              )}
            </div>

            {/* Price */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Price per Seat
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <BadgeDollarSign className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  {...register("price", { valueAsNumber: true })}
                  type="number"
                  min="0"
                  step="0.01"
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
              {errors.price && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.price.message}
                </p>
              )}
            </div>

            <div className="flex items-center text-gray-600">
              <InformationCircleIcon className="mr-2 h-5 w-5" />
              Payments are received only through cash from the students.
            </div>

            {/* Submit Buttons */}
            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={() => navigate("/dashboard")}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 disabled:opacity-50"
              >
                {isSubmitting ? "Scheduling..." : "Schedule Ride"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default ScheduleRide;