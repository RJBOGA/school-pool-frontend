// src/services/rideUpdateService.ts
import api from './api';

export interface RideUpdate {
  rideId: string;
  message: string;
  timestamp: string;
}

class RideUpdateService {
  private readonly BASE_PATH = '/rides';

  async sendUpdate(update: RideUpdate): Promise<void> {
    await api.post(`${this.BASE_PATH}/${update.rideId}/update`, update);
  }
}

export default new RideUpdateService();