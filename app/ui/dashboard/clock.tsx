'use client';

import { useEffect, useState } from 'react';

export default function Clock() {
  const [now, setNow] = useState<Date | null>(null);

  // Update time every second
  useEffect(() => {
    setNow(new Date()); // set initial time on client
    const interval = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  if (!now) return null; // don't render on server

  return (
    <div className="rounded-xl bg-white p-4 shadow">
      <p className="text-sm text-gray-500">Current Time</p>
      <p className="text-2xl font-bold">{now.toLocaleTimeString()}</p>
    </div>
  );
}
