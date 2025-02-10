import { useState, useEffect } from "react";
import {
  Calendar,
  MapPin,
  School,
  Phone,
  BadgeDollarSign,
  Verified,
  Star,
  Users,
  Clock,
} from "lucide-react";
import Layout from "../../components/layout/Layout";
import { useAuth } from "../../contexts/AuthContext";
import { rideService, bookingService } from "../../services";
import { Ride, BookingStatus, Booking, User } from "../../types";
import { InformationCircleIcon } from "@heroicons/react/16/solid";
import ReviewService from "../../services/ReviewService";
import RatingDetailsModal from "./RatingDetailsModal";

const UserDashboard = () => {
  const { user } = useAuth();
  const [rides, setRides] = useState<Ride[]>([]);
  const [filteredRides, setFilteredRides] = useState<Ride[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [confirmedRides, setConfirmedRides] = useState<Booking[]>([]);
  const [isLoadingConfirmed, setIsLoadingConfirmed] = useState(true);
  const [pendingRides, setPendingRides] = useState<Booking[]>([]);
  const [waitlistedRides, setWaitlistedRides] = useState<Booking[]>([]);
  const [waitlistCounts, setWaitlistCounts] = useState<Record<string, number>>(
    {}
  );
  const [selectedDriver, setSelectedDriver] = useState<User | null>(null);
  const [driverReviews, setDriverReviews] = useState<Array<any>>([]);

  useEffect(() => {
    if (user?.phone) {
      loadUserRides();
      loadRides();
    }
  }, [user?.phone]);

  useEffect(() => {
    if (filteredRides.length > 0) {
      loadWaitlistCounts();
    }
  }, [filteredRides]);

  const loadWaitlistCounts = async () => {
    const counts: Record<string, number> = {};
    for (const ride of filteredRides) {
      try {
        const count = await bookingService.getWaitlistCount(ride.id);
        counts[ride.id] = count;
      } catch (error) {
        console.error(
          `Error loading waitlist count for ride ${ride.id}:`,
          error
        );
      }
    }
    setWaitlistCounts(counts);
  };

  const handleShowReviews = async (driver: User) => {
    try {
      const reviews = await ReviewService.getReviewsByRiderId(driver.phone);
      setDriverReviews(reviews);
      setSelectedDriver(driver);
    } catch (error) {
      console.error("Error fetching driver reviews:", error);
      alert("Failed to load reviews. Please try again.");
    }
  };

  const loadUserRides = async () => {
    try {
      if (!user?.phone) return;

      setIsLoadingConfirmed(true);
      const userBookings = await bookingService.getUserBookings(user.phone);

      const confirmed = userBookings.filter(
        (booking) =>
          booking.status === BookingStatus.CONFIRMED &&
          new Date(booking.ride.departureTime) > new Date()
      );

      const pending = userBookings.filter(
        (booking) =>
          booking.status === BookingStatus.PENDING &&
          new Date(booking.ride.departureTime) > new Date()
      );

      const waitlisted = userBookings.filter(
        (booking) =>
          booking.status === BookingStatus.WAITLISTED &&
          new Date(booking.ride.departureTime) > new Date()
      );

      setConfirmedRides(confirmed);
      setPendingRides(pending);
      setWaitlistedRides(waitlisted);
    } catch (error) {
      console.error("Error loading user rides:", error);
    } finally {
      setIsLoadingConfirmed(false);
    }
  };

  const loadRides = async () => {
    try {
      setIsLoading(true);
      const availableRides = await rideService.getAvailableRides();
      setRides(availableRides);
      setFilteredRides(availableRides);
    } catch (error) {
      console.error("Error loading rides:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRequestRide = async (ride: Ride) => {
    try {
      if (!user) return;
  
      const isWaitlisted = ride.availableSeats === 0;
      const bookingData = {
        ride: ride,
        passenger: user,
        status: isWaitlisted ? BookingStatus.WAITLISTED : BookingStatus.PENDING,
        bookingTime: new Date().toISOString(),
        waitlistPosition: isWaitlisted ? (waitlistCounts[ride.id] || 0) + 1 : undefined,
        waitlistExpiration: isWaitlisted 
          ? new Date(Date.now() + 60 * 60 * 1000).toISOString() 
          : undefined
      };
  
      await bookingService.createBooking(bookingData);
      alert(isWaitlisted 
        ? `Added to waitlist at position #${bookingData.waitlistPosition}` 
        : "Ride request sent successfully!");
      
      await loadUserRides();
      await loadWaitlistCounts();
    } catch (error) {
      console.error("Error requesting ride:", error);
      alert("Failed to request ride. Please try again.");
    }
  };

  const getNextWaitlistPosition = async (rideId: string): Promise<number> => {
    const count = await bookingService.getWaitlistCount(rideId);
    return count + 1;
  };

  const handleCancelRide = async (bookingId: string) => {
    try {
      await bookingService.updateBookingStatus(
        bookingId,
        BookingStatus.CANCELLED
      );
      alert("Ride request cancelled successfully!");
      await loadUserRides();
      await loadWaitlistCounts();
    } catch (error) {
      console.error("Error cancelling ride:", error);
      alert("Failed to cancel ride request. Please try again.");
    }
  };

  const handleCancelBooking = async (bookingId: string) => {
    try {
      await bookingService.cancelBooking(bookingId);
      await loadUserRides();
      await loadWaitlistCounts();
    } catch (error: any) {
      alert(error.message || "Failed to cancel booking");
    }
  };

  const formatDateTime = (dateTime: string) => {
    return new Date(dateTime).toLocaleString();
  };

  const renderWaitlistedRides = () => {
    if (waitlistedRides.length === 0) return null;

    return (
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Waitlisted Rides
        </h2>
        <div className="space-y-4">
          {waitlistedRides.map((booking) => (
            <div
              key={booking.id}
              className="bg-white rounded-lg shadow p-6 border-l-4 border-yellow-500"
            >
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-lg font-semibold">
                  Ride with {booking.ride.driver.firstName}
                </h3>
                <div className="flex flex-col items-end">
                  <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm">
                    Waitlisted #{booking.waitlistPosition}
                  </span>
                  {booking.waitlistExpiration && (
                    <span className="text-sm text-gray-500 mt-1">
                      Expires:{" "}
                      {new Date(
                        booking.waitlistExpiration
                      ).toLocaleTimeString()}
                    </span>
                  )}
                </div>
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
                  <BadgeDollarSign size={20} className="mr-2" />$
                  {booking.ride.price}
                </div>
                <button
                  onClick={() => handleCancelRide(booking.id)}
                  className="mt-4 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                >
                  Cancel Waitlist
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <Layout>
      <div className="container mx-auto px-2 py-2 mt-8">
        <div>
          <center>
            <h1 className="text-2xl items-center font-bold text-gray-900">
              Hello {user?.firstName}
            </h1>
          </center>
        </div>

        <div className="space-y-4">
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Available Rides
            </h2>
          </div>

          {isLoading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
            </div>
          ) : filteredRides.length === 0 ? (
            <div className="text-center py-8 bg-white rounded-lg shadow">
              <p className="text-gray-500">
                No rides available matching your criteria.
              </p>
            </div>
          ) : (
            filteredRides
              .sort(
                (a, b) =>
                  new Date(b.departureTime).getTime() -
                  new Date(a.departureTime).getTime()
              )
              .filter(
                (ride) =>
                  // Don't show rides that user has already requested or is waitlisted for
                  //!pendingRides.some((pendingBooking) => pendingBooking.ride.id === ride.id) &&
                  !waitlistedRides.some((waitlistedBooking) => waitlistedBooking.ride.id === ride.id) &&
                  // Don't show if confirmed
                  !confirmedRides.some((confirmedBooking) => confirmedBooking.ride.id === ride.id)
              )
              .map((ride) => (
                <div key={ride.id} className="bg-white rounded-lg shadow p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-semibold flex items-center">
                        {ride.driver.firstName} {ride.driver.lastName}
                        <Verified size={20} className="ml-2 text-green-500" />
                      </h3>
                      <button
                        onClick={() => handleShowReviews(ride.driver)}
                        className="flex items-center mt-1 text-sm text-gray-600 hover:text-primary-600"
                      >
                        <div className="flex items-center">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              size={16}
                              className={`${
                                star <= ride.driver.rating
                                  ? "text-yellow-400 fill-yellow-400"
                                  : "text-gray-300"
                              }`}
                            />
                          ))}
                        </div>
                        <span className="ml-2">
                          {ride.driver.rating.toFixed(1)} • Click to see reviews
                        </span>
                      </button>
                    </div>

                    <div className="flex items-center">
                      <span
                        className={`${
                          ride.availableSeats === 0
                            ? "text-yellow-600 bg-yellow-50"
                            : "text-green-600 bg-green-50"
                        } px-3 py-1 rounded-full text-sm font-medium`}
                      >
                        {ride.availableSeats === 0 ? (
                          <div className="flex items-center">
                            <Users className="h-4 w-4 mr-1" />
                            {waitlistCounts[ride.id] || 0} in waitlist
                          </div>
                        ) : (
                          `${ride.availableSeats} seats available`
                        )}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-gray-600">
                      <MapPin size={20} className="mr-2" />
                      {ride.origin} → {ride.destination}
                    </div>
                    <div className="flex items-center text-gray-600">
                      <School size={20} className="mr-2" />
                      {ride.driver.university}
                    </div>
                    <div className="flex items-center text-gray-600">
                      <Calendar size={20} className="mr-2" />
                      Departure: {formatDateTime(ride.departureTime)}
                    </div>
                    <div className="flex items-center text-gray-600">
                      <BadgeDollarSign size={20} className="mr-2" />$
                      {ride.price}
                    </div>
                    <div className="flex items-center text-gray-600">
                      <InformationCircleIcon className="mr-2 h-5 w-5" />
                      Due to our policy payments are accepted only through cash
                      to the rider.
                    </div>
                  </div>

                  {pendingRides.some(
                    (pendingBooking) => pendingBooking.ride.id === ride.id
                  ) ? (
                    <button
                      onClick={() => {
                        const pendingBooking = pendingRides.find(
                          (booking) => booking.ride.id === ride.id
                        );
                        if (pendingBooking) {
                          handleCancelRide(pendingBooking.id);
                        }
                      }}
                      className="w-auto py-2 px-4 rounded-md transition-colors bg-red-600 hover:bg-red-700 text-white"
                    >
                      Cancel Request
                    </button>
                  ) : (
                    <button
                      onClick={() => handleRequestRide(ride)}
                      disabled={
                        pendingRides.some((pendingBooking) => pendingBooking.ride.id === ride.id) ||
                        waitlistedRides.some((waitlistedBooking) => waitlistedBooking.ride.id === ride.id)
                      }
                      className={`w-auto py-2 px-4 rounded-md transition-colors ${
                        ride.availableSeats === 0
                          ? "bg-yellow-600 hover:bg-yellow-700"
                          : "bg-primary-600 hover:bg-primary-700"
                      } text-white`}
                    >
                      {ride.availableSeats === 0 ? "Join Waitlist" : "Request Ride"}
                    </button>
                  )}
                </div>
              ))
          )}
          {selectedDriver && (
            <RatingDetailsModal
              onClose={() => setSelectedDriver(null)}
              reviews={driverReviews}
              driverName={`${selectedDriver.firstName} ${selectedDriver.lastName}`}
            />
          )}
        </div>

        {/* Waitlisted Rides Section */}
        {renderWaitlistedRides()}

        {/* Confirmed Rides Section */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Upcoming Rides
          </h2>
          {isLoadingConfirmed ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
            </div>
          ) : confirmedRides.length === 0 ? (
            <div className="text-center py-8 bg-white rounded-lg shadow">
              <p className="text-gray-500">No confirmed rides.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {confirmedRides.map((booking) => (
                <div
                  key={booking.id}
                  className="bg-white rounded-lg shadow p-6 border-l-4 border-green-500"
                >
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-lg font-semibold">
                      Ride with {booking.ride.driver.firstName}
                    </h3>
                    <button
                      onClick={() => handleShowReviews(booking.ride.driver)}
                      className="flex items-center mt-1 text-sm text-gray-600 hover:text-primary-600"
                    >
                      <div className="flex items-center">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            size={16}
                            className={`${
                              star <= booking.ride.driver.rating
                                ? "text-yellow-400 fill-yellow-400"
                                : "text-gray-300"
                            }`}
                          />
                        ))}
                      </div>
                      <span className="ml-2">
                        {booking.ride.driver.rating.toFixed(1)} • Click to see
                        reviews
                      </span>
                    </button>
                    <h3 className="text-lg font-semibold flex items-center">
                      <Phone size={20} className="mr-2" />
                      {booking.ride.driver.phone}
                    </h3>
                    <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                      Confirmed
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
                      <BadgeDollarSign size={20} className="mr-2" />$
                      {booking.ride.price}
                    </div>
                    <div className="flex items-center text-gray-600">
                      <InformationCircleIcon className="mr-2 h-5 w-5" />
                      Due to our policy payments are accepted only through cash
                      to the rider.
                    </div>
                    {booking.ride.departureTime &&
                      new Date(booking.ride.departureTime).getTime() -
                        new Date().getTime() >
                        24 * 60 * 60 * 1000 && (
                        <button
                          onClick={() => handleCancelBooking(booking.id)}
                          className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 ml-auto"
                        >
                          Cancel Booking
                        </button>
                      )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default UserDashboard;
