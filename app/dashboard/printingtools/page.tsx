import LargeFormatCalculator from "@/app/components/printingtools/LargeFormatCalculator";
import { Suspense } from 'react';
import { Metadata } from 'next';
 
export const metadata: Metadata = {
  title: 'Large Format',
};

export default function Page() {
  return (
    <div className="p-10">
              <h1 className="text-3xl font-bold mb-6"></h1>
              <Suspense>
                <LargeFormatCalculator />
              </Suspense>
              
            </div>
  )
}
