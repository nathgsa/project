'use client'

import { useState, useEffect } from 'react';

type Unit = 'ft' | 'in' | 'cm' | 'mm';

interface Material {
  id: string;
  name: string;
  baseRate: number;
}

interface AddonBase {
  id: string;
  name: string;
  rate: number;
}

interface PerSquareFootAddon extends AddonBase {}

interface PerPieceAddon extends AddonBase {
  quantity?: number;
}

type AddonType = 'perSquareFoot' | 'perPiece';

interface SelectedAddon extends AddonBase {
  type: AddonType;
  quantity?: number;
}

const CONFIG = {
  materials: [
    { id: 'vinyl-gloss', name: 'Vinyl Gloss', baseRate: 60.0 },
    { id: 'vinyl-matte', name: 'Vinyl Matte', baseRate: 70.0 },
    { id: 'clear-sticker', name: 'Clear Sticker', baseRate: 70.0 },
    { id: 'avery-sticker', name: 'Avery Sticker', baseRate: 100.0 },
    { id: '3m-reflectorize', name: '3M Reflectorize', baseRate: 200.0 },
    { id: 'photo-paper-matte', name: 'Photo Paper Matte', baseRate: 70.0 },
    { id: 'photo-paper-glossy', name: 'Photo Paper Glossy', baseRate: 60.0 },
    { id: 'sintra-3mm', name: 'Sticker Sintra 3MM', baseRate: 130.0 },
    { id: 'sintra-3mm-fb', name: 'Sticker Sintra 3MM - Front & Back', baseRate: 190.0 },
    { id: 'sintra-5mm', name: 'Sticker Sintra 5MM', baseRate: 150.0 },
    { id: 'sintra-5mm-fb', name: 'Sticker Sintra 5MM - Front & Back', baseRate: 210.0 },
    { id: 'pvc-sticker', name: 'PVC on Sticker', baseRate: 220.0 },
    { id: 'tarp-8oz', name: 'Tarp (8oz.)', baseRate: 10.0 },
    { id: 'tarp-10oz', name: 'Tarp (10oz.)', baseRate: 15.0 },
    { id: 'tarp-black-15oz', name: 'Tarp Black 15oz.', baseRate: 25.0 },
    { id: 'panaflex', name: 'Panaflex', baseRate: 80.0 },
  ] as Material[],
  addons: {
    perSquareFoot: [
      { id: 'plotter-cut', name: 'Plotter Cut', rate: 15 },
      { id: 'lamination-one-side', name: 'Lamination - One Side', rate: 40 },
      { id: 'lamination-two-side', name: 'Lamination - Two Side', rate: 80 },
      { id: 'installation-tape', name: 'Installation Tape', rate: 15 },
    ] as PerSquareFootAddon[],
    perPiece: [
      { id: 'eyelet', name: 'Eyelet', rate: 1 },
      { id: 'miscellaneous', name: 'Miscellaneous', rate: 0 },
    ] as PerPieceAddon[],
  },
};

const UNIT_CONVERSIONS: Record<Unit, number> = {
  ft: 1,
  in: 1 / 12,
  cm: 0.0328084,
  mm: 0.00328084,
};

class Calculator {
  length = 0;
  width = 0;
  selectedMaterial: Material | null = null;
  rate1 = 0;
  rate2 = 0;
  unit: Unit = 'ft';
  selectedAddons: { perSquareFoot: Map<string, PerSquareFootAddon>, perPiece: Map<string, PerPieceAddon> } = {
    perSquareFoot: new Map(),
    perPiece: new Map(),
  };

  setUnit(unit: Unit) {
    this.unit = unit;
    this.setDimensions(this.length, this.width, true);
  }

  setDimensions(length: number, width: number, alreadyConverted = false) {
    const factor = alreadyConverted ? 1 : UNIT_CONVERSIONS[this.unit];
    this.length = (length || 0) * factor;
    this.width = (width || 0) * factor;
  }

  setMaterial(materialId: string) {
    this.selectedMaterial = CONFIG.materials.find((m) => m.id === materialId) || null;
    if (this.selectedMaterial) this.rate1 = this.selectedMaterial.baseRate;
  }

  setRate1(rate: number) {
    this.rate1 = rate || 0;
  }

  setRate2(rate: number) {
    this.rate2 = rate || 0;
  }

  toggleAddon(type: AddonType, addonId: string, isSelected: boolean, customRate?: number, quantity?: number) {
    const addonList = CONFIG.addons[type];
    const addon = addonList.find((a) => a.id === addonId);
    if (!addon) return;
    if (isSelected) {
      if (type === 'perPiece') {
        this.selectedAddons.perPiece.set(addonId, { ...addon, rate: customRate ?? addon.rate, quantity: quantity ?? 1 });
      } else {
        this.selectedAddons.perSquareFoot.set(addonId, { ...addon, rate: customRate ?? addon.rate });
      }
    } else {
      type === 'perPiece' ? this.selectedAddons.perPiece.delete(addonId) : this.selectedAddons.perSquareFoot.delete(addonId);
    }
  }

