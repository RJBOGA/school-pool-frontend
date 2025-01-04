// src/services/adminService.ts
import api from './api';
import { User, UserRole } from '../types';

class AdminService {
  private readonly BASE_PATH = '/api/admin';

  async getAllUsers(): Promise<User[]> {
    const response = await api.get(`${this.BASE_PATH}/users`);
    return response.data;
  }

  async getUsersByRole(role: UserRole): Promise<User[]> {
    const response = await api.get(`${this.BASE_PATH}/users/${role}`);
    return response.data;
  }

  async updateUser(id: string, userData: Partial<User>): Promise<User> {
    const response = await api.put(`${this.BASE_PATH}/users/${id}`, userData);
    return response.data;
  }

  async deleteUser(id: string): Promise<void> {
    await api.delete(`${this.BASE_PATH}/users/${id}`);
  }

  async verifyDriver(id: string): Promise<User> {
    const response = await api.put(`${this.BASE_PATH}/drivers/${id}/verify`);
    return response.data;
  }
}

export default new AdminService();