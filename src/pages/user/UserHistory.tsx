import { useEffect, useState } from "react";
import { Calendar, DollarSign, MapPin, Star } from "lucide-react";
import Layout from "../../components/layout/Layout";
import { useAuth } from "../../contexts/AuthContext";
import { Booking } from "../../types/models";
import bookingService from "../../services/bookingService";
import reviewService, { Review } from "../../services/ReviewService";
import { BookingStatus } from "../../types/enums";
import RateRideModal from "../user/RateRideModal";

const UserHistory = () => {
  const { user } = useAuth();
  const [rideHistory, setRideHistory] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [reviews, setReviews] = useState<{ [key: string]: Review }>({});

  useEffect(() => {
    if (user?.phone) {
      loadUserRides();
      loadUserReviews();
    }
  }, [user]);

  const loadUserReviews = async () => {
    if (!user) return;
    try {
      const userReviews = await reviewService.getReviewsByReviewerId(
        user.phone
      );
      const reviewMap = userReviews.reduce(
        (acc: { [key: string]: Review }, review: Review) => {
          acc[review.bookingId] = review;
          return acc;
        },
        {}
      );
      setReviews(reviewMap);
    } catch (error) {
      console.error("Error loading reviews:", error);
    }
  };

  const loadUserRides = async () => {
    try {
      setIsLoading(true);
      const userBookings = await bookingService.getUserBookings(user!.phone);

      // Separate completed and cancelled rides
      const completedRides = userBookings.filter(
        (booking) => booking.status === BookingStatus.COMPLETED
      );
      const cancelledRides = userBookings.filter(
        (booking) => booking.status === BookingStatus.CANCELLED
      );
      setRideHistory([...completedRides, ...cancelledRides]);
      //setRideHistory(history);
    } catch (error) {
      console.error("Error loading user rides:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRateRide = async (booking: Booking) => {
    const canReview = await reviewService.canUserReview(
      booking.id,
      user!.phone
    );
    if (canReview) {
      setSelectedBooking(booking);
    } else {
      alert("You've already reviewed this ride or the ride is not completed.");
    }
  };

  const handleSubmitReview = async (rating: number, comment: string) => {
    if (!selectedBooking || !user) return;

    const review = {
      bookingId: selectedBooking.id,
      riderId: selectedBooking.ride.driver.phone,
      reviewerId: user.phone,
      rating,
      comment,
      rideId: selectedBooking.ride.id,
    };

    await reviewService.createReview(review);
    setSelectedBooking(null);
    await Promise.all([loadUserRides(), loadUserReviews()]); // Reload both rides and reviews
  };

  const formatDateTime = (dateTime: string) => {
    return new Date(dateTime).toLocaleString();
  };

  const RatingDisplay = ({ bookingId }: { bookingId: string }) => {
    const review = reviews[bookingId];
    if (!review) return null;

    return (
      <div className="flex items-center mt-2">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            size={16}
            className={`${
              star <= review.rating
                ? "text-green-500 fill-green-500"
                : "text-gray-300"
            }`}
          />
        ))}
        <span className="ml-2 text-sm text-gray-600">{review.comment}</span>
      </div>
    );
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 mt-16">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Ride History
        </h2>
        {isLoading ? (
          <div className="text-center py-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
          </div>
        ) : rideHistory.length === 0 ? (
          <div className="text-center py-4 bg-white rounded-lg shadow">
            <p className="text-gray-500">No ride history.</p>
          </div>
        ) : (
          <>
          {rideHistory.filter((booking) => booking.status === BookingStatus.COMPLETED)
          .length > 0 && (
          <div className="mb-4">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">
                  Completed Rides
                </h3>
          <div className="space-y-4">
            {rideHistory.filter((booking)=> booking.status === BookingStatus.COMPLETED)
            .map((booking) => (
              <div
                key={booking.id}
                className="bg-white rounded-lg shadow p-6 opacity-75"
              >
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-lg font-semibold">
                    Ride with {booking.ride.driver.firstName}
                  </h3>
                  <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-sm">
                    {booking.status}
                  </span>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center text-gray-600">
                    <MapPin size={20} className="mr-2" />
                    {booking.ride.origin} → {booking.ride.destination}
                  </div>
                  <div className="flex items-center text-gray-600">
                    <Calendar size={20} className="mr-2" />
                    {formatDateTime(booking.ride.departureTime)}
                  </div>
                  <div className="flex items-center text-gray-600">
                    <DollarSign size={20} className="mr-2" />$
                    {booking.ride.price}
                  </div>
                  <RatingDisplay bookingId={booking.id} />
                  {booking.status === BookingStatus.COMPLETED &&
                    !reviews[booking.id] && (
                      <button
                        onClick={() => handleRateRide(booking)}
                        className="mt-2 flex items-center text-primary-600 hover:text-primary-700"
                      >
                        <Star size={20} className="mr-2" />
                        Rate this ride
                      </button>
                    )}
                </div>
              </div>
            ))}
          </div>
          </div>)}
          
          {/* CANCELLED */}
          {rideHistory.filter((booking) => booking.status === BookingStatus.CANCELLED).length > 0 && (
          <div className="mb-4">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">
                  Cancelled Rides
                </h3>
          <div className="space-y-4">
            {rideHistory
            .filter((booking) => booking.status === BookingStatus.CANCELLED)
            .map((booking) => (
              <div
                key={booking.id}
                className="bg-white rounded-lg shadow p-6 opacity-75"
              >
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-lg font-semibold">
                    Ride with {booking.ride.driver.firstName}
                  </h3>
                  <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-sm">
                    {booking.status}
                  </span>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center text-gray-600">
                    <MapPin size={20} className="mr-2" />
                    {booking.ride.origin} → {booking.ride.destination}
                  </div>
                  <div className="flex items-center text-gray-600">
                    <Calendar size={20} className="mr-2" />
                    {formatDateTime(booking.ride.departureTime)}
                  </div>
                  <div className="flex items-center text-gray-600">
                    <DollarSign size={20} className="mr-2" />$
                    {booking.ride.price}
                  </div>
                  <RatingDisplay bookingId={booking.id} />
                  {booking.status === BookingStatus.COMPLETED &&
                    !reviews[booking.id] && (
                      <button
                        onClick={() => handleRateRide(booking)}
                        className="mt-2 flex items-center text-primary-600 hover:text-primary-700"
                      >
                        <Star size={20} className="mr-2" />
                        Rate this ride
                      </button>
                    )}
                </div>
              </div>
            ))}
          </div>
          </div>
          )}
          </>
          
        )}

        {selectedBooking && (
          <RateRideModal
            onClose={() => setSelectedBooking(null)}
            onSubmit={handleSubmitReview}
            driverName={selectedBooking.ride.driver.firstName}
          />
        )}
      </div>
    </Layout>
  );
};

export default UserHistory;