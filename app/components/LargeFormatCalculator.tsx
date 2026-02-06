"use client";

import { useState, useEffect, useRef } from "react";
import React from 'react';

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
    const [type, id] = value.split(":") as ["perSquareFoot" | "perPiece", string];
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


  const LargeFormatCalculator: React.FC = () => {
    return (
      <div className="min-h-screen bg-[#f5f6fa] p-5">
        <div className="mx-auto w-full max-w-[1200px]">
          {/* Title */}
          <h1 className="mb-8 text-center text-3xl font-semibold text-[#2c3e50]">
            Large Format Calculator
          </h1>

          {/* Main Grid */}
          <div className="grid grid-cols-1 gap-8 rounded-[10px] bg-white p-8 shadow md:grid-cols-2">
            {/* ================= LEFT SIDE ================= */}
            <div className="space-y-6">
              {/* Job Details */}
              <div className="rounded-lg bg-[#f5f6fa] p-4">
                <h3 className="mb-4 text-lg font-medium text-[#2c3e50]">
                  Job Details
                </h3>

                {/* Size Inputs */}
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div>
                    <label className="mb-2 block font-medium text-[#2c3e50]">
                      Length (ft)
                    </label>
                    <input
                      type="number"
                      className="w-full rounded border border-gray-300 p-2 focus:border-blue-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block font-medium text-[#2c3e50]">
                      Width (ft)
                    </label>
                    <input
                      type="number"
                      className="w-full rounded border border-gray-300 p-2 focus:border-blue-500 focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Quantity */}
              <div className="rounded-lg bg-[#f5f6fa] p-4">
                <label className="mb-2 block font-medium text-[#2c3e50]">
                  Quantity
                </label>
                <input
                  type="number"
                  className="w-full rounded border border-gray-300 p-2 focus:border-blue-500 focus:outline-none"
                />
              </div>

              {/* Material */}
              <div className="rounded-lg bg-[#f5f6fa] p-4">
                <label className="mb-2 block font-medium text-[#2c3e50]">
                  Material
                </label>

                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search materials..."
                    className="w-full rounded border border-gray-300 p-2 focus:border-blue-500 focus:outline-none"
                  />

                  {/* Dropdown */}
                  <div className="absolute z-50 mt-1 max-h-52 w-full overflow-y-auto rounded border border-gray-300 bg-white shadow">
                    <div className="cursor-pointer p-2 hover:bg-gray-100">
                      Vinyl Gloss – ₱60.00
                    </div>
                    <div className="cursor-pointer p-2 hover:bg-gray-100">
                      Tarpaulin – ₱35.00
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* ================= RIGHT SIDE ================= */}
            <div className="space-y-6">
              {/* Calculation Display */}
              <div className="rounded-lg bg-[#f5f6fa] p-4">
                <h3 className="mb-4 text-lg font-medium text-[#2c3e50]">
                  Dimension Calculation
                </h3>

                <div className="flex flex-wrap items-center justify-center gap-4 text-[#2c3e50]">
                  <div className="flex min-w-[80px] flex-col items-center">
                    <span className="text-xl font-medium">10.00</span>
                    <small className="text-xs uppercase tracking-wide text-gray-500">
                      Length
                    </small>
                  </div>

                  <span className="text-xl">×</span>

                  <div className="flex min-w-[80px] flex-col items-center">
                    <span className="text-xl font-medium">5.00</span>
                    <small className="text-xs uppercase tracking-wide text-gray-500">
                      Width
                    </small>
                  </div>

                  <span className="text-xl">=</span>

                  <div className="flex min-w-[120px] flex-col items-center">
                    <span className="text-xl font-medium">50.00</span>
                    <small className="text-xs uppercase tracking-wide text-gray-500">
                      Sq Ft
                    </small>
                  </div>
                </div>
              </div>

              {/* Price Summary */}
              <div className="rounded-lg bg-[#f5f6fa] p-4">
                <h3 className="mb-4 text-lg font-medium text-[#2c3e50]">
                  Price Summary
                </h3>

                <div className="space-y-2 text-[#2c3e50]">
                  <div className="flex justify-between">
                    <span>Price per sq ft</span>
                    <span>₱60.00</span>
                  </div>

                  <div className="flex justify-between">
                    <span>Total Area</span>
                    <span>50.00</span>
                  </div>

                  <div className="flex justify-between font-semibold">
                    <span>Total Price</span>
                    <span>₱3,000.00</span>
                  </div>
                </div>
              </div>

              {/* Action */}
              <button className="w-full rounded bg-blue-600 py-3 font-medium text-white hover:bg-blue-700">
                Calculate
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };
  }