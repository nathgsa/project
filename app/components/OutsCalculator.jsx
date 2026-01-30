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
    <div className="min-h-screen bg-slate-50 p-4 md:p-8 font-sans">
      <div className="max-w-5xl mx-auto space-y-8">

        {/* Header */}
        <header className="flex items-center space-x-3 pb-6 border-b border-slate-200">
          <div className="p-3 bg-blue-600 rounded-lg shadow-lg"><Calculator className="w-8 h-8 text-white" /></div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Outs Calculator</h1>
            <p className="text-slate-500">Calculate sheet utilization and item yield</p>
          </div>
        </header>

        {/* Inputs */}
        <section className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 grid md:grid-cols-2 gap-8">
          {/* Sheet */}
          <div className="space-y-4">
            <h3 className="font-semibold text-slate-800 flex items-center gap-2"><Maximize className="w-5 h-5 text-blue-600" /> Sheet Dimensions</h3>
            <div className="grid grid-cols-2 gap-4">
              <input type="number" value={sheetSize.w} onChange={e => handleInputChange(setSheetSize, 'w', e.target.value)} className="w-full border p-2 rounded" />
              <input type="number" value={sheetSize.h} onChange={e => handleInputChange(setSheetSize, 'h', e.target.value)} className="w-full border p-2 rounded" />
            </div>
          </div>
          {/* Item */}
          <div className="space-y-4">
            <h3 className="font-semibold text-slate-800 flex items-center gap-2"><Box className="w-5 h-5 text-emerald-600" /> Item Dimensions</h3>
            <div className="grid grid-cols-2 gap-4">
              <input type="number" value={itemSize.w} onChange={e => handleInputChange(setItemSize, 'w', e.target.value)} className="w-full border p-2 rounded" />
              <input type="number" value={itemSize.h} onChange={e => handleInputChange(setItemSize, 'h', e.target.value)} className="w-full border p-2 rounded" />
            </div>
            <div>
              <label className="flex items-center gap-2"><Scissors className="w-4 h-4" /> Total Bleed / Spacing</label>
              <input type="number" value={bleed} onChange={e => setBleed(e.target.value)} className="w-full border p-2 rounded" />
            </div>
          </div>
        </section>

        {/* Results */}
        <section className="grid md:grid-cols-2 gap-8">
          <div className={`bg-white rounded-xl border-2 p-6 ${bestLayout === 'straight' ? 'border-blue-500 ring-2 ring-blue-50' : 'border-slate-200'}`}>
            <h3 className="font-semibold text-slate-800 flex items-center gap-2"><Layers className="w-5 h-5" /> Straight Layout {bestLayout === 'straight' && <span className="ml-2 text-xs bg-blue-100 px-2 py-1 rounded">BEST FIT</span>}</h3>
            <LayoutVisualizer layout={straightLayout} label="Grain Short / Straight" />
          </div>
          <div className={`bg-white rounded-xl border-2 p-6 ${bestLayout === 'rotated' ? 'border-emerald-500 ring-2 ring-emerald-50' : 'border-slate-200'}`}>
            <h3 className="font-semibold text-slate-800 flex items-center gap-2"><RotateCcw className="w-5 h-5" /> Rotated Layout {bestLayout === 'rotated' && <span className="ml-2 text-xs bg-emerald-100 px-2 py-1 rounded">BEST FIT</span>}</h3>
            <LayoutVisualizer layout={rotatedLayout} label="Grain Long / Rotated" />
          </div>
        </section>

        <section className="bg-slate-800 text-white rounded-xl p-6 flex justify-between items-center">
          <div className="flex items-center gap-3"><AlertCircle /> <div><h4 className="font-bold">Total Yield</h4></div></div>
          <div className="text-4xl font-bold">{Math.max(straightLayout?.total || 0, rotatedLayout?.total || 0)} <span className="text-lg font-normal">outs</span></div>
        </section>

      </div>
    </div>
  );
}
