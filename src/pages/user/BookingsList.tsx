import React from "react";
import { Calendar, MapPin, Clock, AlertCircle } from "lucide-react";
import { Booking, BookingStatus } from "../../types";

interface BookingsListProps {
  bookings: Booking[];
  title: string;
}

const BookingsList: React.FC<BookingsListProps> = ({ bookings, title }) => {
  const getStatusBadgeClass = (status: BookingStatus) => {
    switch (status) {
      case BookingStatus.CONFIRMED:
        return "bg-green-100 text-green-800";
      case BookingStatus.WAITLISTED:
        return "bg-yellow-100 text-yellow-800";
      case BookingStatus.PENDING:
        return "bg-blue-100 text-blue-800";
      case BookingStatus.CANCELLED:
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatWaitlistInfo = (booking: Booking) => {
    if (booking.status !== BookingStatus.WAITLISTED) return null;

    const expirationTime = booking.waitlistExpiration
      ? new Date(booking.waitlistExpiration).toLocaleTimeString()
      : null;

    return (
      <div className="mt-2 flex items-start space-x-2 text-yellow-700 bg-yellow-50 p-3 rounded-md">
        <AlertCircle className="w-5 h-5 mt-0.5" />
        <div>
          <p className="font-medium">
            Waitlist Position: #{booking.waitlistPosition}
          </p>
          {expirationTime && (
            <p className="text-sm">Offer expires at {expirationTime}</p>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
      {bookings.length === 0 ? (
        <p className="text-gray-500">No bookings found.</p>
      ) : (
        bookings.map((booking) => (
          <div key={booking.id} className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-lg font-semibold">
                {booking.ride.driver.firstName} {booking.ride.driver.lastName}
              </h3>
              <span
                className={`px-2 py-1 rounded-full text-sm ${getStatusBadgeClass(
                  booking.status
                )}`}
              >
                {booking.status}
              </span>
            </div>

            <div className="space-y-2">
              <div className="flex items-center text-gray-600">
                <MapPin className="w-5 h-5 mr-2" />
                <span>
                  {booking.ride.origin} → {booking.ride.destination}
                </span>
              </div>
              <div className="flex items-center text-gray-600">
                <Calendar className="w-5 h-5 mr-2" />
                <span>
                  {new Date(booking.ride.departureTime).toLocaleString()}
                </span>
              </div>
              <div className="flex items-center text-gray-600">
                <Clock className="w-5 h-5 mr-2" />
                <span>
                  Booked on: {new Date(booking.bookingTime).toLocaleString()}
                </span>
              </div>
            </div>

            {formatWaitlistInfo(booking)}
          </div>
        ))
      )}
    </div>
  );
};

export default BookingsList;
