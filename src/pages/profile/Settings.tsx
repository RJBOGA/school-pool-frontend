import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Layout from '../../components/layout/Layout';
import { useAuth } from '../../contexts/AuthContext';
import { userService } from '../../services';
import { UserRole } from '../../types';

// Form validation schema
const settingsSchema = z.object({
  firstName: z.string().min(2, 'First name is required'),
  lastName: z.string().min(2, 'Last name is required'),
  email: z.string().email('Invalid email'),
  phone: z.string().min(10, 'Valid phone number is required'),
  universityEmail: z.string().email('Invalid university email')
    .refine(email => email.endsWith('.edu'), {
      message: 'Must be a valid university email'
    }),
  university: z.string().min(2, 'University name is required'),
  // Only required for drivers
  vehicleDetails: z.array(
    z.object({
      make: z.string().min(1, 'Make is required'),
      model: z.string().min(1, 'Model is required'),
      licensePlate: z.string().min(1, 'License plate is required'),
      driversLicense: z.string().min(1, 'Driver\'s license is required')
    })
  ).optional()
});

type SettingsFormData = z.infer<typeof settingsSchema>;

const Settings = () => {
  const navigate = useNavigate();
  const { user, setUser } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<SettingsFormData>({
    resolver: zodResolver(settingsSchema),
    defaultValues: {
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      email: user?.email || '',
      phone: user?.phone || '',
      universityEmail: user?.universityEmail || '',
      university: user?.university || '',
      vehicleDetails: user?.vehicleDetails || []
    }
  });

  const onSubmit = async (data: SettingsFormData) => {
    if (!user?.phone) return;

    try {
      setIsSubmitting(true);
      setError('');

      const updatedUser = await userService.updateUser(user.phone, {
        ...user,
        ...data,
      });

      setUser(updatedUser);
      navigate('/profile');
    } catch (error) {
      console.error('Failed to update profile:', error);
      setError('Failed to update profile. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 mt-16">
        <div className="max-w-2xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-2xl font-bold text-gray-900">Profile Settings</h1>
            <button
              onClick={() => navigate('/profile')}
              className="text-gray-600 hover:text-gray-900"
            >
              Cancel
            </button>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-md">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Personal Information */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-medium mb-4">Personal Information</h2>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      First Name
                    </label>
                    <input
                      {...register('firstName')}
                      className="w-full p-2 border rounded-md focus:ring-primary-500 focus:border-primary-500"
                    />
                    {errors.firstName && (
                      <p className="mt-1 text-sm text-red-600">{errors.firstName.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Last Name
                    </label>
                    <input
                      {...register('lastName')}
                      className="w-full p-2 border rounded-md focus:ring-primary-500 focus:border-primary-500"
                    />
                    {errors.lastName && (
                      <p className="mt-1 text-sm text-red-600">{errors.lastName.message}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number
                  </label>
                  <input
                    {...register('phone')}
                    disabled
                    type="tel"
                    className="w-full p-2 border rounded-md focus:ring-primary-500 focus:border-primary-500"
                  />
                  {errors.phone && (
                    <p className="mt-1 text-sm text-red-600">{errors.phone.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    {...register('email')}
                    type="email"
                    className="w-full p-2 border rounded-md focus:ring-primary-500 focus:border-primary-500"
                  />
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
                  )}
                </div>
              </div>
            </div>

            {/* University Information */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-medium mb-4">University Information</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    University Email
                  </label>
                  <input
                    {...register('universityEmail')}
                    type="email"
                    disabled
                    className="w-full p-2 border rounded-md focus:ring-primary-500 focus:border-primary-500"
                  />
                  {errors.universityEmail && (
                    <p className="mt-1 text-sm text-red-600">{errors.universityEmail.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    University
                  </label>
                  <input
                    {...register('university')}
                    className="w-full p-2 border rounded-md focus:ring-primary-500 focus:border-primary-500"
                  />
                  {errors.university && (
                    <p className="mt-1 text-sm text-red-600">{errors.university.message}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Vehicle Information - Only for drivers */}
            {user?.role === UserRole.DRIVER && (
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-lg font-medium mb-4">Vehicle Information</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Make
                    </label>
                    <input
                      {...register('vehicleDetails.0.make')}
                      className="w-full p-2 border rounded-md focus:ring-primary-500 focus:border-primary-500"
                    />
                    {errors.vehicleDetails?.[0]?.make && (
                      <p className="mt-1 text-sm text-red-600">{errors.vehicleDetails[0].make.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Model
                    </label>
                    <input
                      {...register('vehicleDetails.0.model')}
                      className="w-full p-2 border rounded-md focus:ring-primary-500 focus:border-primary-500"
                    />
                    {errors.vehicleDetails?.[0]?.model && (
                      <p className="mt-1 text-sm text-red-600">{errors.vehicleDetails[0].model.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      License Plate
                    </label>
                    <input
                      {...register('vehicleDetails.0.licensePlate')}
                      className="w-full p-2 border rounded-md focus:ring-primary-500 focus:border-primary-500"
                    />
                    {errors.vehicleDetails?.[0]?.licensePlate && (
                      <p className="mt-1 text-sm text-red-600">{errors.vehicleDetails[0].licensePlate.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Driver's License
                    </label>
                    <input
                      {...register('vehicleDetails.0.driversLicense')}
                      className="w-full p-2 border rounded-md focus:ring-primary-500 focus:border-primary-500"
                    />
                    {errors.vehicleDetails?.[0]?.driversLicense && (
                      <p className="mt-1 text-sm text-red-600">{errors.vehicleDetails[0].driversLicense.message}</p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Submit Button */}
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 disabled:opacity-50"
              >
                {isSubmitting ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default Settings;