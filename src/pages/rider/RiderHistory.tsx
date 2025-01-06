import { useEffect, useState } from "react";
import { Calendar, DollarSign, MapPin, Users } from "lucide-react";
import Layout from "../../components/layout/Layout";
import { useAuth } from "../../contexts/AuthContext";
import { Ride, RideStatus } from "../../types/models";
import { rideService } from "../../services";

const RiderHistory = () => {
  const { user } = useAuth();
  const [pastRides, setPastRides] = useState<Ride[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user?.phone) {
      loadDriverRides();
    }
  }, [user]);

  const loadDriverRides = async () => {
    try {
      setIsLoading(true);
      const userRides = await rideService.getUserRides(user!.phone);
      
      // Filter rides that are either completed or cancelled
      const past = userRides.filter(ride => 
        ride.status === RideStatus.COMPLETED || 
        ride.status === RideStatus.CANCELLED
      );
      
      // Sort by departure time (most recent first)
      past.sort((a, b) => 
        new Date(b.departureTime).getTime() - new Date(a.departureTime).getTime()
      );
      
      setPastRides(past);
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
        ) : pastRides.length === 0 ? (
          <div className="text-center py-4 bg-white rounded-lg shadow">
            <p className="text-gray-500">No ride history.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {pastRides.map((ride) => (
              <div
                key={ride.id}
                className="bg-white rounded-lg shadow p-6 opacity-75"
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-semibold mb-1">
                      {ride.origin} → {ride.destination}
                    </h3>
                  </div>
                  <div className="text-right">
                    <span className={`px-2 py-1 rounded-full text-sm ${
                      ride.status === RideStatus.COMPLETED 
                        ? "bg-green-100 text-green-800" 
                        : "bg-red-100 text-red-800"
                    }`}>
                      {ride.status}
                    </span>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center text-gray-600">
                    <Calendar size={20} className="mr-2" />
                    {formatDateTime(ride.departureTime)}
                  </div>
                  <div className="flex items-center text-gray-600">
                    <DollarSign size={20} className="mr-2" />
                    ${ride.price}
                  </div>
                  <div className="flex items-center text-gray-600">
                    <Users size={20} className="mr-2" />
                    Seats Offered: {ride.totalSeats}
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