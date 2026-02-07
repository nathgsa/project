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

  const {
    setsPerBooklet,
    overRun,
    runningRate,
    sortingFee,
    bookletFee,
    adminFee,
    margins,
    materials,
    plateRate,
  } = config;

  const totalSheets =
    (qty * setsPerBooklet * ply) / outs + overRun * ply;

  const materialCost =
    totalSheets * materials[material][sizeVariant];

  const per1k = Math.max(1, totalSheets / 1000);
  const plateFee = numColors * plateRate;
  const runningFee = runningRate * per1k * numColors;

  const finishingFee =
    sortingFee * per1k + bookletFee * qty + adminFee;

  const baseRate =
    materialCost + plateFee + runningFee + finishingFee;

  return {
    totalSheets,
    materialCost,
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

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setInputs((prev) => ({
      ...prev,
      [name]:
        name === "material" || name === "sizeVariant"
          ? value
          : Number(value),
    }));
  };

  const peso = (n: number) =>
    new Intl.NumberFormat("en-PH", {
      style: "currency",
      currency: "PHP",
    }).format(n);

  return (
    <div className="mx-auto max-w-6xl flex flex-col space-y-6 pt-4 -m-6 p-0">
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-900 to-slate-900 bg-clip-text text-transparent">
          Receipt Price Calculator
        </h1>
      </div>

      <div className="grid gap-6 md:grid-cols-[350px_1fr]">
        {/* SIDEBAR */}
        <aside className="bg-white border rounded-2xl p-6 shadow-sm space-y-4">
          <h2 className="text-lg font-semibold">
            Job Specifications
          </h2>

          {[
            { label: "Quantity (Booklets)", name: "qty" },
            { label: "No. of Ply", name: "ply" },
          ].map((f) => (
            <div key={f.name}>
              <label className="block text-sm text-slate-500 mb-1">
                {f.label}
              </label>
              <input
                type="number"
                name={f.name}
                value={(inputs as any)[f.name]}
                onChange={handleChange}
                className="w-full rounded-lg border bg-slate-100 px-4 py-2 focus:ring-2 focus:ring-blue-900"
              />
            </div>
          ))}

          {[
            {
              label: "Material Type",
              name: "material",
              options: [
                ["Carbonless", "Carbonless"],
                ["Bond", "Bond Paper"],
              ],
            },
            {
              label: "Paper Size",
              name: "sizeVariant",
              options: [
                ["Short", "Short (Letter)"],
                ["Long", "Long (Legal/A4)"],
              ],
            },
            {
              label: "Outs per Sheet",
              name: "outs",
              options: [
                [1, "1 Out (Full Sheet)"],
                [2, "2 Outs (Half Sheet)"],
                [3, "3 Outs"],
                [4, "4 Outs (Quarter Sheet)"],
              ],
            },
            {
              label: "Number of Colors",
              name: "numColors",
              options: [
                [1, "1 Color"],
                [2, "2 Colors"],
                [3, "3 Colors"],
                [4, "4 Colors"],
              ],
            },
          ].map((s) => (
            <div key={s.name}>
              <label className="block text-sm text-slate-500 mb-1">
                {s.label}
              </label>
              <select
                name={s.name}
                value={(inputs as any)[s.name]}
                onChange={handleChange}
                className="w-full rounded-lg border bg-slate-100 px-4 py-2"
              >
                {s.options.map(([val, label]) => (
                  <option key={val} value={val}>
                    {label}
                  </option>
                ))}
              </select>
            </div>
          ))}

          {isAdmin && (
            <button
              onClick={() => setIsDebug(!isDebug)}
              className={`w-full rounded-lg border px-4 py-2 text-sm font-medium ${
                isDebug
                  ? "bg-slate-900 text-white"
                  : "bg-white text-slate-600"
              }`}
            >
              {isDebug ? "Hide Debug" : "Show Debug"}
            </button>
          )}
        </aside>

        {/* MAIN */}
        <section className="space-y-6">
          {/* TABS */}
          <div className="flex gap-1 rounded-xl bg-slate-100 p-1 border">
            {(Object.keys(results.totals) as MarginKey[]).map((tier) => (
              <button
                key={tier}
                onClick={() => setActiveTier(tier)}
                className={`flex-1 rounded-lg px-4 py-2 text-sm font-semibold ${
                  activeTier === tier
                    ? "bg-white text-blue-900 shadow"
                    : "text-slate-500"
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

            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Unit Price (VAT)</span>
                <strong>
                  {peso(results.totals[activeTier].unitVat)}
                </strong>
              </div>
              <div className="flex justify-between text-2xl font-bold text-blue-900">
                <span>Total</span>
                <span>
                  {peso(results.totals[activeTier].withVat)}
                </span>
              </div>
            </div>
          </div>

          {/* DEBUG */}
          {isAdmin && isDebug && (
            <div className="bg-white border rounded-2xl p-6 text-sm space-y-2">
              <div>Total Sheets: {results.totalSheets.toFixed(2)}</div>
              <div>Material Cost: {peso(results.materialCost)}</div>
              <div>Running Fee: {peso(results.runningFee)}</div>
              <div>Plate Fee: {peso(results.plateFee)}</div>
              <div>Finishing Fee: {peso(results.finishingFee)}</div>
              <div className="font-bold">
                Base Rate: {peso(results.baseRate)}
              </div>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
