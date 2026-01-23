"use client"

import React, { useState } from "react";
// import "@/app/style/printer.module.css"

// ---------- CONFIG ----------
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
    { id: "sintra-5mm-fb", name: "Sticker Sintra 5MM - Front & Back", baseRate: 210.0 },
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

// ---------- CALCULATOR CLASS ----------
class Calculator {
  length = 0;
  width = 0;
  selectedMaterial: any = null;
  rate1 = 0;
  rate2 = 0;
  selectedAddons = { perSquareFoot: new Map(), perPiece: new Map() };
  unit: "ft" | "in" | "cm" | "mm" = "ft";

  static UNIT_CONVERSIONS: Record<string, number> = {
    ft: 1,
    in: 1 / 12,
    cm: 0.0328084,
    mm: 0.00328084,
  };

  setUnit(unit: "ft" | "in" | "cm" | "mm") {
    this.unit = unit;
    this.setDimensions(this.length, this.width);
  }

  setDimensions(length: number, width: number) {
    const factor = Calculator.UNIT_CONVERSIONS[this.unit];
    this.length = (parseFloat(length as any) || 0) * factor;
    this.width = (parseFloat(width as any) || 0) * factor;
  }

  setMaterial(materialId: string) {
    this.selectedMaterial = CONFIG.materials.find((m) => m.id === materialId) || null;
    if (this.selectedMaterial) this.rate1 = this.selectedMaterial.baseRate;
  }

  setRate1(rate: number) {
    this.rate1 = parseFloat(rate as any) || 0;
  }

  setRate2(rate: number) {
    this.rate2 = parseFloat(rate as any) || 0;
  }

  toggleAddon(type: "perSquareFoot" | "perPiece", addonId: string, isSelected: boolean, customRate: number | null = null) {
    const addonList = CONFIG.addons[type];
    const addon = addonList.find((a) => a.id === addonId);
    if (!addon) return;
    if (isSelected) {
      this.selectedAddons[type].set(addonId, {
        ...addon,
        rate: customRate !== null ? parseFloat(customRate as any) : addon.rate,
        quantity: type === "perPiece" ? 1 : undefined,
      });
    } else {
      this.selectedAddons[type].delete(addonId);
    }
  }

  updateAddonRate(type: "perSquareFoot" | "perPiece", addonId: string, rate: number) {
    if (this.selectedAddons[type].has(addonId)) {
      const addon = this.selectedAddons[type].get(addonId);
      addon.rate = parseFloat(rate as any) || 0;
      this.selectedAddons[type].set(addonId, addon);
    }
  }

  updateAddonQuantity(type: "perPiece", addonId: string, quantity: number) {
    if (this.selectedAddons[type].has(addonId)) {
      const addon = this.selectedAddons[type].get(addonId);
      addon.quantity = Math.max(1, parseInt(quantity as any) || 1);
      this.selectedAddons[type].set(addonId, addon);
    }
  }

  calculateTotalSquareFeet() {
    return this.length * this.width;
  }

  calculateAddons(totalSqFt: number) {
    let total = 0;
    for (const addon of this.selectedAddons.perSquareFoot.values()) total += addon.rate * totalSqFt;
    for (const addon of this.selectedAddons.perPiece.values()) total += addon.rate * addon.quantity;
    return total;
  }

  getBreakdown(baseRate: number, totalSqFt: number) {
    const breakdown: string[] = [];
    breakdown.push(`Base: ${this.formatDimension(totalSqFt)} × PHP ${this.formatNumber(baseRate)} = PHP ${this.formatNumber(totalSqFt * baseRate)}`);
    for (const addon of this.selectedAddons.perSquareFoot.values()) breakdown.push(`${addon.name}: ${this.formatDimension(totalSqFt)} × PHP ${this.formatNumber(addon.rate)} = PHP ${this.formatNumber(addon.rate * totalSqFt)}`);
    for (const addon of this.selectedAddons.perPiece.values()) breakdown.push(`${addon.name}: ${addon.quantity} pc × PHP ${this.formatNumber(addon.rate)} = PHP ${this.formatNumber(addon.rate * addon.quantity)}`);
    return breakdown;
  }

  formatDimension(value: number) {
    const factor = 1 / Calculator.UNIT_CONVERSIONS[this.unit];
    return `${this.formatNumber(value * factor)} ${this.unit}`;
  }

