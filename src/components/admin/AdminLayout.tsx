// src/components/admin/AdminLayout.tsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, UserCog, LogOut } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

interface AdminLayoutProps {
  children: React.ReactNode;
  currentPage: 'dashboard' | 'students' | 'drivers';
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children, currentPage }) => {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <div className="w-64 bg-gray-800">
        <div className="p-4">
        <span className="text-3xl font-bold text-red-500">UCM</span>
              <span className="text-3xl font-bold text-primary-500 ml-2">
                SchoolPool
              </span><br></br>
              <span className="text-xl font-bold text-white ml-2">
                Admin Dashboard
              </span>
          {/* <h1 className="text-xl font-bold text-white">Admin Dashboard</h1> */}
        </div>
        <nav className="mt-8">
          <div className="px-2 space-y-1">
            <button
              onClick={() => navigate('/admin/dashboard')}
              className={`w-full flex items-center px-4 py-2 text-sm rounded-md ${
                currentPage === 'dashboard' 
                  ? 'bg-gray-900 text-primary-500' 
                  : 'text-primary-500 hover:bg-gray-700 hover:text-white'
              }`}
            >
              <Users className="mr-3 h-5 w-5" />
              <span>Dashboard</span>
            </button>
            <button
              onClick={() => navigate('/admin/students')}
              className={`w-full flex items-center px-4 py-2 text-sm rounded-md ${
                currentPage === 'students' 
                  ? 'bg-gray-900 text-primary-500' 
                  : 'text-primary-500 hover:bg-gray-700 hover:text-white'
              }`}
            >
              <Users className="mr-3 h-5 w-5" />
              <span>Students</span>
            </button>
            <button
              onClick={() => navigate('/admin/drivers')}
              className={`w-full flex items-center px-4 py-2 text-sm rounded-md ${
                currentPage === 'drivers' 
                  ? 'bg-gray-900 text-primary-500' 
                  : 'text-primary-500 hover:bg-gray-700 hover:text-white'
              }`}
            >
              <UserCog className="mr-3 h-5 w-5" />
              <span>Drivers</span>
            </button>
          </div>
        </nav>
        <div className="absolute bottom-4 w-64 px-2">
          <button
            onClick={handleLogout}
            className="w-full flex items-center px-4 py-2 text-sm text-primary-500 hover:bg-gray-700 hover:text-white rounded-md"
          >
            <LogOut className="mr-3 h-5 w-5" />
            <span>Logout</span>
          </button>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 overflow-auto">
        <div className="p-8">{children}</div>
      </div>
    </div>
  );
};

export default AdminLayout;