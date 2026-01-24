import { lusitana } from '@/app/ui/fonts';
import Clock from '@/app/ui/dashboard/clock';
import Calendar from '@/app/ui/dashboard/calendar';
import Calculator from '@/app/ui/dashboard/calculator';

export default async function Page() {

  const userName = 'Nathalie'; // Replace with actual user data if you have it

  return (
    <main>
      <div className="bg-blue-100 rounded-[5px] p-4">
        <h1 className={`${lusitana.className} mb-2 text-xl md:text-2xl`}>
        Dashboard
      </h1>
<br />
      {/* Welcome message */}
      <p className="mb-6 text-gray-600 text-sm md:text-base">
        Welcome back, <span className="font-semibold">{userName}</span>!
      </p>
      </div>
      

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3 center">
        <Clock />
        <Calendar />
        <Calculator />
      </div>
    </main>
  );
}
