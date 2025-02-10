import React from 'react';
import { Users } from 'lucide-react';

interface WaitlistBadgeProps {
  count: number;
}

const WaitlistBadge: React.FC<WaitlistBadgeProps> = ({ count }) => {
  if (count === 0) return null;

  return (
    <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
      <Users className="w-3 h-3 mr-1" />
      {count} in waitlist
    </div>
  );
};

export default WaitlistBadge;