import { useState, useEffect } from "react";
import {
  Calendar,
  MapPin,
  School,
  Phone,
  BadgeDollarSign,
  Verified,
} from "lucide-react";
import Layout from "../../components/layout/Layout";
import { useAuth } from "../../contexts/AuthContext";
import { rideService, bookingService } from "../../services";
import { Ride, BookingStatus, Booking } from "../../types";
import { InformationCircleIcon } from "@heroicons/react/16/solid";

const UserDashboard = () => {
  const { user } = useAuth();
  const [rides, setRides] = useState<Ride[]>([]);
  const [filteredRides, setFilteredRides] = useState<Ride[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm] = useState("");
  const [dateFilter] = useState("");
  const [priceSort] = useState<"asc" | "desc" | "">("");
  const [confirmedRides, setConfirmedRides] = useState<Booking[]>([]);
  const [rideHistory, setRideHistory] = useState<Booking[]>([]);
  const [isLoadingConfirmed, setIsLoadingConfirmed] = useState(true);
  const [isLoadingHistory, setIsLoadingHistory] = useState(true);

  const [pendingRides, setPendingRides] = useState<Booking[]>([]);

  useEffect(() => {
    if (user?.phone) {
      console.log("User loaded, fetching rides:", user.phone);
      loadUserRides();
      loadRides();
    }
  }, []);

  const handleCancelRide = async (bookingId: string) => {
    try {
      await bookingService.updateBookingStatus(
        bookingId,
        BookingStatus.CANCELLED
      );
      alert("Ride request cancelled successfully!");
      // Reload rides to update the UI
      loadUserRides();
    } catch (error) {
      console.error("Error cancelling ride:", error);
      alert("Failed to cancel ride request. Please try again.");
    }
  };

  const loadUserRides = async () => {
    try {
      if (!user?.phone) {
        console.log("No user phone available");
        return;
      }

      setIsLoadingConfirmed(true);
      setIsLoadingHistory(true);

      console.log("Loading rides for user:", user.phone);
      const userBookings = await bookingService.getUserBookings(user.phone);
      console.log("Received bookings:", userBookings);

      const confirmed = userBookings.filter((booking) => {
        console.log("Checking booking:", booking);
        return (
          booking.status === BookingStatus.CONFIRMED &&
          new Date(booking.ride.departureTime) > new Date()
        );
      });

      const history = userBookings.filter(
        (booking) =>
          booking.status === BookingStatus.COMPLETED ||
          new Date(booking.ride.departureTime) < new Date()
      );

      const pendingRides = userBookings.filter(
        (booking) =>
          booking.status === BookingStatus.PENDING &&
          new Date(booking.ride.departureTime) > new Date()
      );

      setConfirmedRides(confirmed);
      setRideHistory(history);
      setPendingRides(pendingRides);
    } catch (error) {
      console.error("Error loading user rides:", error);
    } finally {
      setIsLoadingConfirmed(false);
      setIsLoadingHistory(false);
    }
  };

  const loadRides = async () => {
    try {
      setIsLoading(true);
      const availableRides = await rideService.getAvailableRides();
      console.log(availableRides);
      setRides(availableRides);
      setFilteredRides(availableRides);
    } catch (error) {
      console.error("Error loading rides:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    let result = [...rides];

    setFilteredRides(result);
  }, [searchTerm, dateFilter, priceSort, rides]);

  const handleRequestRide = async (ride: Ride) => {
    try {
      if (!user) return;

      const bookingData = {
        ride: ride,
        passenger: user,
        status: BookingStatus.PENDING,
        bookingTime: new Date().toISOString(),
      };

      await bookingService.createBooking(bookingData);
      // Show success message or notification
      alert("Ride request sent successfully!");
      loadUserRides();
    } catch (error) {
      console.error("Error requesting ride:", error);
      alert("Failed to request ride. Please try again.");
    }
  };

  const formatDateTime = (dateTime: string) => {
    return new Date(dateTime).toLocaleString();
  };

  return (
    <Layout>
      <div className="container mx-auto px-2 py-2 mt-8">
        {/* Search and Filters */}

        <div>
          <center>
            <h1 className="text-2xl items-center font-bold text-gray-900">
              Hello {user?.firstName}
            </h1>
          </center>
        </div>

        {/* Rides List */}
        <div className="space-y-4">
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Available Rides
            </h2>
            {/* Your existing search, filters, and available rides list */}
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
            filteredRides.sort((a, b) => new Date(b.departureTime).getTime() - new Date(a.departureTime).getTime()) // Sort descending
              .filter(
                (ride) =>
                  !confirmedRides.some(
                    (confirmedRide) => confirmedRide.ride.id === ride.id
                  )
              )
              .map((ride) => (
                <div key={ride.id} className="bg-white rounded-lg shadow p-6">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-lg font-semibold flex items-center">
                      {ride.driver.firstName} {ride.driver.lastName}
                      <Verified size={20} className="ml-2 text-green-500" />
                    </h3>
                    <div className="flex items-center">
                      <span className="mr-2">
                        {ride.availableSeats} Seats Available
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
                    // Show Cancel button for pending rides
                    <button
                      onClick={() => {
                        const pendingBooking = pendingRides.find(
                          (booking) => booking.ride.id === ride.id
                        );
                        if (pendingBooking) {
                          handleCancelRide(pendingBooking.id);
                          loadRides();
                        }
                      }}
                      className="w-auto py-2 px-4 rounded-md transition-colors bg-red-600 hover:bg-red-700 text-white"
                    >
                      Cancel Request
                    </button>
                  ) : (
                    // Show Request button for non-pending rides
                    <button
                      onClick={() => handleRequestRide(ride)}
                      disabled={(() => {
                        const isDisabled = pendingRides.some(
                          (pendingBooking) => {
                            return pendingBooking.ride.id === ride.id;
                          }
                        );
                        return isDisabled;
                      })()}
                      className={`w-auto py-2 px-4 rounded-md transition-colors ${
                        pendingRides.some(
                          (pendingBooking) => pendingBooking.ride.id === ride.id
                        )
                          ? "bg-gray-400 cursor-not-allowed"
                          : "bg-primary-600 hover:bg-primary-700 text-white"
                      }`}
                    >
                      {pendingRides.some(
                        (pendingBooking) => pendingBooking.ride.id === ride.id
                      )
                        ? "Ride Request Pending"
                        : "Request Ride"}
                    </button>
                  )}
                </div>
              ))
          )}
        </div>
      </div>
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
                    Due to our policy payments are accepted only through cash to
                    the rider.
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default UserDashboard;
