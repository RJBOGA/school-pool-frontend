import api from './api';
import { Booking, ApiResponse } from '../types';

class BookingService {
  private readonly BASE_PATH = '/bookings';

  async createBooking(bookingData: Omit<Booking, 'id'>): Promise<ApiResponse<Booking>> {
    const response = await api.post<ApiResponse<Booking>>(this.BASE_PATH, bookingData);
    return response.data;
  }

  async getBookingById(id: string): Promise<Booking> {
    const response = await api.get<Booking>(`${this.BASE_PATH}/${id}`);
    return response.data;
  }

  async getUserBookings(userId: string): Promise<Booking[]> {
    const response = await api.get<Booking[]>(`${this.BASE_PATH}/user/${userId}`);
    return response.data;
  }

  async updateBookingStatus(id: string, status: string): Promise<Booking> {
    const response = await api.patch<Booking>(`${this.BASE_PATH}/${id}/status`, { status });
    return response.data;
  }

  async cancelBooking(id: string): Promise<void> {
    await api.delete(`${this.BASE_PATH}/${id}`);
  }
}

export default new BookingService();