import React, { useState, useEffect } from "react";
import { Calendar, MapPin, User, DollarSign, Clock } from "lucide-react";
import { Ride, BookingStatus } from "../../types";
import { bookingService } from "../../services";
import WaitlistBadge from "../../components/common/WaitlistBadge";
import { useAuth } from "../../contexts/AuthContext";

interface RideCardProps {
  ride: Ride;
  onBookingRequest: (rideId: string) => Promise<void>;
}

const RideCard: React.FC<RideCardProps> = ({ ride, onBookingRequest }) => {
  const [waitlistCount, setWaitlistCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    loadWaitlistCount();
  }, [ride.id]);

  const loadWaitlistCount = async () => {
    try {
      const count = await bookingService.getWaitlistCount(ride.id);
      setWaitlistCount(count);
    } catch (error) {
      console.error("Error loading waitlist count:", error);
    }
  };

  const handleBookingClick = async () => {
    try {
      setIsLoading(true);
      await onBookingRequest(ride.id);
      await loadWaitlistCount(); // Reload waitlist count after booking
    } catch (error) {
      console.error("Error making booking:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-semibold flex items-center">
            {ride.driver.firstName} {ride.driver.lastName}
          </h3>
          <p className="text-gray-500">
            {ride.availableSeats} {ride.availableSeats === 1 ? "seat" : "seats"}{" "}
            available
          </p>
          {ride.availableSeats === 0 && <WaitlistBadge count={waitlistCount} />}
        </div>
      </div>

      <div className="space-y-2 mb-4">
        <div className="flex items-center text-gray-600">
          <MapPin className="w-5 h-5 mr-2" />
          <span>
            {ride.origin} → {ride.destination}
          </span>
        </div>
        <div className="flex items-center text-gray-600">
          <Calendar className="w-5 h-5 mr-2" />
          <span>{new Date(ride.departureTime).toLocaleString()}</span>
        </div>
        <div className="flex items-center text-gray-600">
          <DollarSign className="w-5 h-5 mr-2" />
          <span>${ride.price}</span>
        </div>
      </div>

      <div className="flex justify-end mt-4">
        <button
          onClick={handleBookingClick}
          disabled={isLoading}
          className={`px-4 py-2 rounded-md text-white transition-colors ${
            ride.availableSeats === 0
              ? "bg-yellow-600 hover:bg-yellow-700"
              : "bg-primary-600 hover:bg-primary-700"
          } ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
        >
          {isLoading ? (
            <span className="flex items-center">
              <Clock className="animate-spin -ml-1 mr-2 h-4 w-4" />
              Processing...
            </span>
          ) : ride.availableSeats === 0 ? (
            "Join Waitlist"
          ) : (
            "Book Ride"
          )}
        </button>
      </div>
    </div>
  );
};

export default RideCard;
