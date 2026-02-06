"use client";

import { useState, useEffect, useRef } from "react";

interface Material {
  id: string;
  name: string;
  baseRate: number;
}

interface Addon {
  id: string;
  name: string;
  rate: number;
  quantity?: number;
}

interface SelectedAddon extends Addon {
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

const CONFIG = {
  materials: [
    { id: "vinyl-gloss", name: "Vinyl Gloss", baseRate: 60.0 },
    { id: "vinyl-matte", name: "Vinyl Matte", baseRate: 70.0 },
    { id: "clear-sticker", name: "Clear Sticker", baseRate: 70.0 },
    { id: "avery-sticker", name: "Avery Sticker", baseRate: 100.0 },
    { id: "3m-reflectorize", name: "3M Reflectorize", baseRate: 200.0 },
    { id: "photo-paper-matte", name: "Photo Paper Matte", baseRate: 70.0 },
    { id: "photo-paper-glossy", name: "Photo Paper Glossy", baseRate: 60.0 },
    { id: "sintra-3mm", name: "Sticker Sintra 3MM", baseRate: 130.0 },
    { id: "sintra-3mm-fb", name: "Sticker Sintra 3MM - Front & Back", baseRate: 190.0 },
    { id: "sintra-5mm", name: "Sticker Sintra 5MM", baseRate: 150.0 },
    { id: "sintra-5mm-fb", name: "Sticker Sintra 5MM - Front & Back", baseRate: 210.00 },
    { id: "pvc-sticker", name: "PVC on Sticker", baseRate: 220.0 },
    { id: "tarp-8oz", name: "Tarp (8oz.)", baseRate: 10.0 },
    { id: "tarp-10oz", name: "Tarp (10oz.)", baseRate: 15.0 },
    { id: "tarp-black-15oz", name: "Tarp Black 15oz.", baseRate: 25.0 },
    { id: "panaflex", name: "Panaflex", baseRate: 80.0 },
  ],
  addons: {
    perSquareFoot: [
      { id: "plotter-cut", name: "Plotter Cut", rate: 15 },
      { id: "lamination-one-side", name: "Lamination - One Side", rate: 40 },
      { id: "lamination-two-side", name: "Lamination - Two Side", rate: 80 },
      { id: "installation-tape", name: "Installation Tape", rate: 15 },
    ],
    perPiece: [
      { id: "eyelet", name: "Eyelet", rate: 1 },
      { id: "miscellaneous", name: "Miscellaneous", rate: 0 },
    ],
  },
};

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
  unit = "ft";

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

  setMaterial(materialId: string) {
    this.selectedMaterial = CONFIG.materials.find((m) => m.id === materialId) || null;
    if (this.selectedMaterial) {
      this.rate1 = this.selectedMaterial.baseRate;
    }
  }

  setRate1(rate: number) {
    this.rate1 = parseFloat(String(rate)) || 0;
  }

  setRate2(rate: number) {
    this.rate2 = parseFloat(String(rate)) || 0;
  }

  toggleAddon(
    type: "perSquareFoot" | "perPiece",
    addonId: string,
    isSelected: boolean,
    customRate: number | null = null
  ) {
    const addonList = CONFIG.addons[type];
    const addon = addonList.find((a) => a.id === addonId);
    if (!addon) return;

    if (isSelected) {
      this.selectedAddons[type].set(addonId, {
        ...addon,
        rate: customRate !== null ? parseFloat(String(customRate)) : addon.rate,
        quantity: type === "perPiece" ? 1 : undefined,
      });
    } else {
      this.selectedAddons[type].delete(addonId);
    }
  }

  updateAddonRate(type: "perSquareFoot" | "perPiece", addonId: string, rate: number) {
    if (this.selectedAddons[type].has(addonId)) {
      const addon = this.selectedAddons[type].get(addonId)!;
      addon.rate = parseFloat(String(rate)) || 0;
      this.selectedAddons[type].set(addonId, addon);
    }
  }

