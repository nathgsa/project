import EWTCalculator from "@/app/components/EWTCalculator"
import { Suspense } from 'react';
import { Metadata } from 'next';
 
export const metadata: Metadata = {
  title: 'EWT',
};

export default async function Page() {
  return (
    <div className="p-10">
      <Suspense>
        <EWTCalculator />
      </Suspense>
    </div>
  )
}
