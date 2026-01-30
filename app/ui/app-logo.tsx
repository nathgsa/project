import Image from 'next/image';
// import { lusitana } from '@/app/ui/fonts';

export default function AppLogo() {
  return (
    <div className={` flex flex-row items-center leading-none text-white`}
    >
      <Image
        src="/optima-logo.png"
        alt="Optima Logo"
        width={48}
        height={48}
        className="mr-2"
        priority
      />
    </div>
  );
}