  calculateTotalSquareFeet() {
    return this.length * this.width;
  }

  calculateAddons(totalSqFt: number) {
    let total = 0;
    this.selectedAddons.perSquareFoot.forEach((addon) => (total += addon.rate * totalSqFt));
    this.selectedAddons.perPiece.forEach((addon) => (total += addon.rate * (addon.quantity ?? 1)));
    return total;
  }

  getBreakdown(baseRate: number, totalSqFt: number) {
    const breakdown: string[] = [];
    breakdown.push(`Base: ${this.formatDimension(totalSqFt)} × PHP ${this.formatNumber(baseRate)} = PHP ${this.formatNumber(totalSqFt * baseRate)}`);
    this.selectedAddons.perSquareFoot.forEach((addon) => breakdown.push(`${addon.name}: ${this.formatDimension(totalSqFt)} × PHP ${this.formatNumber(addon.rate)} = PHP ${this.formatNumber(addon.rate * totalSqFt)}`));
    this.selectedAddons.perPiece.forEach((addon) => breakdown.push(`${addon.name}: ${addon.quantity} pc × PHP ${this.formatNumber(addon.rate)} = PHP ${this.formatNumber(addon.rate * (addon.quantity ?? 1))}`));
    return breakdown;
  }

  formatDimension(value: number) {
    const factor = 1 / UNIT_CONVERSIONS[this.unit];
    const converted = value * factor;
    return `${converted.toFixed(2)} ${this.unit}²`;
  }

  formatNumber(number: number) {
    return number.toFixed(2);
  }

  calculate() {
    const totalSqFt = this.calculateTotalSquareFeet();
    const addonsTotal = this.calculateAddons(totalSqFt);
    const total1 = this.rate1 * totalSqFt + addonsTotal;
    const total2 = this.rate2 ? this.rate2 * totalSqFt + addonsTotal : 0;
    return {
      totalSquareFeet: totalSqFt,
      total1,
      total2,
      breakdown1: this.getBreakdown(this.rate1, totalSqFt),
      breakdown2: this.rate2 ? this.getBreakdown(this.rate2, totalSqFt) : [],
    };
  }
}

