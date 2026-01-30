import OutsCalculator from "@/app/components/OutsCalculator";
import { Suspense } from 'react';
import { Metadata } from 'next';
 
export const metadata: Metadata = {
  title: 'Outs',
};

export default async function Page() {
  return (
    <div className="p-10">
      <Suspense>
        <OutsCalculator />
      </Suspense>
          
        </div>
  )
}
