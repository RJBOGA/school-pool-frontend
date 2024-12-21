import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { MapPin, Clock, Users, DollarSign } from 'lucide-react';
import Layout from '../../components/layout/Layout';
import { useAuth } from '../../contexts/AuthContext';
import { rideService } from '../../services';
import { RideStatus } from '../../types';

// Form validation schema
const scheduleRideSchema = z.object({
  origin: z.string().min(1, 'Starting location is required'),
  destination: z.string().min(1, 'Destination is required'),
  departureTime: z.string().min(1, 'Departure time is required'),
  totalSeats: z.number().min(1, 'Must offer at least 1 seat').max(8, 'Maximum 8 seats allowed'),
  price: z.number().min(0, 'Price must be positive').max(1000, 'Price too high'),
});

type ScheduleRideForm = z.infer<typeof scheduleRideSchema>;

const ScheduleRide = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<ScheduleRideForm>({
    resolver: zodResolver(scheduleRideSchema),
    defaultValues: {
      totalSeats: 1,
      price: 0
    }
  });

  const onSubmit = async (data: ScheduleRideForm) => {
    if (!user) return;

    try {
      setIsSubmitting(true);
      
      const rideData = {
        ...data,
        driver: user,
        status: RideStatus.SCHEDULED,
        availableSeats: data.totalSeats
      };

      await rideService.createRide(rideData);
      navigate('/dashboard');
    } catch (error) {
      console.error('Failed to schedule ride:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 mt-16">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Schedule a Ride</h1>

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
                  placeholder="Enter pickup location"
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
                  placeholder="Enter destination"
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

            {/* Submit Button */}
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
                {isSubmitting ? 'Scheduling...' : 'Schedule Ride'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default ScheduleRide;