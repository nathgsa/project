import Image from 'next/image';
import { lusitana } from '@/app/ui/fonts';

type AppLogoProps = {
  showText?: boolean;
  size?: number;
};

export default function AppLogo({ showText = true, size = 48 }: AppLogoProps) {
  return (
    <div
      className={`${lusitana.className} flex items-center leading-none`}
    >
      <Image
        src="/optima-logo.png"
        alt="Optima Logo"
        width={size}
        height={size}
        className="object-contain"
        priority
      />

      {/* {showText && (
        <p className="ml-2 text-[44px] text-white">myApp</p>
      )} */}
    </div>
  );
}
