// src/components/admin/UsersTable.tsx
import React, { useState } from 'react';
import { User } from '../../types';
import { Edit2, Trash2, Eye, X, CheckCircle2 } from 'lucide-react';

interface UsersTableProps {
  users: User[];
  onEdit: (user: User) => void;
  onDelete: (userId: string) => void;
  onVerify?: (userId: string) => void;
  showVerification?: boolean;
}

const UsersTable: React.FC<UsersTableProps> = ({
  users,
  onEdit,
  onDelete,
  onVerify,
  showVerification = false
}) => {
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const getImageUrl = (path: string | undefined) => {
    if (!path) return '';
    return `http://localhost:8081/images/${path}`;
  };

  const DetailsModal = ({ user }: { user: User }) => (
    
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-4xl w-full p-6 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-xl font-bold">Driver Details</h3>
            <p className="text-gray-600">
              {user.firstName} {user.lastName}
            </p>
          </div>
          <button 
            onClick={() => setSelectedUser(null)}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Driver Photos */}
          <div className="space-y-2">
            <h4 className="font-semibold">Driver Photo</h4>
            {user.vehicleDetails?.[0]?.driverPhotoPath ? (
              <img 
                src={getImageUrl(user.vehicleDetails[0].driverPhotoPath)} 
                alt="Driver"
                className="w-full h-64 object-cover rounded-lg border"
              />
            ) : (
              <div className="w-full h-64 bg-gray-100 flex items-center justify-center rounded-lg border">
                <p className="text-gray-500">No driver photo provided</p>
              </div>
            )}
          </div>

          <div className="space-y-2">
            <h4 className="font-semibold">License Photo</h4>
            {user.vehicleDetails?.[0]?.licensePhotoPath ? (
                
              <img 
                src={getImageUrl(user.vehicleDetails[0].licensePhotoPath)} 
                alt="License"
                className="w-full h-64 object-cover rounded-lg border"
              />
            ) : (
              <div className="w-full h-64 bg-gray-100 flex items-center justify-center rounded-lg border">
                <p className="text-gray-500">No license photo provided</p>
              </div>
            )}
          </div>

          {/* Contact Information */}
          <div className="md:col-span-2">
            <h4 className="font-semibold mb-2">Contact Information</h4>
            <div className="bg-gray-50 p-4 rounded-lg">
              <dl className="grid grid-cols-2 gap-4">
                <div>
                  <dt className="text-sm text-gray-600">Phone</dt>
                  <dd>{user.phone}</dd>
                </div>
                <div>
                  <dt className="text-sm text-gray-600">Email</dt>
                  <dd>{user.email}</dd>
                </div>
                <div>
                  <dt className="text-sm text-gray-600">University</dt>
                  <dd>{user.university}</dd>
                </div>
                <div>
                  <dt className="text-sm text-gray-600">University Email</dt>
                  <dd>{user.universityEmail}</dd>
                </div>
              </dl>
            </div>
          </div>

          {/* Vehicle Details */}
          {user.vehicleDetails?.[0] && (
            <div className="md:col-span-2">
              <h4 className="font-semibold mb-2">Vehicle Information</h4>
              <div className="bg-gray-50 p-4 rounded-lg">
                <dl className="grid grid-cols-2 gap-4">
                  <div>
                    <dt className="text-sm text-gray-600">Make</dt>
                    <dd>{user.vehicleDetails[0].make}</dd>
                  </div>
                  <div>
                    <dt className="text-sm text-gray-600">Model</dt>
                    <dd>{user.vehicleDetails[0].model}</dd>
                  </div>
                  <div>
                    <dt className="text-sm text-gray-600">License Plate</dt>
                    <dd>{user.vehicleDetails[0].licensePlate}</dd>
                  </div>
                  <div>
                    <dt className="text-sm text-gray-600">Driver's License</dt>
                    <dd>{user.vehicleDetails[0].driversLicense}</dd>
                  </div>
                </dl>
              </div>
            </div>
          )}
        </div>

        {showVerification && !user.isDriverVerified && (
          <div className="mt-6 flex justify-end space-x-4">
            <button
              onClick={() => setSelectedUser(null)}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                onVerify?.(user.phone);
                setSelectedUser(null);
              }}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
            >
              Verify Driver
            </button>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Name
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Phone
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Email
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              University
            </th>
            {showVerification && (
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Verified
              </th>
            )}
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {users.map((user) => (
            <tr key={user.phone} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm font-medium text-gray-900">
                  {user.firstName} {user.lastName}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {user.phone}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {user.email}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {user.university}
              </td>
              {showVerification && (
                <td className="px-6 py-4 whitespace-nowrap">
                  {user.isDriverVerified ? (
                    <span className="flex items-center text-green-600">
                      <CheckCircle2 className="h-5 w-5 mr-1" />
                      Verified
                    </span>
                  ) : (
                    <button
                      onClick={() => setSelectedUser(user)}
                      className="flex items-center text-primary-600 hover:text-primary-900"
                    >
                      <Eye className="h-5 w-5 mr-1" />
                      View Details
                    </button>
                  )}
                </td>
              )}
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => onEdit(user)}
                    className="text-primary-600 hover:text-primary-900"
                    title="Edit user"
                  >
                    <Edit2 className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => onDelete(user.phone)}
                    className="text-red-600 hover:text-red-900"
                    title="Delete user"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {selectedUser && <DetailsModal user={selectedUser} />}
    </div>
  );
};

export default UsersTable;