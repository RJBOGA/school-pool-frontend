import api from "./api";
import { Ride, ApiResponse, RideStatus, BookingStatus } from "../types";
import bookingService from "./bookingService";

class RideService {
  private readonly BASE_PATH = "/rides";

  async createRide(rideData: Omit<Ride, "id">): Promise<ApiResponse<Ride>> {
    const response = await api.post<ApiResponse<Ride>>(
      this.BASE_PATH,
      rideData
    );
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
      throw new Error("Failed to update ride");
    }
  }

  // deleteRide in rideService.ts
  async deleteRide(id: string): Promise<void> {
    try {
      const confirmedBookings =
        await bookingService.getConfirmedBookingsForRide(id);

      for (const booking of confirmedBookings) {
        await bookingService.updateBookingStatus(
          booking.id,
          BookingStatus.CANCELLED
        );
      }

      await api.delete(`${this.BASE_PATH}/${id}`);
    } catch (error) {
      console.error("Error deleting ride:", error);
      throw error;
    }
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

  async getAvailableRides(): Promise<Ride[]> {
    try {
      const response = await api.get<Ride[]>(`${this.BASE_PATH}/available`);
      return response.data;
    } catch (error) {
      console.error("Error fetching available rides:", error);
      throw error;
    }
  }

  async updateRideStatus(id: string, status: RideStatus): Promise<Ride> {
    try {
      const response = await api.put<Ride>(
        `${this.BASE_PATH}/${id}/status`,
        null,
        {
          params: { status },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error updating ride status:", error);
      throw error;
    }
  }
}

export default new RideService();
