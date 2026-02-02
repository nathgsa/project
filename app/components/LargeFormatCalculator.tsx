"use client";

import { useState, useEffect, useRef } from 'react';

// Types
interface Material {
  id: string;
  name: string;
  baseRate: number;
}

interface Addon {
  id: string;
  name: string;
  rate: number;
  type: 'perSquareFoot' | 'perPiece';
  quantity?: number;
}

interface SelectedAddon {
  id: string;
  name: string;
  rate: number;
  quantity?: number;
}

interface CalculationResults {
  totalSquareFeet: number;
  total1: number;
  total2: number;
  breakdown1: string[];
  breakdown2: string[];
}

class Calculator {
  length = 0;
  width = 0;
  selectedMaterial: Material | null = null;
  rate1 = 0;
  rate2 = 0;
  selectedAddons: {
    perSquareFoot: Map<string, SelectedAddon>;
    perPiece: Map<string, SelectedAddon>;
  } = {
    perSquareFoot: new Map(),
    perPiece: new Map(),
  };
  unit = 'ft';

  static UNIT_CONVERSIONS: Record<string, number> = {
    ft: 1,
    in: 1 / 12,
    cm: 0.0328084,
    mm: 0.00328084,
  };

  setUnit(unit: string) {
    this.unit = unit;
    this.setDimensions(this.length, this.width);
  }

  setDimensions(length: number, width: number) {
    const conversionFactor = Calculator.UNIT_CONVERSIONS[this.unit];
    this.length = (parseFloat(String(length)) || 0) * conversionFactor;
    this.width = (parseFloat(String(width)) || 0) * conversionFactor;
  }

  setMaterial(material: Material) {
    this.selectedMaterial = material;
    this.rate1 = material.baseRate;
  }

  setRate1(rate: number) {
    this.rate1 = parseFloat(String(rate)) || 0;
  }

  setRate2(rate: number) {
    this.rate2 = parseFloat(String(rate)) || 0;
  }

  toggleAddon(type: 'perSquareFoot' | 'perPiece', addon: Addon, isSelected: boolean) {
    if (isSelected) {
      this.selectedAddons[type].set(addon.id, { ...addon, quantity: type === 'perPiece' ? 1 : undefined });
    } else {
      this.selectedAddons[type].delete(addon.id);
    }
  }

  updateAddonRate(type: 'perSquareFoot' | 'perPiece', id: string, rate: number) {
    if (this.selectedAddons[type].has(id)) {
      const addon = this.selectedAddons[type].get(id)!;
      addon.rate = rate;
      this.selectedAddons[type].set(id, addon);
    }
  }

  updateAddonQuantity(id: string, quantity: number) {
    if (this.selectedAddons.perPiece.has(id)) {
      const addon = this.selectedAddons.perPiece.get(id)!;
      addon.quantity = Math.max(1, quantity);
      this.selectedAddons.perPiece.set(id, addon);
    }
  }

  calculateTotalSquareFeet() {
    return this.length * this.width;
  }

  calculateAddons(totalSqFt: number) {
    let total = 0;
    for (const addon of this.selectedAddons.perSquareFoot.values()) {
      total += addon.rate * totalSqFt;
    }
    for (const addon of this.selectedAddons.perPiece.values()) {
      total += addon.rate * (addon.quantity || 1);
    }
    return total;
  }

  getBreakdown(baseRate: number, totalSqFt: number) {
    const breakdown: string[] = [];
    breakdown.push(
      `Base: ${this.formatDimension(totalSqFt)} × PHP ${this.formatNumber(baseRate)} = PHP ${this.formatNumber(totalSqFt * baseRate)}`
    );

    for (const addon of this.selectedAddons.perSquareFoot.values()) {
      const addonTotal = addon.rate * totalSqFt;
      breakdown.push(
        `${addon.name}: ${this.formatDimension(totalSqFt)} × PHP ${this.formatNumber(addon.rate)} = PHP ${this.formatNumber(addonTotal)}`
      );
    }

    for (const addon of this.selectedAddons.perPiece.values()) {
      const addonTotal = addon.rate * (addon.quantity || 1);
      breakdown.push(
        `${addon.name}: ${addon.quantity} pc × PHP ${this.formatNumber(addon.rate)} = PHP ${this.formatNumber(addonTotal)}`
      );
    }

    return breakdown;
  }

