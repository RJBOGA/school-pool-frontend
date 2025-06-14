import api from './api';
import { User, RegisterRequest, ApiResponse, LoginRequest, UserRole } from '../types';

class UserService {
  private readonly BASE_PATH = '/users';

  // Add login method
  async userLogin(credentials: LoginRequest): Promise<User> {
    try {
      const response = await api.post<User>(`${this.BASE_PATH}/login`, credentials);
      console.log(response.data)
      const user = response.data;
      return user;
    } catch (error: any) {
      console.error('API Error:', error.response?.data || error.message);
      throw error;
    }
  }

  async register(userData: RegisterRequest, driverPhoto?: File, licensePhoto?: File): Promise<ApiResponse<User>> {
    try {
      const formData = new FormData();
      formData.append('userData', new Blob([JSON.stringify(userData)], { type: 'application/json' }));
      
      if (userData.role === UserRole.DRIVER) {
        if (driverPhoto) {
          const fileName = `${userData.phone}_driver${driverPhoto.name.substring(driverPhoto.name.lastIndexOf('.'))}`;
          formData.append('driverPhoto', driverPhoto, fileName);
        }
        if (licensePhoto) {
          const fileName = `${userData.phone}_license${licensePhoto.name.substring(licensePhoto.name.lastIndexOf('.'))}`;
          formData.append('licensePhoto', licensePhoto, fileName);
        }
      }
  
      console.log('FormData content:', [...formData.entries()]);
  
      const response = await api.post<ApiResponse<User>>(`${this.BASE_PATH}/register`, formData, {
        headers: { 
          'Content-Type': 'multipart/form-data'
        }
      });
      return response.data;
    } catch (error: any) {
      console.error('API Error:', error.response?.data || error.message);
      throw error;
    }
  }

  async getUserById(id: string): Promise<User> {
    try {
      const response = await api.get<User>(`${this.BASE_PATH}/${id}`);
      const user = response.data;
  
      if (user.role === UserRole.DRIVER && user.vehicleDetails) {
        user.vehicleDetails = user.vehicleDetails.map(vehicle => ({
          ...vehicle,
          driverPhotoPath: vehicle.driverPhotoPath ? `${vehicle.driverPhotoPath}` : undefined,
          licensePhotoPath: vehicle.licensePhotoPath ? `${vehicle.licensePhotoPath}` : undefined
        }));
      }
  
      return user;
    } catch (error) {
      console.error('Error fetching user:', error);
      throw error;
    }
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