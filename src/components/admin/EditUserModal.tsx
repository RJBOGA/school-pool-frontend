// src/components/admin/EditUserModal.tsx
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { User, UserRole } from '../../types';
import { X } from 'lucide-react';

const vehicleSchema = z.object({
  make: z.string().min(1, 'Make is required'),
  model: z.string().min(1, 'Model is required'),
  licensePlate: z.string().min(1, 'License plate is required'),
  driversLicense: z.string().min(1, 'Driver\'s license is required')
});

const userSchema = z.object({
  firstName: z.string().min(2, 'First name is required'),
  lastName: z.string().min(2, 'Last name is required'),
  email: z.string().email('Invalid email'),
  universityEmail: z.string().email('Invalid university email')
    .refine(email => email.endsWith('.edu'), {
      message: 'Must be a valid university email'
    }),
  university: z.string().min(2, 'University name is required'),
  vehicleDetails: z.array(vehicleSchema).optional()
});

type EditUserFormData = z.infer<typeof userSchema>;

interface EditUserModalProps {
  user: User;
  onClose: () => void;
  onSave: (user: User) => Promise<void>;
}

const EditUserModal: React.FC<EditUserModalProps> = ({ user, onClose, onSave }) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<EditUserFormData>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      universityEmail: user.universityEmail,
      university: user.university,
      vehicleDetails: user.vehicleDetails
    }
  });

  const onSubmit = async (data: EditUserFormData) => {
    try {
      const updatedUser = {
        ...user,
        ...data
      };
      await onSave(updatedUser);
      onClose();
    } catch (error) {
      console.error('Error updating user:', error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 overflow-y-auto">
      <div className="my-8 bg-white rounded-lg max-w-2xl w-full">
        {/* Modal Header - Fixed */}
        <div className="sticky top-0 bg-white px-6 py-4 border-b flex justify-between items-center rounded-t-lg">
          <h2 className="text-xl font-bold">
            Edit {user.role === UserRole.DRIVER ? 'Driver' : 'Student'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Modal Content - Scrollable */}
        <div className="px-6 py-4 max-h-[calc(100vh-16rem)] overflow-y-auto">
          <form id="editUserForm" onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Personal Information */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">First Name</label>
                <input
                  {...register('firstName')}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                />
                {errors.firstName && (
                  <p className="mt-1 text-sm text-red-600">{errors.firstName.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Last Name</label>
                <input
                  {...register('lastName')}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                />
                {errors.lastName && (
                  <p className="mt-1 text-sm text-red-600">{errors.lastName.message}</p>
                )}
              </div>
            </div>

            {/* Contact Information */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <input
                {...register('email')}
                type="email"
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">University Email</label>
              <input
                {...register('universityEmail')}
                type="email"
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                disabled
              />
              {errors.universityEmail && (
                <p className="mt-1 text-sm text-red-600">{errors.universityEmail.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">University</label>
              <input
                {...register('university')}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                disabled
              />
              {errors.university && (
                <p className="mt-1 text-sm text-red-600">{errors.university.message}</p>
              )}
            </div>

            {/* Vehicle Details for Drivers */}
            {user.role === UserRole.DRIVER && (
              <div className="border-t pt-4">
                <h3 className="text-lg font-medium mb-4">Vehicle Information</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Make</label>
                    <input
                      {...register('vehicleDetails.0.make')}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                    />
                    {errors.vehicleDetails?.[0]?.make && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.vehicleDetails[0].make.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Model</label>
                    <input
                      {...register('vehicleDetails.0.model')}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                    />
                    {errors.vehicleDetails?.[0]?.model && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.vehicleDetails[0].model.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">License Plate</label>
                    <input
                      {...register('vehicleDetails.0.licensePlate')}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                    />
                    {errors.vehicleDetails?.[0]?.licensePlate && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.vehicleDetails[0].licensePlate.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Driver's License</label>
                    <input
                      {...register('vehicleDetails.0.driversLicense')}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                      disabled
                    />
                    {errors.vehicleDetails?.[0]?.driversLicense && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.vehicleDetails[0].driversLicense.message}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}
          </form>
        </div>

        {/* Modal Footer - Fixed */}
        <div className="sticky bottom-0 bg-white px-6 py-4 border-t flex justify-end space-x-4 rounded-b-lg">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            form="editUserForm"
            type="submit"
            disabled={isSubmitting}
            className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 disabled:opacity-50"
          >
            {isSubmitting ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditUserModal;