'use client';

export default function Calendar() {
  const today = new Date();
  const daysInMonth = new Date(
    today.getFullYear(),
    today.getMonth() + 1,
    0
  ).getDate();

  return (
    <div className="rounded-xl bg-white p-4 shadow">
      <h3 className="mb-2 font-semibold">
        {today.toLocaleString('default', { month: 'long' })}{' '}
        {today.getFullYear()}
      </h3>

      <div className="grid grid-cols-7 gap-2 text-center text-sm">
        {[...Array(daysInMonth)].map((_, i) => {
          const day = i + 1;
          const isToday = day === today.getDate();

          return (
            <div
              key={day}
              className={`rounded-md p-2 ${
                isToday
                  ? 'bg-blue-600 text-white font-bold'
                  : 'bg-gray-100'
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
