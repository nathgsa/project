"use client"

import React, { useState, useMemo } from 'react';
import { Calculator, RotateCcw, Box, Layers, Maximize, AlertCircle, Scissors } from 'lucide-react';

// --- Layout Calculation ---
const calculateLayout = (sheetW, sheetH, itemW, itemH, bleed) => {
  if (!sheetW || !sheetH || !itemW || !itemH || isNaN(sheetW) || isNaN(sheetH) || isNaN(itemW) || isNaN(itemH) || isNaN(bleed)) return null;

  const cutW = itemW + bleed;
  const cutH = itemH + bleed;

  if (cutW > sheetW && cutW > sheetH) return { total: 0, rows: 0, cols: 0, utilization: 0 };
  if (cutH > sheetH && cutH > sheetW) return { total: 0, rows: 0, cols: 0, utilization: 0 };

  const cols = Math.floor(sheetW / cutW);
  const rows = Math.floor(sheetH / cutH);
  const total = cols * rows;

  const usedArea = total * (itemW * itemH);
  const sheetArea = sheetW * sheetH;
  const utilization = sheetArea > 0 ? (usedArea / sheetArea) * 100 : 0;

  return { cols, rows, total, utilization, itemW: cutW, itemH: cutH, sheetW, sheetH };
};

// --- Layout Visualizer ---
const LayoutVisualizer = ({ layout, label }) => {
  if (!layout || layout.total === 0) {
    return (
      <div className="h-64 bg-slate-100 rounded-lg flex items-center justify-center border-2 border-dashed border-slate-300 text-slate-400">
        No fit possible
      </div>
    );
  }

  const containerSize = 300;
  const scale = Math.min(containerSize / layout.sheetW, containerSize / layout.sheetH);

  const displaySheetW = layout.sheetW * scale;
  const displaySheetH = layout.sheetH * scale;
  const displayItemW = layout.itemW * scale;
  const displayItemH = layout.itemH * scale;

  return (
    <div className="flex flex-col items-center">
      <div className="relative bg-white border-2 border-slate-800 shadow-sm" style={{ width: displaySheetW, height: displaySheetH }}>
        {Array.from({ length: layout.rows }).map((_, r) =>
          Array.from({ length: layout.cols }).map((_, c) => (
            <div
              key={`${r}-${c}`}
              className="absolute border border-blue-400 bg-blue-100/50 hover:bg-blue-200/80 transition-colors"
              style={{ width: displayItemW, height: displayItemH, left: c * displayItemW, top: r * displayItemH }}
            />
          ))
        )}
      </div>
      <div className="mt-4 text-center">
        <h4 className="font-bold text-slate-800">{label}</h4>
        <div className="text-sm text-slate-600">{layout.cols} x {layout.rows} = <span className="font-bold text-blue-600">{layout.total} outs</span></div>
        <div className="text-xs text-slate-500 mt-1">{layout.utilization.toFixed(2)}% Utilization</div>
      </div>
    </div>
  );
};

