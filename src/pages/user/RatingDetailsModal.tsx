import React from "react";
import { X, Star } from "lucide-react";
import { Review } from "../../services/ReviewService";

interface RatingDetailsModalProps {
  onClose: () => void;
  reviews: Review[];
  driverName: string;
}

const RatingDetailsModal: React.FC<RatingDetailsModalProps> = ({
  onClose,
  reviews,
  driverName,
}) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full p-6 relative max-h-[80vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          <X size={24} />
        </button>

        <h2 className="text-xl font-semibold mb-6">Reviews for {driverName}</h2>

        {reviews.length === 0 ? (
          <p className="text-gray-500 text-center py-4">No reviews yet</p>
        ) : (
          <div className="space-y-4">
            {reviews.map((review, index) => (
              <div
                key={index}
                className="border-b border-gray-200 last:border-b-0 pb-4 last:pb-0"
              >
                <div className="flex items-center mb-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      size={20}
                      className={`${
                        star <= review.rating
                          ? "text-yellow-400 fill-yellow-400"
                          : "text-gray-300"
                      }`}
                    />
                  ))}
                </div>
                <p className="text-gray-700">{review.comment}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default RatingDetailsModal;
