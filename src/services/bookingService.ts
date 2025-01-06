import api from "./api";
import { Booking, ApiResponse, BookingStatus } from "../types";

class BookingService {
  private readonly BASE_PATH = "/bookings";

  async createBooking(
    bookingData: Omit<Booking, "id">
  ): Promise<ApiResponse<Booking>> {
    const response = await api.post<ApiResponse<Booking>>(
      this.BASE_PATH,
      bookingData
    );
    return response.data;
  }

  async getBookingById(id: string): Promise<Booking> {
    const response = await api.get<Booking>(`${this.BASE_PATH}/${id}`);
    return response.data;
  }

  // async getUserBookings(userId: string): Promise<Booking[]> {
  //   const response = await api.get<Booking[]>(`${this.BASE_PATH}/user/${userId}`);
  //   return response.data;
  // }

  async getUserBookings(userId: string): Promise<Booking[]> {
    try {
      console.log("Fetching bookings for user:", userId);
      const response = await api.get<Booking[]>(
        `${this.BASE_PATH}/user/${userId}`
      );
      console.log("Received bookings:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error fetching user bookings:", error);
      throw error;
    }
  }

  async updateBookingStatus(id: string, status: string): Promise<Booking> {
    const response = await api.put<Booking>(
      `${this.BASE_PATH}/${id}/status?status=${status}`,  // Note: Changed to query parameter
    );
    return response.data;
}

  async cancelBooking(id: string): Promise<void> {
    await api.delete(`${this.BASE_PATH}/${id}`);
  }

  // Fix the URL to include phone parameter
  async getDriverPendingBookings(driverPhone: string): Promise<Booking[]> {
    try {
      const response = await api.get<Booking[]>(
        `${this.BASE_PATH}/driver/${driverPhone}/pending`
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching pending bookings:", error);
      throw error;
    }
  }

  async getDriverBookings(driverPhone: string): Promise<Booking[]> {
    try {
      const response = await api.get<Booking[]>(`${this.BASE_PATH}/driver/${driverPhone}/all`);
      return response.data;
    } catch (error) {
      console.error('Error fetching driver bookings:', error);
      throw error;
    }
  }

  async respondToBooking(
    bookingId: string,
    status: BookingStatus
  ): Promise<Booking> {
    try {
      const response = await api.put<Booking>(
        `${this.BASE_PATH}/${bookingId}/status`,
        null,
        { params: { status } }
      );
      return response.data;
    } catch (error) {
      console.error("Error updating booking status:", error);
      throw error;
    }
  }
}

export default new BookingService();
