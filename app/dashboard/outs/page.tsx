import OutsCalculator from "@/app/components/outs/OutsCalculator";

export default async function Page() {
  return (
    <div className="p-10">
          <h1 className="text-3xl font-bold mb-6">EWT Calculator</h1>
          <OutsCalculator />
        </div>
  )
}
