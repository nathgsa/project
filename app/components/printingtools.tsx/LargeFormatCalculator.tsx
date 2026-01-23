import React, { useState } from "react";

// ---------------- CONFIG ----------------
const MATERIALS = [
  { id: "vinyl-gloss", name: "Vinyl Gloss", baseRate: 60 },
  { id: "vinyl-matte", name: "Vinyl Matte", baseRate: 70 },
  { id: "clear-sticker", name: "Clear Sticker", baseRate: 70 },
  { id: "avery-sticker", name: "Avery Sticker", baseRate: 100 },
  { id: "3m-reflectorize", name: "3M Reflectorize", baseRate: 200 },
  { id: "photo-paper-matte", name: "Photo Paper Matte", baseRate: 70 },
  { id: "photo-paper-glossy", name: "Photo Paper Glossy", baseRate: 60 },
  { id: "sintra-3mm", name: "Sticker Sintra 3MM", baseRate: 130 },
  { id: "sintra-3mm-fb", name: "Sticker Sintra 3MM - Front & Back", baseRate: 190 },
  { id: "sintra-5mm", name: "Sticker Sintra 5MM", baseRate: 150 },
  { id: "sintra-5mm-fb", name: "Sticker Sintra 5MM - Front & Back", baseRate: 210 },
  { id: "pvc-sticker", name: "PVC on Sticker", baseRate: 220 },
  { id: "tarp-8oz", name: "Tarp (8oz.)", baseRate: 10 },
  { id: "tarp-10oz", name: "Tarp (10oz.)", baseRate: 15 },
  { id: "tarp-black-15oz", name: "Tarp Black 15oz.", baseRate: 25 },
  { id: "panaflex", name: "Panaflex", baseRate: 80 },
];

const ADDONS = {
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
};

const UNIT_CONVERSIONS: Record<string, number> = {
  ft: 1,
  in: 1 / 12,
  cm: 0.0328084,
  mm: 0.00328084,
};

// ---------------- CALCULATOR CLASS ----------------
class Calculator {
  length = 0;
  width = 0;
  selectedMaterial: typeof MATERIALS[number] | null = null;
  rate1 = 0;
  rate2 = 0;
  selectedAddons: { perSquareFoot: Map<string, any>; perPiece: Map<string, any> } = {
    perSquareFoot: new Map(),
    perPiece: new Map(),
  };
  unit: string = "ft";

  setUnit(unit: string) {
    this.unit = unit;
    this.setDimensions(this.length, this.width);
  }

  setDimensions(length: number, width: number) {
    const factor = UNIT_CONVERSIONS[this.unit];
    this.length = (length || 0) * factor;
    this.width = (width || 0) * factor;
  }

  setMaterial(materialId: string) {
    const mat = MATERIALS.find((m) => m.id === materialId);
    this.selectedMaterial = mat || null;
    if (mat) this.rate1 = mat.baseRate;
  }

  setRate1(rate: number) { this.rate1 = rate; }
  setRate2(rate: number) { this.rate2 = rate; }

  toggleAddon(type: "perSquareFoot" | "perPiece", addonId: string, isSelected: boolean, customRate: number | null = null) {
    const addonList = ADDONS[type];
    const addon = addonList.find((a) => a.id === addonId);
    if (!addon) return;
    if (isSelected) {
      this.selectedAddons[type].set(addonId, { ...addon, rate: customRate ?? addon.rate, quantity: type === "perPiece" ? 1 : undefined });
    } else {
      this.selectedAddons[type].delete(addonId);
    }
  }

  updateAddonRate(type: "perSquareFoot" | "perPiece", addonId: string, rate: number) {
    if (this.selectedAddons[type].has(addonId)) {
      const addon = this.selectedAddons[type].get(addonId);
      addon.rate = rate;
      this.selectedAddons[type].set(addonId, addon);
    }
  }

  updateAddonQuantity(type: "perPiece", addonId: string, quantity: number) {
    if (this.selectedAddons[type].has(addonId)) {
      const addon = this.selectedAddons[type].get(addonId);
      addon.quantity = Math.max(1, quantity);
      this.selectedAddons[type].set(addonId, addon);
    }
  }

  calculateTotalSquareFeet() {
    return this.length * this.width;
  }

  calculateAddons(totalSqFt: number) {
    let total = 0;
    this.selectedAddons.perSquareFoot.forEach((addon) => (total += addon.rate * totalSqFt));
    this.selectedAddons.perPiece.forEach((addon) => (total += addon.rate * addon.quantity));
    return total;
  }

  calculate() {
    const totalSqFt = this.calculateTotalSquareFeet();
    const addonsTotal = this.calculateAddons(totalSqFt);
    const total1 = this.rate1 * totalSqFt + addonsTotal;
    const total2 = this.rate2 ? this.rate2 * totalSqFt + addonsTotal : 0;
    return { totalSqFt, total1, total2 };
  }
}

// ---------------- REACT COMPONENT ----------------
const LargeFormatCalculator: React.FC = () => {
  const [length, setLength] = useState<number>(0);
  const [width, setWidth] = useState<number>(0);
  const [unit, setUnit] = useState<string>("ft");
  const [material, setMaterial] = useState<string>("");
  const [calc] = useState<Calculator>(new Calculator());
  const [total, setTotal] = useState<{ totalSqFt: number; total1: number; total2: number }>({
    totalSqFt: 0,
    total1: 0,
    total2: 0,
  });

  const handleCalculate = () => {
    calc.setUnit(unit);
    calc.setDimensions(length, width);
    calc.setMaterial(material);
    setTotal(calc.calculate());
  };

  return (
    <div className="calculator-container">
      <h1>Large Format Calculator</h1>
      <div className="inputs">
        <input type="number" placeholder="Length" value={length} onChange={(e) => setLength(Number(e.target.value))} />
        <input type="number" placeholder="Width" value={width} onChange={(e) => setWidth(Number(e.target.value))} />
        <select value={unit} onChange={(e) => setUnit(e.target.value)}>
          <option value="ft">ft</option>
          <option value="in">in</option>
          <option value="cm">cm</option>
          <option value="mm">mm</option>
        </select>
        <select value={material} onChange={(e) => setMaterial(e.target.value)}>
          <option value="">Select Material</option>
          {MATERIALS.map((m) => (
            <option key={m.id} value={m.id}>
              {m.name}
            </option>
          ))}
        </select>
        <button onClick={handleCalculate}>Calculate</button>
      </div>
      <div className="results">
        <p>Total Area: {total.totalSqFt.toFixed(2)} sq ft</p>
        <p>Total Price 1: ₱{total.total1.toFixed(2)}</p>
        <p>Total Price 2: ₱{total.total2.toFixed(2)}</p>
      </div>
    </div>
  );
};

export default LargeFormatCalculator;