  updateAddonQuantity(
    type: "perSquareFoot" | "perPiece",
    addonId: string,
    quantity: number
  ) {
    if (type === "perPiece" && this.selectedAddons[type].has(addonId)) {
      const addon = this.selectedAddons[type].get(addonId)!;
      addon.quantity = Math.max(1, parseInt(String(quantity)) || 1);
      this.selectedAddons[type].set(addonId, addon);
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
    const breakdown = [];
    breakdown.push(
      `Base: ${this.formatDimension(totalSqFt)} × PHP ${this.formatNumber(
        baseRate
      )} = PHP ${this.formatNumber(totalSqFt * baseRate)}`
    );

    for (const addon of this.selectedAddons.perSquareFoot.values()) {
      const addonTotal = addon.rate * totalSqFt;
      breakdown.push(
        `${addon.name}: ${this.formatDimension(
          totalSqFt
        )} × PHP ${this.formatNumber(addon.rate)} = PHP ${this.formatNumber(addonTotal)}`
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
    return new Intl.NumberFormat("en-PH", {
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
      total1: total1,
      total2: total2,
      breakdown1: this.getBreakdown(this.rate1, totalSqFt),
      breakdown2: this.rate2 ? this.getBreakdown(this.rate2, totalSqFt) : [],
    };
  }
}

export default function LargeFormatCalculator() {
  const [calculator] = useState(() => new Calculator());
  const [length, setLength] = useState("");
  const [width, setWidth] = useState("");
  const [unit, setUnit] = useState("ft");
  const [materialSearch, setMaterialSearch] = useState("");
  const [showMaterialDropdown, setShowMaterialDropdown] = useState(false);
  const [rate1, setRate1] = useState("");
  const [rate2, setRate2] = useState("");
  const [selectedAddons, setSelectedAddons] = useState<
    Map<string, { type: "perSquareFoot" | "perPiece"; addon: SelectedAddon }>
  >(new Map());
  const [results, setResults] = useState<CalculationResults>({
    totalSquareFeet: 0,
    total1: 0,
    total2: 0,
    breakdown1: [],
    breakdown2: [],
  });

  const materialDropdownRef = useRef<HTMLDivElement>(null);

  // Handle outside click for material dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        materialDropdownRef.current &&
        !materialDropdownRef.current.contains(event.target as Node)
      ) {
        setShowMaterialDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Update calculations whenever dependencies change
  const updateCalculations = () => {
    const newResults = calculator.calculate();
    setResults(newResults);
  };

  // When unit changes
  useEffect(() => {
    calculator.setUnit(unit);
    updateCalculations();
  }, [unit]);

  // When dimensions change
  useEffect(() => {
    calculator.setDimensions(parseFloat(length) || 0, parseFloat(width) || 0);
    updateCalculations();
  }, [length, width]);

  // When rates change
  useEffect(() => {
    calculator.setRate1(parseFloat(rate1) || 0);
    updateCalculations();
  }, [rate1]);

  useEffect(() => {
    calculator.setRate2(parseFloat(rate2) || 0);
    updateCalculations();
  }, [rate2]);

  // Handle material selection
  const handleMaterialSelect = (material: Material) => {
    calculator.setMaterial(material.id);
    setMaterialSearch(
      `${material.name} - PHP ${formatNumber(material.baseRate)}`
    );
    setRate1(String(material.baseRate));
    setShowMaterialDropdown(false);
    updateCalculations();
  };

  // Handle add-on selection
  const handleAddonSelect = (value: string) => {
    if (!value) return;
    const [typeRaw, id] = value.split(":");
    const type = typeRaw as "perSquareFoot" | "perPiece";
    const addonList = CONFIG.addons[type];
    const addon = addonList.find((a) => a.id === id);
    if (!addon) return;

    calculator.toggleAddon(type, id, true);
    const newMap = new Map(selectedAddons);
    newMap.set(`${type}:${id}`, {
      type,
      addon: { ...addon, quantity: type === "perPiece" ? 1 : undefined },
    });
    setSelectedAddons(newMap);
    updateCalculations();
  };

  // Remove add-on
  const handleRemoveAddon = (type: "perSquareFoot" | "perPiece", id: string) => {
    calculator.toggleAddon(type, id, false);
    const newMap = new Map(selectedAddons);
    newMap.delete(`${type}:${id}`);
    setSelectedAddons(newMap);
    updateCalculations();
  };

  // Update add-on rate
  const handleAddonRateChange = (
    type: "perSquareFoot" | "perPiece",
    id: string,
    rate: string
  ) => {
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

  // Update add-on quantity
  const handleAddonQuantityChange = (
    type: "perSquareFoot" | "perPiece",
    id: string,
    quantity: string
  ) => {
    calculator.updateAddonQuantity(type, id, parseInt(quantity) || 1);
    const newMap = new Map(selectedAddons);
    const key = `${type}:${id}`;
    const existing = newMap.get(key);
    if (existing) {
      existing.addon.quantity = Math.max(1, parseInt(quantity) || 1);
      newMap.set(key, existing);
      setSelectedAddons(newMap);
    }
    updateCalculations();
  };

  // Format number
  const formatNumber = (number: number) => {
    return new Intl.NumberFormat("en-PH", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(number);
  };

  // Filter materials based on search
  const filteredMaterials = CONFIG.materials.filter((material) =>
    `${material.name} - PHP ${formatNumber(material.baseRate)}`
      .toLowerCase()
      .includes(materialSearch.toLowerCase())
  );

  return (
    <div className="min-h-screen flex flex-col items-center justify-start pt-4 -m-6 p-0 bg-gray-50">
      <div className="w-full max-w-3xl md:max-w-7xl mx-auto">
        <h1 className="text-2xl font-bold mb-8 text-center text-gray-800">
          Large Format Calculator
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 bg-white p-4 md:p-8 rounded-xl shadow-md">
          {/* Left side: Inputs */}
          <div className="space-y-4 md:space-y-6">
            {/* Job Details / Size */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-sm font-bold mb-2 text-gray-800">Size</h3>
              <div className="flex flex-col gap-3 md:gap-4">
                <div>
                  <label className="block text-sm font-bold mb-1 text-gray-700">Unit</label>
                  <select
                    className="w-full p-2 text-sm mb-1 md:text-base border border-gray-300 rounded"
                    value={unit}
                    onChange={(e) => {
                      setUnit(e.target.value);
                      calculator.setUnit(e.target.value);
                      updateCalculations();
                    }}
                  >
                    <option value="ft">Feet (ft)</option>
                    <option value="in">Inches (in)</option>
                    <option value="cm">Centimeters (cm)</option>
                    <option value="mm">Millimeters (mm)</option>
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-3 min-w-0">
                  <div>
                    <label className="block text-sm font-bold mb-1 text-gray-700">Length</label>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      className="w-full p-2 text-sm mb-1 md:text-base border border-gray-300 rounded"
                      value={length}
                      onChange={(e) => {
                        setLength(e.target.value);
                        calculator.setDimensions(parseFloat(e.target.value) || 0, parseFloat(width) || 0);
                        updateCalculations();
                      }}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold mb-1 text-gray-700">Width</label>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      className="w-full p-2 text-sm mb-1 md:text-base border border-gray-300 rounded"
                      value={width}
                      onChange={(e) => {
                        setWidth(e.target.value);
                        calculator.setDimensions(parseFloat(length) || 0, parseFloat(e.target.value) || 0);
                        updateCalculations();
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Material Search */}
            <div className="bg-gray-50 p-4 rounded-lg relative" ref={materialDropdownRef}>
              <h2 className="text-sm font-bold mb-2 text-gray-800">Material</h2>
              <input
                type="text"
                placeholder="Search material..."
                className="w-full p-2 text-sm mb-1 md:text-base border border-gray-300 rounded"
                value={materialSearch}
                onChange={(e) => {
                  setMaterialSearch(e.target.value);
                  setShowMaterialDropdown(true);
                }}
                onFocus={() => setShowMaterialDropdown(true)}
              />
              {showMaterialDropdown && (
                <div className="absolute z-50 top-full mt-1 w-full max-h-52 overflow-y-auto bg-white border border-gray-300 rounded shadow-lg">
                  {filteredMaterials.map((material) => (
                    <div
                      key={material.id}
                      className="p-2 text-sm mb-1 md:text-base cursor-pointer hover:bg-gray-100"
                      onClick={() => handleMaterialSelect(material)}
                    >
                      {material.name} - PHP {formatNumber(material.baseRate)}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Rate 1 */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-sm font-bold mb-2 text-gray-800">Rate (PHP per sq ft)</h3>
              <input
                type="number"
                min="0"
                step="0.01"
                className="w-full p-2 text-sm mb-1 md:text-base border border-gray-300 rounded"
                value={rate1}
                onChange={(e) => {
                  setRate1(e.target.value);
                  calculator.setRate1(parseFloat(e.target.value) || 0);
                  updateCalculations();
                }}
              />
            </div>

            {/* Rate 2 */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-sm font-bold mb-2 text-gray-800">Optional Rate (PHP per sq ft)</h3>
              <input
                type="number"
                min="0"
                step="0.01"
                className="w-full p-2 text-sm mb-1 md:text-base border border-gray-300 rounded"
                value={rate2}
                onChange={(e) => {
                  setRate2(e.target.value);
                  calculator.setRate2(parseFloat(e.target.value) || 0);
                  updateCalculations();
                }}
              />
            </div>

            {/* Add-ons */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-sm font-bold mb-2 text-gray-800">Add-ons</h3>
              <select
                className="w-full p-2 mb-1 text-sm md:text-base border border-gray-300 rounded"
                onChange={(e) => {
                  handleAddonSelect(e.target.value);
                  e.target.value = "";
                }}
                defaultValue=""
              >
                <option value="">Select Add-on</option>
                <optgroup label="Per Square Foot">
                  {CONFIG.addons.perSquareFoot.map((addon) => (
                    <option key={addon.id} value={`perSquareFoot:${addon.id}`}>
                      {addon.name} (PHP {formatNumber(addon.rate)} / sq ft)
                    </option>
                  ))}
                </optgroup>
                <optgroup label="Per Piece">
                  {CONFIG.addons.perPiece.map((addon) => (
                    <option key={addon.id} value={`perPiece:${addon.id}`}>
                      {addon.name} (PHP {formatNumber(addon.rate)} / piece)
                    </option>
                  ))}
                </optgroup>
              </select>

              {/* Selected Add-ons */}
              {selectedAddons.size > 0 && (
                <div className="mt-3 space-y-2">
                  {[...selectedAddons.values()].map(({ type, addon }) => (
                    <div key={`${type}:${addon.id}`} className="flex items-center justify-between bg-gray-100 p-2 rounded">
                      <div className="flex flex-col">
                        <span className="font-medium text-gray-800">{addon.name}</span>
                        <span className="text-xs text-gray-600">
                          {type === "perSquareFoot"
                            ? `PHP ${formatNumber(addon.rate)} / sq ft`
                            : `PHP ${formatNumber(addon.rate)} / piece`}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        {type === "perPiece" && (
                          <input
                            type="number"
                            min="1"
                            className="w-16 p-1 text-sm border border-gray-300 rounded"
                            value={addon.quantity}
                            onChange={(e) => handleAddonQuantityChange(type, addon.id, e.target.value)}
                          />
                        )}
                        <input
                          type="number"
                          min="0"
                          className="w-20 p-1 text-sm border border-gray-300 rounded"
                          value={addon.rate}
                          onChange={(e) => handleAddonRateChange(type, addon.id, e.target.value)}
                        />
                        <button
                          className="px-2 py-1 text-xs text-white bg-red-500 rounded hover:bg-red-600"
                          onClick={() => handleRemoveAddon(type, addon.id)}
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right side: Results */}
          <div className="space-y-4 md:space-y-6">
            <h2 className="text-lg font-bold mb-4 text-gray-800">
              Calculation Results
            </h2>

            {/* Total Area */}
            <div className="bg-gray-50 p-4 rounded-lg text-center">
              <h3 className="text-sm font-bold mb-2 text-gray-800">Total Area</h3>
              <div className="flex flex-wrap items-center justify-center gap-3 md:gap-4 text-gray-800">
                <div className="flex flex-col items-center min-w-[70px]">
                  <span className="font-medium text-lg md:text-xl">
                    {formatNumber(calculator.length / Calculator.UNIT_CONVERSIONS[unit])}
                  </span>
                  <small className="text-xs md:text-sm uppercase font-medium text-gray-600">
                    Length
                  </small>
                </div>
                <div className="flex items-center justify-center font-medium text-lg md:text-xl">
                  ×
                </div>
                <div className="flex flex-col items-center min-w-[70px]">
                  <span className="font-medium text-lg md:text-xl">
                    {formatNumber(calculator.width / Calculator.UNIT_CONVERSIONS[unit])}
                  </span>
                  <small className="text-xs md:text-sm uppercase font-medium text-gray-600">
                    Width
                  </small>
                </div>
                <div className="flex items-center justify-center font-medium text-lg md:text-xl">
                  =
                </div>
                <div className="flex flex-col items-center min-w-[110px]">
                  <span className="font-medium text-lg md:text-xl">
                    {formatNumber(results.totalSquareFeet)}
                  </span>
                  <small className="text-xs md:text-sm uppercase font-medium text-gray-600">
                    sq/{unit}
                  </small>
                </div>
              </div>
            </div>

            {/* Total Rate 1 */}
            <div className="bg-gray-50 p-4 rounded-lg text-center">
              <h3 className="text-sm font-bold mb-2 text-gray-800">Total (Base Rate 1)</h3>
              <p className="text-xs md:text-lg font-semibold text-gray-800">
                PHP {formatNumber(results.total1)}
              </p>
              <div className="mt-3 space-y-1 text-xs text-gray-600 text-left">
                {results.breakdown1.map((line, index) => (
                  <div key={index}>{line}</div>
                ))}
              </div>
            </div>

            {/* Total Rate 2 */}
            <div className="bg-gray-50 p-4 rounded-lg text-center">
              <h3 className="text-sm font-bold mb-2 text-gray-800">Total (Base Rate 2)</h3>
              <p className="text-xs md:text-lg font-semibold text-gray-800">
                PHP {formatNumber(results.total2)}
              </p>
              {results.breakdown2.length > 0 && (
                <div className="mt-3 space-y-1 text-xs text-gray-600 text-left">
                  {results.breakdown2.map((line, index) => (
                    <div key={index}>{line}</div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );


}