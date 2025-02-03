import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Plus,
  Calendar,
  MapPin,
  Users,
  Edit2,
  Clock,
  Trash2,
  Phone,
  User,
  CheckCircle,
  XCircle,
  AlertCircle,
} from "lucide-react";
import Layout from "../../components/layout/Layout";
import { rideService, bookingService, userService } from "../../services";
import { useAuth } from "../../contexts/AuthContext";
import { Ride, RideStatus, Booking, BookingStatus } from "../../types";
import { InformationCircleIcon } from "@heroicons/react/16/solid";
import PreRideUpdate from "./PreRideUpdate";
import { toast } from "react-toastify";

const RiderDashboard: React.FC = () => {
  const [rides, setRides] = useState<Ride[]>([]);
  const [pendingBookings, setPendingBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingBookings, setIsLoadingBookings] = useState(true);
  const [error, setError] = useState<string>("");
  const navigate = useNavigate();
  const { user, setUser } = useAuth();
  const [confirmedBookings, setConfirmedBookings] = useState<Booking[]>([]);
  const [today, setToday] = useState(new Date());
  const [currentTime, setCurrentTime] = useState(new Date());
  const hasNoFutureRides =
    rides.length === 0 ||
    rides.every(
      (ride) => new Date(ride.departureTime).getTime() <= today.getTime()
    );

  const checkVerificationStatus = async () => {
    if (user?.phone) {
      try {
        const response = await userService.getUserById(user.phone);
        if (response.isDriverVerified !== user.isDriverVerified) {
          const updatedUser = {
            ...user,
            isDriverVerified: response.isDriverVerified,
          };
          setUser(updatedUser);
          localStorage.setItem("user", JSON.stringify(updatedUser));
        }
      } catch (error) {
        console.error("Error checking verification status:", error);
      }
    }
  };

  const canDeleteRide = (departureTime: string): boolean => {
    const departure = new Date(departureTime);
    const hourBeforeDeparture = new Date(departure.getTime() - 60 * 60 * 1000);
    return currentTime < hourBeforeDeparture;
  };

  const canEditRide = (confirmed: Booking[]): boolean => {
    return confirmed.length <= 0;
  };

  const handleDeleteRide = async (ride: Ride) => {
    if (!canDeleteRide(ride.departureTime)) {
      alert("Rides can only be cancelled at least 1 hour before departure");
      return;
    }

    if (window.confirm("Are you sure you want to cancel this ride?")) {
      try {
        await rideService.deleteRide(ride.id);
        loadRides();
      } catch (error) {
        console.error("Error deleting ride:", error);
      }
    }
  };

  useEffect(() => {
    if (user?.phone) {
      loadRides();
      loadPendingBookings();
      checkVerificationStatus();
    }
  }, [user]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setToday(new Date());
    }, 1000); // Update every second

    return () => clearInterval(intervalId);
  }, []);

  const loadRides = async () => {
    try {
      setIsLoading(true);
      setError("");
      const userRides = await rideService.getUserRides(user!.phone);
      console.log(userRides);
      setRides(userRides);
    } catch (error) {
      console.error("Error loading rides:", error);
      setError("Failed to load rides. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  // Add loading function for confirmed bookings
  const loadConfirmedBookings = async () => {
    try {
      if (!user?.phone) return;
      const bookings = await bookingService.getDriverBookings(user.phone);
      const confirmed = bookings.filter(
        (booking) => booking.status === BookingStatus.CONFIRMED
      );
      setConfirmedBookings(confirmed);
    } catch (error) {
      console.error("Error loading confirmed bookings:", error);
    }
  };

  // Add to useEffect
  useEffect(() => {
    if (user?.phone) {
      loadRides();
      loadPendingBookings();
      loadConfirmedBookings();
    }
  }, [user]);

  const loadPendingBookings = async () => {
    try {
      setIsLoadingBookings(true);
      if (user?.phone) {
        // Add a check for user existence
        const bookings = await bookingService.getDriverPendingBookings(
          user.phone
        );
        setPendingBookings(bookings);
      }
    } catch (error) {
      console.error("Error loading pending bookings:", error);
    } finally {
      setIsLoadingBookings(false);
    }
  };

  const handleBookingResponse = async (
    bookingId: string,
    status: BookingStatus
  ) => {
    try {
      await bookingService.respondToBooking(bookingId, status);
      // Refresh both bookings and rides
      loadPendingBookings();
      loadRides();
      loadConfirmedBookings();
    } catch (error) {
      console.error("Error updating booking:", error);
    }
  };

  const canStartRide = (departureTime: string): boolean => {
    const fifteenMinutesBefore = new Date(departureTime);
    fifteenMinutesBefore.setMinutes(fifteenMinutesBefore.getMinutes() - 15);
    return new Date() >= fifteenMinutesBefore;
  };

  const handleUpdateRideStatus = async (rideId: string, status: RideStatus) => {
    try {
      await rideService.updateRideStatus(rideId, status);
      loadRides(); // Refresh the rides list
    } catch (error) {
      console.error("Error updating ride status:", error);
      alert("Failed to update ride status");
    }
  };

  const formatDateTime = (dateTime: string) => {
    return new Date(dateTime).toLocaleString();
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-2 mt-16">
        <div>
          <center>
            <h1 className="text-2xl items-center font-bold text-gray-900">
              Hello {user?.firstName}
            </h1>
          </center>
        </div>
        {/* Pending Bookings Section */}
        {!isLoadingBookings && pendingBookings.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Pending Ride Requests ({pendingBookings.length})
            </h2>
            <div className="grid gap-4">
              {pendingBookings.map((booking) => (
                <div
                  key={booking.id}
                  className="bg-yellow-50 border border-yellow-100 rounded-lg p-4"
                >
                  <div className="flex justify-between items-start">
                    <div className="space-y-2">
                      <div className="flex items-center">
                        <Users className="h-5 w-5 text-gray-400 mr-2" />
                        <span className="font-medium">
                          {booking.passenger.firstName}{" "}
                          {booking.passenger.lastName}
                        </span>
                      </div>
                      <div className="text-sm text-gray-600">
                        <div className="flex items-center">
                          <MapPin className="h-4 w-4 mr-1" />
                          {booking.ride.origin} → {booking.ride.destination}
                        </div>
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 mr-1" />
                          Departure:{" "}
                          {formatDateTime(booking.ride.departureTime)}
                        </div>
                        <div>
                          Requested: {formatDateTime(booking.bookingTime)}
                        </div>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() =>
                          handleBookingResponse(
                            booking.id,
                            BookingStatus.CONFIRMED
                          )
                        }
                        className="px-3 py-1 bg-green-600 text-white rounded-md hover:bg-green-700 text-sm"
                        title="Accept request"
                      >
                        Accept
                      </button>
                      <button
                        onClick={() =>
                          handleBookingResponse(
                            booking.id,
                            BookingStatus.CANCELLED
                          )
                        }
                        className="px-3 py-1 bg-red-600 text-white rounded-md hover:bg-red-700 text-sm"
                        title="Reject request"
                      >
                        Reject
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Error Message */}
        {error ? (
          <div className="text-red-600 text-center py-8">
            {error}
            <button
              onClick={loadRides}
              className="ml-4 text-primary-600 hover:text-primary-700 underline"
            >
              Try again
            </button>
          </div>
        ) : (
          <>
            <div className="flex justify-between items-center mb-8">
              <h1 className="text-2xl font-bold text-gray-900">
                Scheduled Rides
              </h1>
              <button
                onClick={() => {
                  if (!user?.isDriverVerified) {
                    // Handle the case where the user is not verified
                    // e.g., show an error message, redirect to verification page
                    alert("You need to be verified to schedule rides.");
                  } else {
                    navigate("/rides/new");
                  }
                }}
                className={`flex items-center px-4 py-2 rounded-md 
          ${
            user?.isDriverVerified
              ? "bg-primary-600 text-white hover:bg-primary-700"
              : "bg-gray-300 text-gray-500 cursor-not-allowed"
          }`}
              >
                <Plus size={20} className="mr-2" />
                Schedule Ride
              </button>
            </div>

            {isLoading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
              </div>
            ) : hasNoFutureRides ? (
              <div className="text-center py-12 bg-white rounded-lg shadow-sm">
                <Calendar size={48} className="mx-auto text-gray-400 mb-4" />
                <h3 className="text-xl font-medium text-gray-900 mb-2">
                  No rides scheduled
                </h3>
                <p className="text-gray-600 mb-4">
                  Start by scheduling your first ride
                </p>
              </div>
            ) : (
              <div className="grid gap-6">
                {rides
                  .sort(
                    (a, b) =>
                      new Date(a.departureTime).getTime() -
                      new Date(b.departureTime).getTime()
                  ) // Sort ascending
                  .filter(
                    (ride) =>
                      ride.status !== RideStatus.COMPLETED &&
                      ride.status !== RideStatus.CANCELLED &&
                      new Date(ride.departureTime).getTime() > today.getTime() // Add this condition
                  )
                  .map((ride) => (
                    <div
                      key={ride.id}
                      className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow"
                    >
                      <div className="flex justify-between items-start">
                        <div className="space-y-4">
                          <div className="flex items-center space-x-4">
                            <div className="flex items-center text-gray-600">
                              <Clock size={20} className="mr-2" />
                              {formatDateTime(ride.departureTime)}
                            </div>
                            <span
                              className={`px-2 py-1 rounded-full text-sm ${
                                ride.status === RideStatus.SCHEDULED
                                  ? "bg-green-100 text-green-800"
                                  : ride.status === RideStatus.IN_PROGRESS
                                  ? "bg-blue-100 text-blue-800"
                                  : ride.status === RideStatus.COMPLETED
                                  ? "bg-gray-100 text-gray-800"
                                  : "bg-red-100 text-red-800"
                              }`}
                            >
                              {ride.status}
                            </span>
                          </div>
                          <div className="space-y-2">
                            <div className="flex items-center text-gray-600">
                              <MapPin size={20} className="mr-2" />
                              From: {ride.origin}
                            </div>
                            <div className="flex items-center text-gray-600">
                              <MapPin size={20} className="mr-2" />
                              To: {ride.destination}
                            </div>
                          </div>
                          <div className="flex items-center text-gray-600">
                            <Users size={20} className="mr-2" />
                            {ride.availableSeats} seats available
                          </div>
                          <div className="flex items-center text-gray-600">
                            <InformationCircleIcon className="mr-2 h-5 w-5" />
                            Payments are received only through cash from the
                            students.
                          </div>
                        </div>
                        <div className="space-y-3">
                          <h4 className="font-medium text-gray-700">
                            Booked Passengers:
                          </h4>
                          {confirmedBookings
                            .filter((booking) => booking.ride.id === ride.id)
                            .map((booking) => (
                              <div
                                key={booking.id}
                                className="flex justify-between items-center bg-gray-50 p-3 rounded"
                              >
                                <div>
                                  <p className="font-medium flex items-center">
                                    <User size={20} className="mr-1" />
                                    {booking.passenger.firstName}{" "}
                                    {booking.passenger.lastName}
                                  </p>
                                  <p className="text-sm text-gray-600 flex items-center">
                                    <Phone size={20} className="mr-1" />
                                    {booking.passenger.phone}
                                  </p>
                                  <span className="px-1 py-1 bg-green-100 text-green-800 rounded text-xs">
                                    Confirmed
                                  </span>
                                </div>
                              </div>
                            ))}
                        </div>

                        {ride.status === RideStatus.SCHEDULED && (
                          <div className="flex space-x-2">
                            {canStartRide(ride.departureTime) && (
                              <button
                                onClick={() =>
                                  handleUpdateRideStatus(
                                    ride.id,
                                    RideStatus.IN_PROGRESS
                                  )
                                }
                                className="p-2 text-white bg-green-600 rounded-md hover:bg-green-700"
                                title="Start ride"
                              >
                                Start Ride
                              </button>
                            )}
                            {canEditRide(confirmedBookings) && (
                              <button
                                onClick={() =>
                                  navigate(`/rides/${ride.id}/edit`)
                                }
                                className="p-2 text-gray-400 hover:text-primary-600 rounded-full hover:bg-gray-50"
                                title="Edit ride"
                              >
                                <Edit2 size={20} />
                              </button>
                            )}
                            {canDeleteRide(ride.departureTime) && (
                              <button
                                onClick={() => handleDeleteRide(ride)}
                                className="p-2 text-gray-400 hover:text-red-600 rounded-full hover:bg-gray-50"
                                title="Cancel ride"
                              >
                                <Trash2 size={20} />
                              </button>
                            )}
                          </div>
                        )}
                        {ride.status === RideStatus.IN_PROGRESS && (
                          <button
                            onClick={() =>
                              handleUpdateRideStatus(
                                ride.id,
                                RideStatus.COMPLETED
                              )
                            }
                            className="p-2 text-white bg-blue-600 rounded-md hover:bg-blue-700"
                            title="End ride"
                          >
                            End Ride
                          </button>
                        )}

                        {ride.status === RideStatus.SCHEDULED && (
                          <PreRideUpdate
                            rideId={ride.id}
                            driverName={user?.firstName || ""}
                            departureTime={ride.departureTime}
                            onSuccess={() => {
                              // Show success toast/message
                              toast.success("Message sent to all passengers");
                            }}
                            onError={() => {
                              toast.error(
                                "Failed to send update. Please try again."
                              );
                            }}
                          />
                        )}
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </>
        )}
      </div>
    </Layout>
  );
};

export default RiderDashboard;
