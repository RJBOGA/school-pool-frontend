import { useEffect, useState } from "react";
import { Calendar, DollarSign, MapPin, Users } from "lucide-react";
import Layout from "../../components/layout/Layout";
import { useAuth } from "../../contexts/AuthContext";
import { Booking } from "../../types/models";
import bookingService from "../../services/bookingService";

const RiderHistory = () => {
  const { user } = useAuth();
  const [completedRides, setCompletedRides] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user?.phone) {
      loadDriverRides();
    }
  }, [user]);

  const loadDriverRides = async () => {
    try {
      setIsLoading(true);
      const driverBookings = await bookingService.getDriverBookings(user!.phone);
      
      const completed = driverBookings.filter(booking => 
        new Date(booking.ride.departureTime) < new Date()
      );
      
      setCompletedRides(completed);
    } catch (error) {
      console.error("Error loading driver rides:", error);
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
          Past Rides History
        </h2>
        {isLoading ? (
          <div className="text-center py-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
          </div>
        ) : completedRides.length === 0 ? (
          <div className="text-center py-4 bg-white rounded-lg shadow">
            <p className="text-gray-500">No ride history.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {completedRides.map((booking) => (
              <div
                key={booking.id}
                className="bg-white rounded-lg shadow p-6 opacity-75"
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-semibold mb-1">
                      {booking.ride.origin} → {booking.ride.destination}
                    </h3>
                    <p className="text-sm text-gray-600">
                      Passenger: {booking.passenger.firstName} {booking.passenger.lastName}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-sm">
                      {booking.status}
                    </span>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center text-gray-600">
                    <Calendar size={20} className="mr-2" />
                    {formatDateTime(booking.ride.departureTime)}
                  </div>
                  <div className="flex items-center text-gray-600">
                    <DollarSign size={20} className="mr-2" />
                    ${booking.ride.price}
                  </div>
                  <div className="flex items-center text-gray-600">
                    <Users size={20} className="mr-2" />
                    Total Seats: {booking.ride.totalSeats}
                  </div>
                  <div className="mt-2 pt-2 border-t">
                    <p className="text-sm text-gray-500">
                      Contact: {booking.passenger.phone}
                    </p>
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

export default RiderHistory;