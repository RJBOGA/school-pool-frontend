import api from './api';
import { Ride, ApiResponse } from '../types';

class RideService {
  private readonly BASE_PATH = '/rides';

  async createRide(rideData: Omit<Ride, 'id'>): Promise<ApiResponse<Ride>> {
    const response = await api.post<ApiResponse<Ride>>(this.BASE_PATH, rideData);
    return response.data;
  }

  async getRideById(id: string): Promise<Ride> {
    const response = await api.get<Ride>(`${this.BASE_PATH}/${id}`);
    return response.data;
  }

  async updateRide(id: string, updates: Partial<Ride>): Promise<Ride> {
    try {
      const response = await api.put<Ride>(`${this.BASE_PATH}/${id}`, updates);
      return response.data;
    } catch (error) {
      throw new Error('Failed to update ride');
    }
  }

  async deleteRide(id: string): Promise<void> {
    await api.delete(`${this.BASE_PATH}/${id}`);
  }

  async getUserRides(userId: string): Promise<Ride[]> {
    const response = await api.get<Ride[]>(`${this.BASE_PATH}/user/${userId}`);
    return response.data;
  }

  // Additional methods can be added here as needed
  async searchRides(params: {
    origin?: string;
    destination?: string;
    date?: string;
  }): Promise<Ride[]> {
    const response = await api.get<Ride[]>(this.BASE_PATH, { params });
    return response.data;
  }
}

export default new RideService();