export default function LargeFormatCalculator() {
  const [calculator] = useState(new Calculator());
  const [length, setLength] = useState<number | ''>('');
  const [width, setWidth] = useState<number | ''>('');
  const [unit, setUnit] = useState<Unit>('ft');
  const [materialSearch, setMaterialSearch] = useState('');
  const [selectedMaterial, setSelectedMaterial] = useState<Material | null>(null);
  const [rate1, setRate1] = useState<number>(0);
  const [rate2, setRate2] = useState<number>(0);
  const [selectedAddons, setSelectedAddons] = useState<SelectedAddon[]>([]);
  const [results, setResults] = useState(calculator.calculate());

  useEffect(() => {
    calculator.setUnit(unit);
    calculator.setDimensions(Number(length), Number(width));
    calculator.setRate1(Number(rate1));
    calculator.setRate2(Number(rate2));
    if (selectedMaterial) calculator.setMaterial(selectedMaterial.id);
    calculator.selectedAddons.perSquareFoot.clear();
    calculator.selectedAddons.perPiece.clear();
    selectedAddons.forEach((addon) => {
      calculator.toggleAddon(addon.type, addon.id, true, addon.rate, addon.quantity);
    });
    setResults(calculator.calculate());
  }, [length, width, unit, rate1, rate2, selectedMaterial, selectedAddons]);

  const filteredMaterials = CONFIG.materials.filter((m) =>
    m.name.toLowerCase().includes(materialSearch.toLowerCase())
  );

  const addAddon = (type: AddonType, addon: AddonBase) => {
    if (!selectedAddons.find((a) => a.id === addon.id)) {
      setSelectedAddons([...selectedAddons, { ...addon, type, quantity: type === 'perPiece' ? 1 : undefined }]);
    }
  };

  const removeAddon = (id: string) => {
    setSelectedAddons(selectedAddons.filter((a) => a.id !== id));
  };

  const updateAddon = (id: string, field: 'rate' | 'quantity', value: number) => {
    setSelectedAddons(selectedAddons.map((a) => a.id === id ? { ...a, [field]: value } : a));
  };

  return (
    <div className="max-w-6xl mx-auto p-4">
      <h1 className="text-2xl font-bold text-center mb-6">Large Format Calculator</h1>
      <div className="grid md:grid-cols-2 gap-6 bg-white p-6 rounded-xl shadow-lg">
        {/* Left Panel */}
        <div className="space-y-6">
          {/* Size */}
          <div className="p-4 bg-gray-50 rounded-lg">
            <h2 className="text-lg font-semibold mb-3">Size</h2>
            <select className="w-full border px-2 py-1 rounded mb-3" value={unit} onChange={(e) => setUnit(e.target.value as Unit)}>
              <option value="ft">Feet (ft)</option>
              <option value="in">Inches (in)</option>
              <option value="cm">Centimeters (cm)</option>
              <option value="mm">Millimeters (mm)</option>
            </select>
            <div className="grid grid-cols-2 gap-3">
              <input type="number" placeholder="Length" className="border px-2 py-1 rounded" value={length} onChange={(e) => setLength(Number(e.target.value))} />
              <input type="number" placeholder="Width" className="border px-2 py-1 rounded" value={width} onChange={(e) => setWidth(Number(e.target.value))} />
            </div>
          </div>

          {/* Material */}
          <div className="p-4 bg-gray-50 rounded-lg">
            <h2 className="text-lg font-semibold mb-3">Material</h2>
            <input
              type="text"
              className="w-full border px-2 py-1 rounded"
              placeholder="Search material..."
              value={materialSearch}
              onChange={(e) => setMaterialSearch(e.target.value)}
            />
            {materialSearch && (
              <div className="border mt-2 max-h-40 overflow-y-auto rounded">
                {filteredMaterials.map((m) => (
                  <div
                    key={m.id}
                    className="px-2 py-1 hover:bg-gray-200 cursor-pointer"
                    onClick={() => { setSelectedMaterial(m); setMaterialSearch(''); setRate1(m.baseRate); }}
                  >
                    {m.name} - PHP {m.baseRate.toFixed(2)}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Rates */}
          <div className="p-4 bg-gray-50 rounded-lg">
            <h2 className="text-lg font-semibold mb-3">Rates</h2>
            <div className="grid grid-cols-2 gap-3">
              <input type="number" className="border px-2 py-1 rounded" placeholder="Rate 1" value={rate1} onChange={(e) => setRate1(Number(e.target.value))} />
              <input type="number" className="border px-2 py-1 rounded" placeholder="Rate 2" value={rate2} onChange={(e) => setRate2(Number(e.target.value))} />
            </div>
          </div>

          {/* Add-ons */}
          <div className="p-4 bg-gray-50 rounded-lg">
            <h2 className="text-lg font-semibold mb-3">Add-ons</h2>
            <select
              className="w-full border px-2 py-1 rounded mb-3"
              onChange={(e) => {
                const [typeStr, id] = e.target.value.split(':');
                if (typeStr === 'perSquareFoot' || typeStr === 'perPiece') {
                  const type = typeStr as AddonType;
                  const addon = CONFIG.addons[type].find((a) => a.id === id);
                  if (addon) addAddon(type, addon);
                }
                e.target.value = '';
              }}
            >
              <option value="">Select Add-on</option>
              <optgroup label="Per Square Foot">
                {CONFIG.addons.perSquareFoot.map((a) => (
                  <option key={a.id} value={`perSquareFoot:${a.id}`}>{a.name} - PHP {a.rate}</option>
                ))}
              </optgroup>
              <optgroup label="Per Piece">
                {CONFIG.addons.perPiece.map((a) => (
                  <option key={a.id} value={`perPiece:${a.id}`}>{a.name} - PHP {a.rate}</option>
                ))}
              </optgroup>
            </select>

            {selectedAddons.map((addon) => (
              <div key={addon.id} className="flex items-center gap-2 p-2 bg-white rounded border mb-2">
                <div className="flex-1">
                  <div className="font-medium">{addon.name}</div>
                  <div className="text-sm text-gray-600">{addon.type === 'perSquareFoot' ? 'Per Square Foot' : 'Per Piece'}</div>
                </div>
                <input
                  type="number"
                  className="w-20 border px-2 py-1 rounded"
                  value={addon.rate}
                  onChange={(e) => updateAddon(addon.id, 'rate', Number(e.target.value))}
                />
                {addon.type === 'perPiece' && (
                  <input
                    type="number"
                    className="w-16 border px-2 py-1 rounded"
                    value={addon.quantity}
                    onChange={(e) => updateAddon(addon.id, 'quantity', Number(e.target.value))}
                  />
                )}
                <button className="text-red-500 font-bold" onClick={() => removeAddon(addon.id)}>×</button>
              </div>
            ))}
          </div>
        </div>

        {/* Right Panel */}
        <div className="space-y-6">
          <div className="p-4 bg-gray-50 rounded-lg text-center">
            <h2 className="text-lg font-semibold mb-3">Total Area</h2>
            <p className="text-xl font-bold">{results.totalSquareFeet.toFixed(2)} {unit}²</p>
          </div>

          <div className="p-4 bg-gray-50 rounded-lg text-center">
            <h2 className="text-lg font-semibold mb-2">Total (Rate 1)</h2>
            <p className="text-xl font-bold">PHP {results.total1.toFixed(2)}</p>
            <div className="text-sm mt-2 space-y-1">
              {results.breakdown1.map((line, i) => <div key={i}>{line}</div>)}
            </div>
          </div>

          {rate2 > 0 && (
            <div className="p-4 bg-gray-50 rounded-lg text-center">
              <h2 className="text-lg font-semibold mb-2">Total (Rate 2)</h2>
              <p className="text-xl font-bold">PHP {results.total2.toFixed(2)}</p>
              <div className="text-sm mt-2 space-y-1">
                {results.breakdown2.map((line, i) => <div key={i}>{line}</div>)}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
