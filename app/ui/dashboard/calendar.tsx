'use client';

export default function Calendar() {
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth();

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDay = new Date(year, month, 1).getDay(); // 0 = Sunday

  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className="rounded-xl bg-white p-4 shadow-md">
      <h3 className="mb-3 text-center text-lg font-semibold text-gray-700">
        {today.toLocaleString('default', { month: 'long' })} {year}
      </h3>

      {/* Weekday labels */}
      <div className="mb-2 grid grid-cols-7 text-center text-xs font-medium text-gray-500">
        {weekDays.map((day) => (
          <div key={day}>{day}</div>
        ))}
      </div>

      {/* Calendar days */}
      <div className="grid grid-cols-7 gap-2 text-center text-sm">
        {/* Empty slots before first day */}
        {Array.from({ length: firstDay }).map((_, i) => (
          <div key={`empty-${i}`} />
        ))}

        {Array.from({ length: daysInMonth }).map((_, i) => {
          const day = i + 1;
          const isToday = day === today.getDate();

          return (
            <div
              key={day}
              className={`rounded-md p-2 transition ${
                isToday
                  ? 'bg-blue-600 text-white font-bold ring-2 ring-blue-300'
                  : 'bg-gray-100 hover:bg-blue-100'
              }`}
            >
              {day}
            </div>
          );
        })}
      </div>
    </div>
  );
}
