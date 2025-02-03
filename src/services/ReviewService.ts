import api from "./api";

export interface Review {
  bookingId: string;
  riderId: string;
  reviewerId: string;
  rating: number;
  comment: string;
  rideId: string;
}

class ReviewService {
  private readonly BASE_PATH = "/reviews";

  async createReview(review: Review) {
    const response = await api.post(this.BASE_PATH, review);
    return response.data;
  }

  async getReviewsByRiderId(riderId: string) {
    const response = await api.get(`${this.BASE_PATH}/rider/${riderId}`);
    return response.data;
  }

  async getReviewsByReviewerId(reviewerId: string) {
    const response = await api.get(`${this.BASE_PATH}/reviewer/${reviewerId}`);
    return response.data;
  }

  async getUserRating(userId: string) {
    const response = await api.get(`${this.BASE_PATH}/rating/${userId}`);
    return response.data;
  }

  async canUserReview(bookingId: string, reviewerId: string) {
    const response = await api.get(`${this.BASE_PATH}/can-review`, {
      params: { bookingId, reviewerId },
    });
    return response.data;
  }
}

export default new ReviewService();