// --- Outs Calculator ---
export default function OutsCalculator() {
  const [sheetSize, setSheetSize] = useState({ w: 25, h: 38 });
  const [itemSize, setItemSize] = useState({ w: 8.3, h: 11.7 });
  const [bleed, setBleed] = useState(0.25);

  const straightLayout = useMemo(() =>
    calculateLayout(parseFloat(sheetSize.w), parseFloat(sheetSize.h), parseFloat(itemSize.w), parseFloat(itemSize.h), parseFloat(bleed)),
    [sheetSize, itemSize, bleed]
  );

  const rotatedLayout = useMemo(() =>
    calculateLayout(parseFloat(sheetSize.w), parseFloat(sheetSize.h), parseFloat(itemSize.h), parseFloat(itemSize.w), parseFloat(bleed)),
    [sheetSize, itemSize, bleed]
  );

  const bestLayout = useMemo(() => {
    if (!straightLayout || !rotatedLayout) return null;
    return straightLayout.total >= rotatedLayout.total ? 'straight' : 'rotated';
  }, [straightLayout, rotatedLayout]);

  const handleInputChange = (setter, key, value) => setter(prev => ({ ...prev, [key]: value }));

  return (
    <div className="min-h-screen  flex flex-col items-center justify-center pt-8 -m-6 p-0  font-sans">
      <div className="max-w-5xl mx-auto space-y-8">

        {/* Header */}
        <header className="flex items-center space-x-3 pb-6 border-b border-slate-200">
          <div className="p-3 bg-blue-600 rounded-lg shadow-lg">
            <Calculator className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Outs Calculator</h1>
            <p className="text-slate-500">Calculate sheet utilization and item yield</p>
          </div>
        </header>

        {/* Input Section */}
        <section className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

            {/* Sheet Inputs */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2 text-slate-800 font-semibold mb-2">
                <Maximize className="w-5 h-5 text-blue-600" />
                <h3>Sheet Dimensions</h3>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-500 uppercase mb-1">Length (W)</label>
                  <input
                    type="number"
                    inputMode="decimal"
                    step="any"
                    value={sheetSize.w}
                    onChange={(e) => handleInputChange(setSheetSize, 'w', e.target.value)}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-500 uppercase mb-1">Height (H)</label>
                  <input
                    type="number"
                    inputMode="decimal"
                    step="any"
                    value={sheetSize.h}
                    onChange={(e) => handleInputChange(setSheetSize, 'h', e.target.value)}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                  />
                </div>
              </div>
            </div>

            {/* Item Inputs */}
            <div className="space-y-4">
              <div className="flex items-center justify-between text-slate-800 font-semibold mb-2">
                <div className="flex items-center space-x-2">
                  <Box className="w-5 h-5 text-emerald-600" />
                  <h3>Item Dimensions</h3>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-500 uppercase mb-1">Length (W)</label>
                  <input
                    type="number"
                    inputMode="decimal"
                    step="any"
                    value={itemSize.w}
                    onChange={(e) => handleInputChange(setItemSize, 'w', e.target.value)}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-500 uppercase mb-1">Height (H)</label>
                  <input
                    type="number"
                    inputMode="decimal"
                    step="any"
                    value={itemSize.h}
                    onChange={(e) => handleInputChange(setItemSize, 'h', e.target.value)}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
                  />
                </div>
              </div>

              {/* Bleed Input */}
              <div className="pt-2">
                <label className="flex items-center space-x-2 text-xs font-medium text-slate-500 uppercase mb-1">
                  <Scissors className="w-3 h-3" />
                  <span>Total Bleed / Spacing</span>
                </label>
                <input
                  type="number"
                  inputMode="decimal"
                  step="any"
                  value={bleed}
                  onChange={(e) => setBleed(e.target.value)}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all bg-orange-50"
                />
                <p className="text-[10px] text-slate-400 mt-1">Added to Width and Height (e.g., 0.125" each side = 0.25 total)</p>
              </div>
            </div>

          </div>
        </section>

        {/* Results Section */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-8">

          {/* Straight Layout */}
          <div className={`bg-white rounded-xl shadow-sm border-2 p-6 transition-all ${bestLayout === 'straight' ? 'border-blue-500 ring-4 ring-blue-50' : 'border-slate-200'}`}>
            <div className="flex justify-between items-start mb-6">
              <div className="flex items-center space-x-2">
                <Layers className="w-5 h-5 text-slate-600" />
                <h3 className="font-semibold text-slate-800">Straight Layout</h3>
              </div>
              {bestLayout === 'straight' && (
                <span className="bg-blue-100 text-blue-700 text-xs font-bold px-2 py-1 rounded-full">BEST FIT</span>
              )}
            </div>

            <LayoutVisualizer layout={straightLayout} label="Grain Short / Straight" />

            <div className="mt-6 pt-4 border-t border-slate-100 grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-slate-500">Columns:</span>
                <span className="float-right font-medium">{straightLayout?.cols}</span>
              </div>
              <div>
                <span className="text-slate-500">Rows:</span>
                <span className="float-right font-medium">{straightLayout?.rows}</span>
              </div>
            </div>
          </div>

          {/* Rotated Layout */}
          <div className={`bg-white rounded-xl shadow-sm border-2 p-6 transition-all ${bestLayout === 'rotated' ? 'border-emerald-500 ring-4 ring-emerald-50' : 'border-slate-200'}`}>
            <div className="flex justify-between items-start mb-6">
              <div className="flex items-center space-x-2">
                <RotateCcw className="w-5 h-5 text-slate-600" />
                <h3 className="font-semibold text-slate-800">Rotated Layout</h3>
              </div>
              {bestLayout === 'rotated' && (
                <span className="bg-emerald-100 text-emerald-700 text-xs font-bold px-2 py-1 rounded-full">BEST FIT</span>
              )}
            </div>

            <LayoutVisualizer layout={rotatedLayout} label="Grain Long / Rotated" />

            <div className="mt-6 pt-4 border-t border-slate-100 grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-slate-500">Columns:</span>
                <span className="float-right font-medium">{rotatedLayout?.cols}</span>
              </div>
              <div>
                <span className="text-slate-500">Rows:</span>
                <span className="float-right font-medium">{rotatedLayout?.rows}</span>
              </div>
            </div>
          </div>

        </section>

        {/* Quick Stats Footer */}
        <section className="bg-slate-800 text-white rounded-xl p-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center space-x-3">
            <AlertCircle className="text-blue-400" />
            <div>
              <h4 className="font-bold">Total Yield</h4>
              <p className="text-slate-400 text-sm">Maximum items per sheet</p>
            </div>
          </div>
          <div className="text-4xl font-bold">
            {Math.max(straightLayout?.total || 0, rotatedLayout?.total || 0)} <span className="text-lg font-normal text-slate-400">outs</span>
          </div>
        </section>
      </div>
    </div>
  );
}
