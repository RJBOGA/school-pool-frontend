import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { UserRole } from '../../types';
import { userService } from '../../services';
import Layout from '../layout/Layout';

const vehicleSchema = z.object({
  make: z.string().min(1, 'Make is required'),
  model: z.string().min(1, 'Model is required'),
  licensePlate: z.string().min(1, 'License plate is required'),
  driversLicense: z.string().min(1, 'Driver\'s license is required')
 });
 
 const registerSchema = z.object({
  firstName: z.string().min(2, 'First name is required'),
  lastName: z.string().min(2, 'Last name is required'),
  email: z.string().email('Invalid email'),
  phone: z.string().min(10, 'Valid phone number is required'),
  universityEmail: z.string().email('Invalid university email')
    .refine(email => email.endsWith('.edu'), {
      message: 'Must be a valid university email'
    }),
  university: z.string().min(2, 'University name is required'),
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'Password must contain at least one uppercase letter, one lowercase letter, and one number'),
  confirmPassword: z.string(),
  role: z.nativeEnum(UserRole),
  vehicleDetails: z.array(vehicleSchema).optional(),
  rating: z.number().default(0),
  isDriverVerified: z.boolean().default(false)
 }).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
 });

 type RegisterFormData = z.infer<typeof registerSchema>;

 const Register = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [driverPhoto, setDriverPhoto] = useState<File | null>(null);
  const [licensePhoto, setLicensePhoto] = useState<File | null>(null);
 
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors }
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      role: UserRole.STUDENT,
      rating: 0,
      isDriverVerified: false
    }
  });

  const userRole = watch('role');

  const onSubmit = async (data: RegisterFormData) => {
    try {
      setIsSubmitting(true);
      const { confirmPassword, ...registerData } = data;
      await userService.register(registerData, driverPhoto || undefined, licensePhoto || undefined);
      navigate('/login');
      console.log('User Registration Successful');
    } catch (error) {
      console.error('Registration failed:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Layout>
      <div className="max-w mx-auto pt-2 pb-2 px-4 sm:px-6 lg:px-0">
        <div className="text-center">
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Create your account
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Already have an account?{' '}
          <Link to="/login" className="font-medium text-primary-600 hover:text-primary-500">
            Sign in
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            {/* Personal Information */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">First Name</label>
                <input
                  {...register('firstName')}
                  type="text"
                  placeholder="John"
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
                  type="text"
                  placeholder="Doe"
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                />
                {errors.lastName && (
                  <p className="mt-1 text-sm text-red-600">{errors.lastName.message}</p>
                )}
              </div>
            </div>

            {/* Contact Information */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Phone Number</label>
              <input
                {...register('phone')}
                type="tel"
                placeholder="(123) 456-7890"
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              />
              {errors.phone && (
                <p className="mt-1 text-sm text-red-600">{errors.phone.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Personal Email</label>
              <input
                {...register('email')}
                type="email"
                placeholder="john.doe@example.com"
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
              )}
            </div>

            {/* University Information */}
            <div>
              <label className="block text-sm font-medium text-gray-700">University Email</label>
              <input
                {...register('universityEmail')}
                type="email"
                placeholder="john.doe@university.edu"
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              />
              {errors.universityEmail && (
                <p className="mt-1 text-sm text-red-600">{errors.universityEmail.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">University</label>
              <input
                {...register('university')}
                type="text"
                placeholder="Your University Name"
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              />
              {errors.university && (
                <p className="mt-1 text-sm text-red-600">{errors.university.message}</p>
              )}
            </div>

            {/* Password Fields */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Password</label>
              <input
                {...register('password')}
                type="password"
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              />
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Confirm Password</label>
              <input
                {...register('confirmPassword')}
                type="password"
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              />
              {errors.confirmPassword && (
                <p className="mt-1 text-sm text-red-600">{errors.confirmPassword.message}</p>
              )}
            </div>

            {/* Role Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700">I want to</label>
              <select
                {...register('role')}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              >
                <option value={UserRole.STUDENT}>Find Rides</option>
                <option value={UserRole.DRIVER}>Give Rides</option>
              </select>
            </div>

            {/* Vehicle Details - Conditionally rendered */}
            {userRole === UserRole.DRIVER && (
                   <div className="space-y-4 animate-fadeIn">
                     <div className="border-t pt-4">
                       <h3 className="text-lg font-medium text-gray-900 mb-4">Vehicle Details</h3>
                       <div className="space-y-4">
                         {/* Make, Model, License Plate fields remain same */}
                         <div>
                      <label className="block text-sm font-medium text-gray-700">Manufacturing Company</label>
                      <input
                        {...register('vehicleDetails.0.make')}
                        placeholder="e.g., Toyota"
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
                        placeholder="e.g., Camry"
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
                        placeholder="e.g., ABC123"
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
                        placeholder="e.g., DL123456789"
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                      />
                      {errors.vehicleDetails?.[0]?.driversLicense && (
                        <p className="mt-1 text-sm text-red-600">
                          {errors.vehicleDetails[0].driversLicense.message}
                        </p>
                      )}
                    </div>
                         
                         {/* Add photo upload fields */}
                         <div>
                           <label className="block text-sm font-medium text-gray-700">
                             Driver Photo
                           </label>
                           <input
                             type="file"
                             accept="image/*"
                             onChange={(e) => setDriverPhoto(e.target.files?.[0] || null)}
                             className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                           />
                         </div>

                         <div>
                           <label className="block text-sm font-medium text-gray-700">
                             License Photo
                           </label>
                           <input
                             type="file"
                             accept="image/*"
                             onChange={(e) => setLicensePhoto(e.target.files?.[0] || null)}
                             className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                           />
                         </div>
                       </div>
                     </div>
                   </div>
                 )}

            <div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50"
              >
                {isSubmitting ? 'Registering...' : 'Register'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
    </div>
    </div>
    </Layout>
  );
};

export default Register;