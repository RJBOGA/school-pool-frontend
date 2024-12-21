import api from './api';
import { User, RegisterRequest, ApiResponse, LoginRequest, LoginResponse } from '../types';

class UserService {
  private readonly BASE_PATH = '/users';

  // Add login method
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    try {
      const response = await api.post<LoginResponse>(`${this.BASE_PATH}/login`, credentials);
      return response.data;
    } catch (error: any) {
      // Handle different types of errors
      if (error.response?.status === 401) {
        return {
          success: false,
          message: 'Invalid credentials'
        };
      }
      return {
        success: false,
        message: 'An error occurred during login'
      };
    }
  }

  async register(userData: RegisterRequest): Promise<ApiResponse<User>> {
    const response = await api.post<ApiResponse<User>>(`${this.BASE_PATH}/register`, userData);
    return response.data;
  }

  async getUserById(id: string): Promise<User> {
    const response = await api.get<User>(`${this.BASE_PATH}/${id}`);
    return response.data;
  }

  async updateUser(id: string, userData: Partial<User>): Promise<User> {
    const response = await api.put<User>(`${this.BASE_PATH}/${id}`, userData);
    return response.data;
  }

  async deleteUser(id: string): Promise<void> {
    await api.delete(`${this.BASE_PATH}/${id}`);
  }
}

export default new UserService();