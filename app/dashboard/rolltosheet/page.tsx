import PaperCalculator from "@/app/components/PaperCalculator";
import { Suspense } from 'react';
import { Metadata } from 'next';
 
export const metadata: Metadata = {
  title: 'Roll to Sheet',
};

export default function Page() {
  return (
    <div className="p-10">
              <h1 className="text-3xl font-bold mb-6"></h1>
              <Suspense>
                <PaperCalculator />
              </Suspense>
              
            </div>
  )
}
