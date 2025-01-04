// src/pages/admin/StudentsManagement.tsx
import React, { useEffect, useState } from "react";
import AdminLayout from "../../components/admin/AdminLayout";
import UsersTable from "../../components/admin/UsersTable";
import { User, UserRole } from "../../types";
import adminService from "../../services/adminService";
import EditUserModal from "./EditUserModal";

const StudentsManagement = () => {
  const [students, setStudents] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [editingUser, setEditingUser] = useState<User | null>(null);

  const handleEditUser = (user: User) => {
    setEditingUser(user);
  };

  const handleSaveUser = async (updatedUser: User) => {
    try {
      await adminService.updateUser(updatedUser.phone, updatedUser);
      // Refresh the list
      await loadStudents();
      setEditingUser(null);
    } catch (error) {
      console.error("Error updating user:", error);
    }
  };

  useEffect(() => {
    loadStudents();
  }, []);

  const loadStudents = async () => {
    try {
      setIsLoading(true);
      const users = await adminService.getUsersByRole(UserRole.STUDENT);
      setStudents(users);
    } catch (error) {
      console.error("Error loading students:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteStudent = async (studentId: string) => {
    if (window.confirm("Are you sure you want to delete this student?")) {
      try {
        await adminService.deleteUser(studentId);
        await loadStudents();
      } catch (error) {
        console.error("Error deleting student:", error);
      }
    }
  };

  return (
    <AdminLayout currentPage="students">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Students Management</h1>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          </div>
        ) : (
          <UsersTable
            users={students}
            onEdit={handleEditUser}
            onDelete={handleDeleteStudent}
          />
        )}
        {editingUser && (
          <EditUserModal
            user={editingUser}
            onClose={() => setEditingUser(null)}
            onSave={handleSaveUser}
          />
        )}
      </div>
    </AdminLayout>
  );
};

export default StudentsManagement;
