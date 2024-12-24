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
} from "lucide-react";
import Layout from "../../components/layout/Layout";
import { rideService, bookingService } from "../../services";
import { useAuth } from "../../contexts/AuthContext";
import { Ride, RideStatus, Booking, BookingStatus } from "../../types";
import { InformationCircleIcon } from "@heroicons/react/16/solid";

const RiderDashboard: React.FC = () => {
  const [rides, setRides] = useState<Ride[]>([]);
  const [pendingBookings, setPendingBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingBookings, setIsLoadingBookings] = useState(true);
  const [error, setError] = useState<string>("");
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    if (user?.phone) {
      loadRides();
      loadPendingBookings();
    }
  }, [user]);

  const loadRides = async () => {
    try {
      setIsLoading(true);
      setError("");
      const userRides = await rideService.getUserRides(user!.phone);
      setRides(userRides);
    } catch (error) {
      console.error("Error loading rides:", error);
      setError("Failed to load rides. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

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
    } catch (error) {
      console.error("Error updating booking:", error);
    }
  };

  const handleDeleteRide = async (rideId: string) => {
    if (window.confirm("Are you sure you want to cancel this ride?")) {
      try {
        await rideService.deleteRide(rideId);
        loadRides();
      } catch (error) {
        console.error("Error deleting ride:", error);
      }
    }
  };

  const formatDateTime = (dateTime: string) => {
    return new Date(dateTime).toLocaleString();
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-2 mt-16">
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
              <h1 className="text-2xl font-bold text-gray-900">My Rides</h1>
              <button
                onClick={() => navigate("/rides/new")}
                className="flex items-center px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
              >
                <Plus size={20} className="mr-2" />
                Schedule Ride
              </button>
            </div>

            {isLoading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
              </div>
            ) : rides.length === 0 ? (
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
                {rides.map((ride) => (
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
                          Payments are received only through cash from the students.
                        </div>
                      </div>

                      {ride.status === RideStatus.SCHEDULED && (
                        <div className="flex space-x-2">
                          <button
                            onClick={() => navigate(`/rides/${ride.id}/edit`)}
                            className="p-2 text-gray-400 hover:text-primary-600 rounded-full hover:bg-gray-50"
                            title="Edit ride"
                          >
                            <Edit2 size={20} />
                          </button>
                          <button
                            onClick={() => handleDeleteRide(ride.id)}
                            className="p-2 text-gray-400 hover:text-red-600 rounded-full hover:bg-gray-50"
                            title="Cancel ride"
                          >
                            <Trash2 size={20} />
                          </button>
                        </div>
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