  formatDimension(value: number) {
    const conversionFactor = 1 / Calculator.UNIT_CONVERSIONS[this.unit];
    const convertedValue = value * conversionFactor;
    return `${this.formatNumber(convertedValue)} ${this.unit}`;
  }

  formatNumber(number: number) {
    return new Intl.NumberFormat('en-PH', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(number);
  }

  calculate(): CalculationResults {
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
  const [calculator] = useState(() => new Calculator());
  const [length, setLength] = useState('');
  const [width, setWidth] = useState('');
  const [unit, setUnit] = useState('ft');
  const [materialSearch, setMaterialSearch] = useState('');
  const [showMaterialDropdown, setShowMaterialDropdown] = useState(false);
  const [rate1, setRate1] = useState('');
  const [rate2, setRate2] = useState('');
  const [materials, setMaterials] = useState<Material[]>([]);
  const [addons, setAddons] = useState<{ perSquareFoot: Addon[]; perPiece: Addon[] }>({
    perSquareFoot: [],
    perPiece: [],
  });
  const [selectedAddons, setSelectedAddons] = useState<Map<string, { type: 'perSquareFoot' | 'perPiece'; addon: SelectedAddon }>>(
    new Map()
  );
  const [results, setResults] = useState<CalculationResults>({
    totalSquareFeet: 0,
    total1: 0,
    total2: 0,
    breakdown1: [],
    breakdown2: [],
  });

  const materialDropdownRef = useRef<HTMLDivElement>(null);

  // Fetch materials & addons from DB on load
  useEffect(() => {
    fetch('/api/admin/materials')
      .then((res) => res.json())
      .then((data) => setMaterials(data))
      .catch(console.error);

    fetch('/api/admin/addons')
      .then((res) => res.json())
      .then((data) =>
        setAddons({
          perSquareFoot: data.filter((a: Addon) => a.type === 'perSquareFoot'),
          perPiece: data.filter((a: Addon) => a.type === 'perPiece'),
        })
      )
      .catch(console.error);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (materialDropdownRef.current && !materialDropdownRef.current.contains(event.target as Node)) {
        setShowMaterialDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const updateCalculations = () => setResults(calculator.calculate());

  // Unit, dimensions, rate effects
  useEffect(() => {
    calculator.setUnit(unit);
    updateCalculations();
  }, [unit]);

  useEffect(() => {
    calculator.setDimensions(parseFloat(length) || 0, parseFloat(width) || 0);
    updateCalculations();
  }, [length, width]);

  useEffect(() => {
    calculator.setRate1(parseFloat(rate1) || 0);
    updateCalculations();
  }, [rate1]);

  useEffect(() => {
    calculator.setRate2(parseFloat(rate2) || 0);
    updateCalculations();
  }, [rate2]);

  // Material selection
  const handleMaterialSelect = (material: Material) => {
    calculator.setMaterial(material);
    setMaterialSearch(`${material.name} - PHP ${calculator.formatNumber(material.baseRate)}`);
    setRate1(String(material.baseRate));
    setShowMaterialDropdown(false);
    updateCalculations();
  };

  // Addon selection
  const handleAddonSelect = (type: 'perSquareFoot' | 'perPiece', addon: Addon) => {
    calculator.toggleAddon(type, addon, true);
    const newMap = new Map(selectedAddons);
    newMap.set(`${type}:${addon.id}`, { type, addon });
    setSelectedAddons(newMap);
    updateCalculations();
  };

  const handleRemoveAddon = (type: 'perSquareFoot' | 'perPiece', id: string) => {
    calculator.toggleAddon(type, { id, name: '', rate: 0, type }, false);
    const newMap = new Map(selectedAddons);
    newMap.delete(`${type}:${id}`);
    setSelectedAddons(newMap);
    updateCalculations();
  };

  const handleAddonRateChange = (type: 'perSquareFoot' | 'perPiece', id: string, rate: string) => {
    calculator.updateAddonRate(type, id, parseFloat(rate) || 0);
    const newMap = new Map(selectedAddons);
    const key = `${type}:${id}`;
    const existing = newMap.get(key);
    if (existing) {
      existing.addon.rate = parseFloat(rate) || 0;
      newMap.set(key, existing);
      setSelectedAddons(newMap);
    }
    updateCalculations();
  };

  const handleAddonQuantityChange = (type: 'perSquareFoot' | 'perPiece', id: string, quantity: string) => {
    calculator.updateAddonQuantity(id, parseInt(quantity) || 1);
    const newMap = new Map(selectedAddons);
    selectedAddons.forEach((value, key) => {
      if (value.addon.id === id) {
        value.addon.quantity = Math.max(1, parseInt(quantity) || 1);
        newMap.set(key, value);
      }
    });
    setSelectedAddons(newMap);
    updateCalculations();
  };

  const formatNumber = (number: number) => {
    return new Intl.NumberFormat('en-PH', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(number);
  };

  const filteredMaterials = materials.filter((material) =>
    `${material.name} - PHP ${formatNumber(material.baseRate)}`.toLowerCase().includes(materialSearch.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-100 p-5">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">Large Format Calculator</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-white p-8 rounded-xl shadow-md">
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">Job Details</h2>

            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-lg font-medium text-gray-800 mb-4">Size</h3>
              <div className="space-y-4">
                <div>
                  <label htmlFor="unit" className="block mb-2 text-gray-700 font-medium">
                    Unit
                  </label>
                  <select
                    id="unit"
                    value={unit}
                    onChange={(e) => setUnit(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                  >
                    <option value="ft">Feet (ft)</option>
                    <option value="in">Inches (in)</option>
                    <option value="cm">Centimeters (cm)</option>
                    <option value="mm">Millimeters (mm)</option>
                  </select>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="length" className="block mb-2 text-gray-700 font-medium">
                      Length
                    </label>
                    <input
                      type="number"
                      id="length"
                      value={length}
                      onChange={(e) => setLength(e.target.value)}
                      min="0"
                      step="0.01"
                      className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label htmlFor="width" className="block mb-2 text-gray-700 font-medium">
                      Width
                    </label>
                    <input
                      type="number"
                      id="width"
                      value={width}
                      onChange={(e) => setWidth(e.target.value)}
                      min="0"
                      step="0.01"
                      className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-lg font-medium text-gray-800 mb-4">Material</h3>
              <div className="relative" ref={materialDropdownRef}>
                <input
                  type="text"
                  value={materialSearch}
                  onChange={(e) => setMaterialSearch(e.target.value)}
                  onFocus={() => setShowMaterialDropdown(true)}
                  placeholder="Search materials..."
                  className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                />
                {showMaterialDropdown && (
                  <div className="absolute top-full left-0 right-0 max-h-52 overflow-y-auto bg-white border border-gray-300 rounded shadow-lg z-50 mt-1">
                    {filteredMaterials.map((material) => (
                      <div
                        key={material.id}
                        onClick={() => handleMaterialSelect(material)}
                        className="p-2 cursor-pointer hover:bg-gray-100 transition-colors"
                      >
                        {material.name} - PHP {formatNumber(material.baseRate)}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-lg font-medium text-gray-800 mb-4">Rate (PHP per sq ft)</h3>
              <input
                type="number"
                value={rate1}
                onChange={(e) => setRate1(e.target.value)}
                min="0"
                step="0.01"
                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
              />
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-lg font-medium text-gray-800 mb-4">Alternative Rate (Optional)</h3>
              <input
                type="number"
                value={rate2}
                onChange={(e) => setRate2(e.target.value)}
                min="0"
                step="0.01"
                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
              />
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-lg font-medium text-gray-800 mb-4">Add-ons</h3>
              <select
                onChange={(e) => {
                  const value = e.target.value;
                  if (value) {
                    const [type, id] = value.split(':') as ['perSquareFoot' | 'perPiece', string];
                    const addon = (type === 'perSquareFoot' ? addons.perSquareFoot : addons.perPiece).find((a) => a.id === id);
                    if (addon) {
                      handleAddonSelect(type, addon);
                    }
                  }
                  e.target.value = '';
                }}
                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500 mb-4"
                defaultValue=""
              >
                <option value="">Select Add-on</option>
                <optgroup label="Per Square Foot Add-ons">
                  {addons.perSquareFoot.map((addon) => (
                    <option key={addon.id} value={`perSquareFoot:${addon.id}`}>
                      {addon.name} (PHP {formatNumber(addon.rate)} per sq ft)
                    </option>
                  ))}
                </optgroup>
                <optgroup label="Per Piece Add-ons">
                  {addons.perPiece.map((addon) => (
                    <option key={addon.id} value={`perPiece:${addon.id}`}>
                      {addon.name} (PHP {formatNumber(addon.rate)} per piece)
                    </option>
                  ))}
                </optgroup>
              </select>

              <div className="space-y-3">
                {Array.from(selectedAddons.entries()).map(([key, { type, addon }]) => (
                  <div key={key} className="relative bg-white p-4 rounded border border-gray-300">
                    <button
                      onClick={() => handleRemoveAddon(type, addon.id)}
                      className="absolute top-2 right-2 text-red-500 hover:text-red-700 text-xl font-bold"
                    >
                      ×
                    </button>
                    <div className="flex justify-between items-center pb-2 border-b border-gray-300 mb-3">
                      <div className="font-medium text-gray-800">{addon.name}</div>
                      <div className="text-xs text-gray-600 bg-gray-100 px-2 py-1 rounded">
                        {type === 'perSquareFoot' ? 'Per Square Foot' : 'Per Piece'}
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-sm text-gray-700 mb-1">
                          {type === 'perSquareFoot' ? 'Rate (PHP/sq ft):' : 'Price per piece (PHP):'}
                        </label>
                        <input
                          type="number"
                          value={addon.rate}
                          onChange={(e) => handleAddonRateChange(type, addon.id, e.target.value)}
                          min="0"
                          step="0.01"
                          className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                        />
                      </div>
                      {type === 'perPiece' && (
                        <div>
                          <label className="block text-sm text-gray-700 mb-1">Quantity:</label>
                          <input
                            type="number"
                            value={addon.quantity || 1}
                            onChange={(e) => handleAddonQuantityChange(type, addon.id, e.target.value)}
                            min="1"
                            step="1"
                            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">Calculation Results</h2>

            <div className="bg-gray-50 p-4 rounded-lg text-center">
              <h3 className="text-lg font-medium text-gray-800 mb-4">Total Area</h3>
              <div className="flex items-center justify-center gap-4 flex-wrap text-gray-800">
                <div className="flex flex-col items-center min-w-[80px]">
                  <span className="font-medium text-xl">{formatNumber(calculator.length / Calculator.UNIT_CONVERSIONS[unit])}</span>
                  <small className="text-xs text-gray-600 uppercase tracking-wide">Length</small>
                </div>
                <span className="font-medium text-xl">×</span>
                <div className="flex flex-col items-center min-w-[80px]">
                  <span className="font-medium text-xl">{formatNumber(calculator.width / Calculator.UNIT_CONVERSIONS[unit])}</span>
                  <small className="text-xs text-gray-600 uppercase tracking-wide">Width</small>
                </div>
                <span className="font-medium text-xl">=</span>
                <div className="flex flex-col items-center min-w-[120px]">
                  <span className="font-medium text-xl">{formatNumber(results.totalSquareFeet)}</span>
                  <small className="text-xs text-gray-600 uppercase tracking-wide">sq/{unit}</small>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg text-center">
              <h3 className="text-lg font-medium text-gray-800 mb-2">Total (Base Rate 1)</h3>
              <p className="text-2xl font-semibold text-gray-800">PHP {formatNumber(results.total1)}</p>
              <div className="mt-3 space-y-1 text-sm text-gray-600 text-left">
                {results.breakdown1.map((line, index) => (
                  <div key={index}>{line}</div>
                ))}
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg text-center">
              <h3 className="text-lg font-medium text-gray-800 mb-2">Total (Base Rate 2)</h3>
              <p className="text-2xl font-semibold text-gray-800">PHP {formatNumber(results.total2)}</p>
              <div className="mt-3 space-y-1 text-sm text-gray-600 text-left">
                {results.breakdown2.map((line, index) => (
                  <div key={index}>{line}</div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}