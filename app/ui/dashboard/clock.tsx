'use client';

import { useEffect, useState } from 'react';

export default function Clock() {
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    setNow(new Date()); // initial client time
    const interval = setInterval(() => {
      setNow(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  if (!now) return null;

  return (
    <div className="rounded-xl bg-white p-4 shadow-md text-center">
      <p className="text-xs uppercase tracking-wide text-gray-500">
        Current Time
      </p>

      <p className="mt-1 text-3xl font-bold text-gray-800">
        {now.toLocaleTimeString()}
      </p>

      <p className="mt-1 text-sm text-gray-500">
        {now.toLocaleDateString(undefined, {
          weekday: 'long',
          month: 'long',
          day: 'numeric',
          year: 'numeric',
        })}
      </p>
    </div>
  );
}