  formatNumber(number: number) {
    return new Intl.NumberFormat("en-PH", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(number);
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

// ---------- REACT COMPONENT ----------
const LargeFormatCalculator: React.FC = () => {
  const [calculator] = useState(new Calculator());
  const [, setUpdate] = useState(0); // force re-render

  const forceUpdate = () => setUpdate((u) => u + 1);

  // --- HANDLERS ---
  const handleDimensionChange = (e: React.ChangeEvent<HTMLInputElement>, type: "length" | "width") => {
    const value = parseFloat(e.target.value) || 0;
    type === "length" ? calculator.setDimensions(value, calculator.width) : calculator.setDimensions(calculator.length, value);
    forceUpdate();
  };

  const handleUnitChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    calculator.setUnit(e.target.value as any);
    forceUpdate();
  };

  const handleMaterialChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    calculator.setMaterial(e.target.value);
    forceUpdate();
  };

  const handleAddonToggle = (type: "perSquareFoot" | "perPiece", addonId: string, isChecked: boolean) => {
    calculator.toggleAddon(type, addonId, isChecked);
    forceUpdate();
  };

  const { total1, total2, breakdown1, breakdown2, totalSquareFeet } = calculator.calculate();

  return (
  <div className="container mx-auto p-6">
    <h1 className="text-3xl font-bold mb-6 text-center">Large Format Calculator</h1>

    <div className="grid md:grid-cols-2 gap-8">
      {/* Input Section */}
      <div className="bg-white p-6 rounded-lg shadow-md space-y-6">
        {/* Unit Selector */}
        <div className="flex flex-col">
          <label className="mb-2 font-medium">Unit:</label>
          <select
            value={calculator.unit}
            onChange={handleUnitChange}
            className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            <option value="ft">ft</option>
            <option value="in">in</option>
            <option value="cm">cm</option>
            <option value="mm">mm</option>
          </select>
        </div>

        {/* Length */}
        <div className="flex flex-col">
          <label className="mb-2 font-medium">Length:</label>
          <input
            type="number"
            value={calculator.length}
            onChange={(e) => handleDimensionChange(e, "length")}
            className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        {/* Width */}
        <div className="flex flex-col">
          <label className="mb-2 font-medium">Width:</label>
          <input
            type="number"
            value={calculator.width}
            onChange={(e) => handleDimensionChange(e, "width")}
            className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        {/* Material */}
        <div className="flex flex-col">
          <label className="mb-2 font-medium">Material:</label>
          <select
            value={calculator.selectedMaterial?.id || ""}
            onChange={handleMaterialChange}
            className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            <option value="">Select Material</option>
            {CONFIG.materials.map((m) => (
              <option key={m.id} value={m.id}>{m.name}</option>
            ))}
          </select>
        </div>

        {/* Per Square Foot Addons */}
        <div className="space-y-2">
          <h3 className="font-medium text-lg">Per Square Foot Addons:</h3>
          {CONFIG.addons.perSquareFoot.map((addon) => (
            <label key={addon.id} className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={calculator.selectedAddons.perSquareFoot.has(addon.id)}
                onChange={(e) =>
                  handleAddonToggle("perSquareFoot", addon.id, e.target.checked)
                }
                className="form-checkbox h-5 w-5 text-blue-500"
              />
              <span>{addon.name} (PHP {addon.rate})</span>
            </label>
          ))}
        </div>

        {/* Per Piece Addons */}
        <div className="space-y-2">
          <h3 className="font-medium text-lg">Per Piece Addons:</h3>
          {CONFIG.addons.perPiece.map((addon) => (
            <label key={addon.id} className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={calculator.selectedAddons.perPiece.has(addon.id)}
                onChange={(e) =>
                  handleAddonToggle("perPiece", addon.id, e.target.checked)
                }
                className="form-checkbox h-5 w-5 text-blue-500"
              />
              <span>{addon.name} (PHP {addon.rate})</span>
            </label>
          ))}
        </div>
      </div>

      {/* Output Section */}
      <div className="bg-white p-6 rounded-lg shadow-md space-y-6">
        <div className="space-y-2">
          <h3 className="font-semibold text-lg">Total Square Feet</h3>
          <span id="total-sqft" className="text-xl font-bold">
            {calculator.formatNumber(totalSquareFeet)}
          </span>
        </div>

        <div className="space-y-2">
          <h3 className="font-semibold text-lg">Total 1</h3>
          <span className="text-xl font-bold">PHP {calculator.formatNumber(total1)}</span>
          <div className="text-sm text-gray-600 space-y-1">
            {breakdown1.map((line, i) => (
              <div key={i}>{line}</div>
            ))}
          </div>
        </div>

        {calculator.rate2 > 0 && (
          <div className="space-y-2">
            <h3 className="font-semibold text-lg">Total 2</h3>
            <span className="text-xl font-bold">PHP {calculator.formatNumber(total2)}</span>
            <div className="text-sm text-gray-600 space-y-1">
              {breakdown2.map((line, i) => (
                <div key={i}>{line}</div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  </div>
);

};

export default LargeFormatCalculator;
