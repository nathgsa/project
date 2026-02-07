"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";

/* =======================
   CONFIG
======================= */
const config = {
  setsPerBooklet: 50,
  overRun: 200,
  runningRate: 300,
  sortingFee: 350,
  plateRate: 600,
  bookletFee: 10,
  adminFee: 3000,
  margins: {
    SRP: 0.38,
    Discounted: 0.25,
    BestPrice: 0.15,
  },
  materials: {
    Carbonless: { Short: 0.8, Long: 0.9 },
    Bond: { Short: 0.7, Long: 0.8 },
  },
};

type MarginKey = keyof typeof config.margins;

interface Inputs {
  qty: number;
  ply: number;
  material: keyof typeof config.materials;
  sizeVariant: "Short" | "Long";
  outs: number;
  numColors: number;
}

/* =======================
   CALCULATOR LOGIC
======================= */
function calculateMarginPrice(base: number, margin: number, qty: number) {
  const netOfVat = base * (1 + margin);
  const withVat = netOfVat * 1.12;

  return {
    netOfVat,
    withVat,
    unitNet: netOfVat / qty,
    unitVat: withVat / qty,
  };
}

function calculateCost(inputs: Inputs) {
  const { qty, ply, material, sizeVariant, outs, numColors } = inputs;
  const { setsPerBooklet, overRun, runningRate, sortingFee, bookletFee, adminFee, margins, materials, plateRate } = config;

  const totalSheets = (qty * setsPerBooklet * ply) / outs + overRun * ply;
  const materialPrice = materials[material][sizeVariant];
  const materialCost = totalSheets * materialPrice;
  const per1k = Math.max(1, totalSheets / 1000);
  const plateFee = numColors * plateRate;
  const runningFee = runningRate * per1k * numColors;
  const finishingFee = sortingFee * per1k + bookletFee * qty + adminFee;
  const baseRate = materialCost + plateFee + runningFee + finishingFee;

  return {
    totalSheets,
    materialCost,
    per1k,
    plateFee,
    runningFee,
    finishingFee,
    baseRate,
    totals: {
      SRP: calculateMarginPrice(baseRate, margins.SRP, qty),
      Discounted: calculateMarginPrice(baseRate, margins.Discounted, qty),
      BestPrice: calculateMarginPrice(baseRate, margins.BestPrice, qty),
    },
  };
}

