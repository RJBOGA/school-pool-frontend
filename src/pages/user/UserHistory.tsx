import { useEffect, useState } from "react";
import { Calendar, DollarSign, MapPin, Phone } from "lucide-react";
import Layout from "../../components/layout/Layout";
import { useAuth } from "../../contexts/AuthContext";
import { Booking } from "../../types/models";
import bookingService from "../../services/bookingService";
import { BookingStatus } from "../../types/enums";

const UserHistory = () => {
  const { user } = useAuth();
  const [rideHistory, setRideHistory] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user?.phone) {
      loadUserRides();
    }
  }, [user]);

  const loadUserRides = async () => {
    try {
      setIsLoading(true);
      const userBookings = await bookingService.getUserBookings(user!.phone);

      const history = userBookings.filter(
        (booking) =>
          booking.status === BookingStatus.COMPLETED || BookingStatus.CANCELLED ||
          new Date(booking.ride.departureTime) < new Date()
      );

      setRideHistory(history);
    } catch (error) {
      console.error("Error loading user rides:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatDateTime = (dateTime: string) => {
    return new Date(dateTime).toLocaleString();
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
          <div className="space-y-4">
            {rideHistory.map((booking) => (
              <div
                key={booking.id}
                className="bg-white rounded-lg shadow p-6 opacity-75"
              >
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-lg font-semibold">
                    Ride with {booking.ride.driver.firstName}
                  </h3>
                  {/* <h3 className="text-lg font-semibold flex items-center">
                    <Phone size={20} className="mr-2" />
                    {booking.ride.driver.phone}
                  </h3> */}

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
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default UserHistory;
