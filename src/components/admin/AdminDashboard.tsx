// src/pages/admin/AdminDashboard.tsx
import React, { useEffect, useState } from 'react';
import { Users, Car, BarChart2 } from 'lucide-react';
import AdminLayout from '../../components/admin/AdminLayout';
import { UserRole } from '../../types';
import adminService from '../../services/adminService';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalDrivers: 0,
    totalRides: 0
  });

  useEffect(() => {
    const loadStats = async () => {
      try {
        const users = await adminService.getAllUsers();
        setStats({
          totalStudents: users.filter(user => user.role === UserRole.STUDENT).length,
          totalDrivers: users.filter(user => user.role === UserRole.DRIVER).length,
          totalRides: 0 // This would come from ride statistics
        });
      } catch (error) {
        console.error('Error loading stats:', error);
      }
    };

    loadStats();
  }, []);

  return (
    <AdminLayout currentPage="dashboard">
      <h1 className="text-2xl font-bold mb-8">Dashboard Overview</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Stats Cards */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <Users className="h-8 w-8 text-primary-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Students</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalStudents}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <Car className="h-8 w-8 text-primary-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Drivers</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalDrivers}</p>
            </div>
          </div>
        </div>

        {/* <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <BarChart2 className="h-8 w-8 text-primary-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Rides</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalRides}</p>
            </div>
          </div>
        </div> */}
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;