/* =======================
   COMPONENT
======================= */
export default function RecieptCalculator() {
  const { data: session } = useSession();
  const isAdmin = session?.user?.role === "admin";

  const [inputs, setInputs] = useState<Inputs>({
    qty: 10,
    ply: 2,
    material: "Carbonless",
    sizeVariant: "Short",
    outs: 2,
    numColors: 1,
  });

  const [activeTier, setActiveTier] = useState<MarginKey>("SRP");
  const [isDebug, setIsDebug] = useState(false);

  useEffect(() => {
    if (!isAdmin) setIsDebug(false);
  }, [isAdmin]);

  const results = calculateCost(inputs);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setInputs((prev) => ({
      ...prev,
      [name]: name === "material" || name === "sizeVariant" ? value : Number(value),
    }));
  };

  const peso = (n: number) =>
    new Intl.NumberFormat("en-PH", { style: "currency", currency: "PHP" }).format(n);

  return (
    <div className="mx-auto max-w-6xl space-y-6 flex flex-col pt-4 -m-6 p-0">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-900 to-slate-900 bg-clip-text text-transparent">
          Receipt Price Calculator
        </h1>
      </div>

      <div className="grid gap-6 md:grid-cols-[350px_1fr]">
        {/* SIDEBAR */}
        <div className="bg-white border rounded-2xl p-6 shadow-sm">
          <h2 className="text-lg font-semibold mb-4">Job Specifications</h2>

          {[{ label: "Quantity (Booklets)", name: "qty" }, { label: "No. of Ply", name: "ply" }].map((f) => (
            <div key={f.name} className="mb-4">
              <label className="block text-sm text-slate-500 mb-1">{f.label}</label>
              <input
                type="number"
                name={f.name}
                value={(inputs as any)[f.name]}
                onChange={handleChange}
                className="w-full rounded-lg border bg-slate-100 px-4 py-2 focus:ring-2 focus:ring-blue-900"
              />
            </div>
          ))}

          {["material", "sizeVariant", "outs", "numColors"].map((field) => {
            let label = "";
            let options: any[] = [];
            if (field === "material") {
              label = "Material Type";
              options = [
                { value: "Carbonless", label: "Carbonless" },
                { value: "Bond", label: "Bond Paper" },
              ];
            } else if (field === "sizeVariant") {
              label = "Paper Size";
              options = [
                { value: "Short", label: "Short (Letter)" },
                { value: "Long", label: "Long (Legal/A4)" },
              ];
            } else if (field === "outs") {
              label = "Outs per Sheet";
              options = [
                { value: 1, label: "1 Out (Full Sheet)" },
                { value: 2, label: "2 Outs (Half Sheet)" },
                { value: 3, label: "3 Outs" },
                { value: 4, label: "4 Outs (Quarter Sheet)" },
              ];
            } else if (field === "numColors") {
              label = "Number of Colors";
              options = [
                { value: 1, label: "1 Color" },
                { value: 2, label: "2 Colors" },
                { value: 3, label: "3 Colors" },
                { value: 4, label: "4 Colors" },
              ];
            }

            return (
              <div key={field} className="mb-4">
                <label className="block text-sm text-slate-500 mb-1">{label}</label>
                <select
                  name={field}
                  value={(inputs as any)[field]}
                  onChange={handleChange}
                  className="w-full rounded-lg border bg-slate-100 px-4 py-2"
                >
                  {options.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>
            );
          })}

          {isAdmin && (
            <button
              onClick={() => setIsDebug(!isDebug)}
              className={`w-full rounded-lg border px-4 py-2 text-sm font-medium ${
                isDebug ? "bg-slate-900 text-white" : "bg-white text-slate-600"
              }`}
            >
              {isDebug ? "Hide Debug" : "Show Debug"}
            </button>
          )}
        </div>

        {/* MAIN */}
        <div className="space-y-6">
          {/* Tabs */}
          <div className="flex gap-1 rounded-xl bg-slate-100 p-1 border">
            {(Object.keys(results.totals) as MarginKey[]).map((tier) => (
              <button
                key={tier}
                onClick={() => setActiveTier(tier)}
                className={`flex-1 rounded-lg px-4 py-2 text-sm font-semibold ${
                  activeTier === tier ? "bg-white text-blue-900 shadow" : "text-slate-500"
                }`}
              >
                {tier === "BestPrice" ? "Best Price" : tier}
              </button>
            ))}
          </div>

          {/* PRICE CARD */}
          <div className="bg-white border rounded-2xl p-8 shadow">
            <div className="text-center text-slate-500 font-semibold mb-6">
              Quantity: {inputs.qty} booklets
            </div>

            {/* WITH VAT */}
            <div className="space-y-2 mb-4 bg-gray-50 p-4 rounded-lg">
              <div className="text-sm font-semibold text-slate-500">With VAT</div>
              <div className="flex justify-between text-sm text-slate-700">
                <span>Unit price:</span>
                <span>{peso(results.totals[activeTier].unitVat)}</span>
              </div>
              <div className="flex justify-between text-2xl font-bold text-blue-900">
                <span>Total</span>
                <span>{peso(results.totals[activeTier].withVat)}</span>
              </div>
            </div>

            <hr className="my-4 border-gray-300" />

            {/* WITHOUT VAT */}
            <div className="space-y-2 bg-gray-50 p-4 rounded-lg">
              <div className="text-sm font-semibold text-slate-500">Without VAT</div>
              <div className="flex justify-between text-sm text-slate-700">
                <span>Unit price:</span>
                <span>{peso(results.totals[activeTier].unitNet)}</span>
              </div>
              <div className="flex justify-between text-xl font-semibold text-blue-900">
                <span>Total</span>
                <span>{peso(results.totals[activeTier].netOfVat)}</span>
              </div>
            </div>

            {/* ADMIN DEBUG PANEL */}
            {isAdmin && isDebug && (
              <div className="bg-white border rounded-2xl p-6 text-sm space-y-2">
                <div>Total Sheets: {results.totalSheets.toFixed(2)}</div>
                <div>Material Cost: {peso(results.materialCost)}</div>
                <div>Running Fee: {peso(results.runningFee)}</div>
                <div>Plate Fee: {peso(results.plateFee)}</div>
                <div>Finishing Fee: {peso(results.finishingFee)}</div>
                <div className="font-bold">Base Rate: {peso(results.baseRate)}</div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
