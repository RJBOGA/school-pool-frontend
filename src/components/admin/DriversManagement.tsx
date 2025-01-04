// src/pages/admin/DriversManagement.tsx
import React, { useEffect, useState } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import UsersTable from '../../components/admin/UsersTable';
import { User, UserRole } from '../../types';
import adminService from '../../services/adminService';

const DriversManagement = () => {
  const [drivers, setDrivers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadDrivers();
  }, []);

  const loadDrivers = async () => {
    try {
      setIsLoading(true);
      const users = await adminService.getUsersByRole(UserRole.DRIVER);
      setDrivers(users);
    } catch (error) {
      console.error('Error loading drivers:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditDriver = (driver: User) => {
    // Implement edit functionality
    console.log('Edit driver:', driver);
  };

  const handleDeleteDriver = async (driverId: string) => {
    if (window.confirm('Are you sure you want to delete this driver?')) {
      try {
        await adminService.deleteUser(driverId);
        await loadDrivers();
      } catch (error) {
        console.error('Error deleting driver:', error);
      }
    }
  };

  const handleVerifyDriver = async (driverId: string) => {
    try {
      await adminService.verifyDriver(driverId);
      await loadDrivers();
    } catch (error) {
      console.error('Error verifying driver:', error);
    }
  };

  return (
    <AdminLayout currentPage="drivers">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Drivers Management</h1>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          </div>
        ) : (
          <UsersTable
            users={drivers}
            onEdit={handleEditDriver}
            onDelete={handleDeleteDriver}
            onVerify={handleVerifyDriver}
            showVerification={true}
          />
        )}
      </div>
    </AdminLayout>
  );
};

export default DriversManagement;