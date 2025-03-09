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
  Play,
  Newspaper,
} from "lucide-react";
import Layout from "../../components/layout/Layout";
import { rideService, bookingService, userService } from "../../services";
import { useAuth } from "../../contexts/AuthContext";
import { Ride, RideStatus, Booking, BookingStatus } from "../../types";
import { InformationCircleIcon } from "@heroicons/react/16/solid";
import PreRideUpdate from "./PreRideUpdate";
import { toast } from "react-toastify";
import NewsModal from "../../components/common/NewsModal";
import newsService from "../../services/newsService";
import { GeoJsonPoint } from "../../types/GeoJsonTypes";
import { Coordinates } from "../../types/LocationTypes";


interface NewsArticle {
  title: string;
  description: string;
  content: string;
  url: string;
  publishedAt: string;
  sentiment_score: number;
  source: {
    id: string | null;
    name: string;
  };
}

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
  const [selectedRideDestination, setSelectedRideDestination] = useState<string | null>(null);
  const [newsArticles, setNewsArticles] = useState<NewsArticle[] | null>(null);
  const [newsError, setNewsError] = useState<string | null>(null);
  const [isFetchingNews, setIsFetchingNews] = useState(false);
  const [isNewsModalOpen, setIsNewsModalOpen] = useState(false);
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
    return false;
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
    }, 1000);

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
        const bookings = await bookingService.getDriverPendingBookings(
          user.phone
        );
        console.log("loadPendingBookings", bookings);
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
      loadPendingBookings();
      loadRides();
      loadConfirmedBookings();
      toast.success(
        status === BookingStatus.CONFIRMED
          ? "Booking confirmed successfully"
          : "Booking cancelled successfully"
      );
    } catch (error: any) {
      toast.error(error.message || "Failed to update booking status");
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
      loadRides();
    } catch (error) {
      console.error("Error updating ride status:", error);
      alert("Failed to update ride status");
    }
  };

  const formatDateTime = (dateTime: string) => {
    return new Date(dateTime).toLocaleString();
  };

  const handleGetNews = async (ride: Ride) => {
      setSelectedRideDestination(ride.destination);
      if (!ride.coordinates || ride.coordinates.length === 0) {
        alert("Could not retrieve coordinates for this destination.");
        return;
      }
  
      setIsFetchingNews(true);
      setNewsArticles(null);
      setNewsError(null);
      setIsNewsModalOpen(true);
      const destinationCoordinates: Coordinates = {
        lat: ride.coordinates[1].coordinates[1],
        lng: ride.coordinates[1].coordinates[0]
      };
      console.log("destinationCoordinates",destinationCoordinates)
  
      try {
        const data = await newsService.getFilteredNewsAndSentimentByGeo(
          destinationCoordinates.lat,
          destinationCoordinates.lng
        );
        setNewsArticles(data.articles);
      } catch (err: any) {
        setNewsError(err.message || "Failed to fetch news");
      } finally {
        setIsFetchingNews(false);
      }
    };
  
  
    const closeNewsModal = () => {
      setIsNewsModalOpen(false);
      setNewsArticles(null);
      setNewsError(null);
      setSelectedRideDestination(null);
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
                          {booking.passenger.firstName}
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
                          Departure:
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
                  )
                  .filter(
                    (ride) =>
                      ride.status !== RideStatus.COMPLETED &&
                      ride.status !== RideStatus.CANCELLED &&
                      new Date(ride.departureTime).getTime() > today.getTime()
                  )
                  .map((ride) => (
                    <div
                      key={ride.id}
                      className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow"
                    >
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-3">
                          <div className="flex items-center space-x-3">
                            <div className="flex items-center text-gray-600">
                              <Clock size={18} className="mr-1.5" />
                              {formatDateTime(ride.departureTime)}
                            </div>
                            <span
                              className={`px-2 py-0.5 rounded-full text-xs font-medium ${
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
                            <div className="flex items-start text-gray-600">
                              <MapPin
                                size={18}
                                className="mr-1.5 mt-0.5 flex-shrink-0"
                              />
                              <span className="line-clamp-1">
                                From: {ride.origin}
                              </span>
                            </div>
                            <div className="flex items-start text-gray-600">
                              <MapPin
                                size={18}
                                className="mr-1.5 mt-0.5 flex-shrink-0"
                              />
                              <span className="line-clamp-1">
                                To: {ride.destination}
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center text-gray-600">
                            <Users size={18} className="mr-1.5" />
                            {ride.availableSeats} seats available
                          </div>

                          <div className="flex items-center text-gray-600 text-sm">
                            <InformationCircleIcon className="w-4 h-4 mr-1.5" />
                            Payments are received only through cash.
                          </div>

                          <div className="flex flex-wrap gap-2 pt-2">
                            {ride.status === RideStatus.SCHEDULED &&
                              canStartRide(ride.departureTime) && (
                                <button
                                  onClick={() =>
                                    handleUpdateRideStatus(
                                      ride.id,
                                      RideStatus.IN_PROGRESS
                                    )
                                  }
                                  className="px-3 py-1.5 text-sm text-white bg-green-600 rounded-md hover:bg-green-700 flex items-center"
                                  title="Start ride"
                                >
                                  <Play size={16} className="mr-1" />
                                  Start Ride
                                </button>
                              )}

                            {ride.status === RideStatus.IN_PROGRESS && (
                              <button
                                onClick={() =>
                                  handleUpdateRideStatus(
                                    ride.id,
                                    RideStatus.COMPLETED
                                  )
                                }
                                className="px-3 py-1.5 text-sm text-white bg-blue-600 rounded-md hover:bg-blue-700 flex items-center"
                                title="End ride"
                              >
                                <CheckCircle size={16} className="mr-1" />
                                End Ride
                              </button>
                            )}

                            {ride.status === RideStatus.SCHEDULED && (
                              <>
                                {canEditRide(confirmedBookings) && (
                                  <button
                                    onClick={() =>
                                      navigate(`/rides/${ride.id}/edit`)
                                    }
                                    className="p-1.5 text-gray-400 hover:text-primary-600 rounded-full hover:bg-gray-50"
                                    title="Edit ride"
                                  >
                                    <Edit2 size={18} />
                                  </button>
                                )}
                                {canDeleteRide(ride.departureTime) && (
                                  <button
                                    onClick={() => handleDeleteRide(ride)}
                                    className="px-3 py-1.5 text-sm text-white bg-red-600 rounded-md hover:bg-red-700 flex items-center"
                                    title="Cancel ride"
                                  >
                                    <Trash2 size={18} />
                                    Cancel Ride
                                  </button>
                                )}

                                   <button
                                    onClick={() => handleGetNews(ride)}
                                    disabled={isFetchingNews}
                                    className="px-3 py-1.5 text-sm text-blue-500 hover:text-blue-700 flex items-center"
                                  >
                                    <Newspaper size={16} className="inline-block mr-1" />
                                    {isFetchingNews ? "Fetching News..." : "News"}
                                  </button>
                              </>
                            )}
                          </div>
                        </div>

                        <div className="flex flex-col justify-between h-full">
                          <div>
                            <h4 className="font-medium text-gray-700 mb-2">
                              Booked Passengers:
                            </h4>
                            <div className="max-h-32 overflow-y-auto">
                              {confirmedBookings
                                .filter(
                                  (booking) => booking.ride.id === ride.id
                                )
                                .map((booking) => (
                                  <div
                                    key={booking.id}
                                    className="mb-2 bg-gray-50 p-2 rounded flex items-start"
                                  >
                                    <div className="flex-1 min-w-0">
                                      <p className="font-medium text-sm flex items-center truncate">
                                        <User
                                          size={14}
                                          className="mr-1.5 flex-shrink-0"
                                        />
                                        <span className="truncate">
                                          {booking.passenger.firstName}
                                          {booking.passenger.lastName}
                                        </span>
                                      </p>
                                      <p className="text-xs text-gray-600 flex items-center truncate">
                                        <Phone
                                          size={14}
                                          className="mr-1.5 flex-shrink-0"
                                        />
                                        <span className="truncate">
                                          {booking.passenger.phone}
                                        </span>
                                      </p>
                                      <span className="inline-block px-1.5 py-0.5 bg-green-100 text-green-800 rounded text-xs">
                                        Confirmed
                                      </span>
                                    </div>
                                  </div>
                                ))}
                            </div>
                          </div>

                          {ride.status === RideStatus.SCHEDULED &&
                            canStartRide(ride.departureTime) && (
                              <div className="mt-3">
                                <PreRideUpdate
                                  rideId={ride.id}
                                  driverName={user?.firstName || ""}
                                  departureTime={ride.departureTime}
                                  onSuccess={() => {
                                    toast.success(
                                      "Message sent to all passengers"
                                    );
                                  }}
                                  onError={() => {
                                    toast.error(
                                      "Failed to send update. Please try again."
                                    );
                                  }}
                                />
                              </div>
                            )}
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </>
        )}
           <NewsModal
                isOpen={isNewsModalOpen}
                onClose={closeNewsModal}
                articles={newsArticles}
                error={newsError}
                destination={selectedRideDestination || ""}
            />
      </div>
    </Layout>
  );
};

export default RiderDashboard;
