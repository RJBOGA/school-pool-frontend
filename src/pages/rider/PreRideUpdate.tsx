// src/components/rides/PreRideUpdate.tsx
import React, { useState } from "react";
import { Clock, Send, MessageCircle } from "lucide-react";
import rideUpdateService from "../../services/rideUpdateService";
import { toast } from "react-toastify";

interface PreRideUpdateProps {
  rideId: string;
  driverName: string;
  departureTime: string;
  onSuccess?: () => void;
  onError?: (error: any) => void;
}

const QUICK_MESSAGES = ["I'll be on time", "Running 5-10 minutes late"];

const MAX_LENGTH = 200;

export default function PreRideUpdate({
  rideId,
  driverName,
  departureTime,
  onSuccess,
  onError,
}: PreRideUpdateProps) {
  const [message, setMessage] = useState("");
  const [isCustom, setIsCustom] = useState(false);
  const [isSending, setIsSending] = useState(false);

  const timeUntilDeparture =
    new Date(departureTime).getTime() - new Date().getTime();
  const showUpdate = timeUntilDeparture <= 3600000 && timeUntilDeparture > 0;

  if (!showUpdate) return null;

  const handleQuickMessage = (msg: string) => {
    setMessage(msg);
    setIsCustom(msg.includes("Vehicle change:"));
  };

  const handleSubmit = async () => {
    if (!message.trim() || isSending) return;

    try {
      setIsSending(true);
      await rideUpdateService.sendUpdate({
        rideId,
        message: `${driverName}'s Update: ${message}`,
        timestamp: new Date().toISOString(),
      });

      // Clear message and show success notification
      setMessage("");
      setIsCustom(false);
      //toast.success('Message sent successfully to all passengers'); // Add this

      onSuccess?.();
    } catch (error) {
      console.error("Failed to send update:", error);
      toast.error("Failed to send update. Please try again."); // Add this
      onError?.(error);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="mt-4 p-4 border rounded-lg bg-gray-50">
      <div className="flex items-center gap-2 mb-4">
        <MessageCircle className="w-4 h-4 text-primary-600" />
        <span className="text-sm font-medium">Send update to passengers</span>
      </div>

      <div className="space-y-2 mb-4">
        {QUICK_MESSAGES.map((msg, idx) => (
          <button
            key={idx}
            onClick={() => handleQuickMessage(msg)}
            className={`block w-full text-left px-3 py-2 text-sm rounded-md
                       hover:bg-primary-50 border 
                       ${
                         message === msg
                           ? "border-primary-500 bg-primary-50"
                           : "border-gray-200"
                       }
                       focus:outline-none focus:ring-2 focus:ring-primary-500`}
          >
            {msg}
          </button>
        ))}
      </div>

      {(isCustom || message.includes("Vehicle change:")) && (
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value.slice(0, MAX_LENGTH))}
          placeholder="Enter your message..."
          className="w-full p-2 border rounded-md text-sm mb-2
                    focus:ring-primary-500 focus:border-primary-500"
          rows={3}
        />
      )}

      <div className="flex items-center justify-between">
        <button
          onClick={() => setIsCustom(true)}
          className="text-sm text-primary-600 hover:text-primary-700"
        >
          Custom message
        </button>
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-500">
            {message.length}/{MAX_LENGTH}
          </span>
          <button
            onClick={handleSubmit}
            disabled={!message.trim() || isSending}
            className="flex items-center gap-2 px-4 py-2 text-sm
                      bg-primary-600 text-white rounded-md
                      hover:bg-primary-700 disabled:opacity-50"
          >
            <Send className="w-4 h-4" />
            {isSending ? "Sending..." : "Send to All"}
          </button>
        </div>
      </div>
    </div>
  );
}
