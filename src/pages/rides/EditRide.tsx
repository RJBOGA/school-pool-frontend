import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { MapPin, Calendar, Clock, Users, DollarSign } from 'lucide-react';
import Layout from '../../components/layout/Layout';
import { useAuth } from '../../contexts/AuthContext';
import { rideService } from '../../services';
import { Ride, RideStatus } from '../../types';

const editRideSchema = z.object({
  origin: z.string().min(1, 'Starting location is required'),
  destination: z.string().min(1, 'Destination is required'),
  departureTime: z.string().min(1, 'Departure time is required'),
  totalSeats: z.number().min(1, 'Must offer at least 1 seat').max(8, 'Maximum 8 seats allowed'),
  price: z.number().min(0, 'Price must be positive').max(1000, 'Price too high'),
});

type EditRideForm = z.infer<typeof editRideSchema>;

const EditRide = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string>('');

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<EditRideForm>({
    resolver: zodResolver(editRideSchema)
  });

  // Load existing ride data
  useEffect(() => {
    const loadRide = async () => {
      try {
        if (!id) return;
        const ride = await rideService.getRideById(id);
        
        // Format the date for the datetime-local input
        const formattedDate = new Date(ride.departureTime)
          .toISOString()
          .slice(0, 16); // Format: YYYY-MM-DDTHH:mm

        reset({
          origin: ride.origin,
          destination: ride.destination,
          departureTime: formattedDate,
          totalSeats: ride.totalSeats,
          price: ride.price,
        });
      } catch (error) {
        console.error('Error loading ride:', error);
        setError('Failed to load ride details');
      } finally {
        setIsLoading(false);
      }
    };

    loadRide();
  }, [id, reset]);

  const onSubmit = async (data: EditRideForm) => {
    if (!id || !user) return;
  
    try {
      setIsSubmitting(true);
      setError('');
  
      // Only send fields that were changed
      const updatedFields: Partial<Ride> = {
        origin: data.origin,
        destination: data.destination,
        departureTime: new Date(data.departureTime).toISOString(),
        totalSeats: data.totalSeats,
        availableSeats: data.totalSeats, // Update available seats along with total seats
        price: data.price,
      };
  
      await rideService.updateRide(id, updatedFields);
      navigate('/dashboard');
    } catch (error) {
      console.error('Failed to update ride:', error);
      setError('Failed to update ride. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="flex justify-center items-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 mt-16">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Edit Ride</h1>

          {error && (
            <div className="mb-4 p-4 bg-red-50 text-red-600 rounded-md">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 bg-white rounded-lg shadow p-6">
            {/* Origin */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Starting Location
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MapPin className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  {...register('origin')}
                  type="text"
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
              {errors.origin && (
                <p className="mt-1 text-sm text-red-600">{errors.origin.message}</p>
              )}
            </div>

            {/* Destination */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Destination
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MapPin className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  {...register('destination')}
                  type="text"
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
              {errors.destination && (
                <p className="mt-1 text-sm text-red-600">{errors.destination.message}</p>
              )}
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
                  {...register('departureTime')}
                  type="datetime-local"
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
              {errors.departureTime && (
                <p className="mt-1 text-sm text-red-600">{errors.departureTime.message}</p>
              )}
            </div>

            {/* Number of Seats */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Available Seats
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Users className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  {...register('totalSeats', { valueAsNumber: true })}
                  type="number"
                  min="1"
                  max="8"
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
              {errors.totalSeats && (
                <p className="mt-1 text-sm text-red-600">{errors.totalSeats.message}</p>
              )}
            </div>

            {/* Price */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Price per Seat
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <DollarSign className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  {...register('price', { valueAsNumber: true })}
                  type="number"
                  min="0"
                  step="0.01"
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
              {errors.price && (
                <p className="mt-1 text-sm text-red-600">{errors.price.message}</p>
              )}
            </div>

            {/* Submit Buttons */}
            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={() => navigate('/dashboard')}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 disabled:opacity-50"
              >
                {isSubmitting ? 'Updating...' : 'Update Ride'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default EditRide;