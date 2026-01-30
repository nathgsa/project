"use client";

import React, { useState, useEffect } from 'react';
import { Calculator, ScrollText, Scale, Coins, Info, RefreshCw, FileSpreadsheet } from 'lucide-react';

const PaperCalculator = () => {
  // --- Input States ---
  const [width, setWidth] = useState(38);
  const [length, setLength] = useState(34);
  const [gsm, setGsm] = useState(70);
  const [draws, setDraws] = useState(500);
  const [costPerKg, setCostPerKg] = useState(60);

  // --- Calculated Results ---
  const [results, setResults] = useState({
    sqMeters: 0,
    weightPerSheet: 0,
    totalWeight: 0,
    totalCost: 0,
    costPerSheet: 0
  });

  // --- Calculation Logic ---
  useEffect(() => {
    const calculatedSqMeters = (Number(width) * Number(length)) / 1550;
    const calculatedWeightPerSheet = (calculatedSqMeters * Number(gsm)) / 1000;
    const calculatedTotalWeight = Math.ceil(calculatedWeightPerSheet * Number(draws));
    const calculatedTotalCost = calculatedTotalWeight * Number(costPerKg);
    const calculatedCostPerSheet = Number(draws) > 0 ? calculatedTotalCost / Number(draws) : 0;

    setResults({
      sqMeters: calculatedSqMeters || 0,
      weightPerSheet: calculatedWeightPerSheet || 0,
      totalWeight: calculatedTotalWeight || 0,
      totalCost: calculatedTotalCost || 0,
      costPerSheet: calculatedCostPerSheet || 0
    });
  }, [width, length, gsm, draws, costPerKg]);

  // --- Helpers ---
  const format = (num: number, decimals = 4) => num.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: decimals });
  const formatCurrency = (num: number) => num.toLocaleString(undefined, { style: 'currency', currency: 'PHP', minimumFractionDigits: 2 }).replace('₱', '');

  return (
    <div className="min-h-screen bg-slate-50 p-4 font-sans text-slate-800">
      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* Header */}
        <header className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-blue-600 p-2.5 rounded-lg text-white">
              <FileSpreadsheet size={24} />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900">Roll to Sheet Calculator</h1>
              <p className="text-sm text-slate-500">Calculate Per Sheet Costing</p>
            </div>
          </div>
          <button 
            onClick={() => { setWidth(38); setLength(34); setGsm(70); setDraws(500); setCostPerKg(60); }}
            className="flex items-center gap-2 text-sm text-blue-600 hover:bg-blue-50 px-3 py-1.5 rounded-md transition-colors"
          >
            <RefreshCw size={14} />
            Reset Defaults
          </button>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Input Section */}
          <div className="lg:col-span-1 space-y-4">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 h-full">
              <h2 className="text-lg font-semibold mb-6 flex items-center gap-2">
                <Calculator size={18} className="text-blue-500" />
                Input Parameters
              </h2>
              
              <div className="space-y-5">
                {/* Dimensions */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Roll Width (in)</label>
                    <input type="number" value={width} onChange={e => setWidth(e.target.value === '' ? 0 : Number(e.target.value))} className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all font-medium"/>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Draw Length (in)</label>
                    <input type="number" value={length} onChange={e => setLength(e.target.value === '' ? 0 : Number(e.target.value))} className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all font-medium"/>
                  </div>
                </div>

                {/* GSM */}
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">GSM (Grams/m²)</label>
                  <input type="number" value={gsm} onChange={e => setGsm(e.target.value === '' ? 0 : Number(e.target.value))} className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all font-medium"/>
                </div>

                {/* Quantity */}
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Sheets (Default Ream: 500)</label>
                  <input type="number" value={draws} onChange={e => setDraws(e.target.value === '' ? 0 : Number(e.target.value))} className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all font-medium"/>
                </div>

                {/* Cost */}
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Cost Per KG</label>
                  <div className="relative">
                    <span className="absolute left-3 top-2.5 text-slate-400 font-bold">₱</span>
                    <input type="number" value={costPerKg} onChange={e => setCostPerKg(e.target.value === '' ? 0 : Number(e.target.value))} className="w-full p-2.5 pl-7 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all font-medium"/>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Results Section */}
          <div className="lg:col-span-2 space-y-6">
            {/* Main Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-emerald-600 text-white p-6 rounded-2xl shadow-lg relative overflow-hidden">
                <div className="absolute right-0 top-0 opacity-10 transform translate-x-2 -translate-y-2"><Coins size={120} /></div>
                <p className="text-emerald-100 text-sm font-medium mb-1">Final Cost Per Sheet</p>
                <h3 className="text-4xl font-bold tracking-tight">₱{format(results.costPerSheet, 2)}</h3>
                <div className="mt-4 pt-4 border-t border-emerald-500/30 flex justify-between items-center text-sm text-emerald-50">
                  <span>Total Batch Cost ({draws} pcs)</span>
                  <span className="font-bold text-lg">₱{formatCurrency(results.totalCost)}</span>
                </div>
              </div>

              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 relative overflow-hidden">
                <div className="absolute right-4 top-4 text-slate-100"><Scale size={80} /></div>
                <div className="relative z-10">
                  <p className="text-slate-500 text-sm font-medium mb-1">Total Weight Required</p>
                  <h3 className="text-4xl font-bold text-slate-800">{format(results.totalWeight, 0)} <span className="text-lg text-slate-400 font-normal">kg</span></h3>
                  <div className="mt-4 pt-4 border-t border-slate-100 flex flex-col gap-1 text-sm text-slate-600">
                    <div className="flex justify-between">
                       <span>Weight Per Sheet:</span>
                       <span className="font-semibold">{format(results.weightPerSheet, 5)} kg</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Calculation Breakdown */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2"><ScrollText size={18} className="text-blue-500" /> Calculation Breakdown</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="text-xs text-slate-500 uppercase bg-slate-50 border-b border-slate-100">
                    <tr>
                      <th className="px-4 py-3 font-semibold">Step</th>
                      <th className="px-4 py-3 font-semibold">Formula</th>
                      <th className="px-4 py-3 font-semibold text-right">Result</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    <tr>
                      <td className="px-4 py-3 font-medium text-slate-700">1. Area Conversion</td>
                      <td className="px-4 py-3 text-slate-500 font-mono text-xs">({width}" × {length}") ÷ 1550</td>
                      <td className="px-4 py-3 text-right font-semibold text-slate-800">{format(results.sqMeters, 4)} m²</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 font-medium text-slate-700">2. Sheet Weight</td>
                      <td className="px-4 py-3 text-slate-500 font-mono text-xs">{format(results.sqMeters, 2)}m² × {gsm}gsm ÷ 1000</td>
                      <td className="px-4 py-3 text-right font-semibold text-slate-800">{format(results.weightPerSheet, 5)} kg</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 font-medium text-slate-700">3. Total Batch Weight</td>
                      <td className="px-4 py-3 text-slate-500 font-mono text-xs">RoundUp({format(results.weightPerSheet, 4)}kg × {draws})</td>
                      <td className="px-4 py-3 text-right font-semibold text-slate-800">{format(results.totalWeight, 0)} kg</td>
                    </tr>
                    <tr className="bg-emerald-50/50">
                      <td className="px-4 py-3 font-medium text-emerald-800">4. Cost Per Sheet</td>
                      <td className="px-4 py-3 text-emerald-600 font-mono text-xs">({results.totalWeight}kg × ₱{costPerKg}) ÷ {draws}</td>
                      <td className="px-4 py-3 text-right font-bold text-emerald-700">₱{format(results.costPerSheet, 2)}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Info Footnote */}
            <div className="bg-blue-50 border border-blue-100 p-4 rounded-xl flex gap-3 items-start">
              <Info className="text-blue-500 shrink-0 mt-0.5" size={18} />
              <div className="text-sm text-blue-700 space-y-1">
                <p className="font-semibold">Calculation Note:</p>
                <p>Total batch weight is <strong>rounded up</strong> to the nearest whole kilogram before calculating cost, matching standard paper purchasing logic.</p>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default PaperCalculator;
