"use client"

import React, { useState } from "react";

const EWTCalculator: React.FC = () => {
  const [paymentAmount, setPaymentAmount] = useState<number | "">("");
  const [showResults, setShowResults] = useState(false);
  const [message, setMessage] = useState("");

  // Result state
  const [results, setResults] = useState({
    vatable: { ewt1: 0, net1: 0, ewt2: 0, net2: 0, base: 0 },
    zeroRated: { ewt1: 0, net1: 0, ewt2: 0, net2: 0, base: 0 },
  });

  // Format number helper
  const formatNumber = (num: number) => {
    return num.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  // Show temporary message
  const showMessage = (msg: string) => {
    setMessage(msg);
    setTimeout(() => setMessage(""), 3000);
  };

  // Calculate function
  const handleCalculate = (e: React.FormEvent) => {
    e.preventDefault();

    if (paymentAmount === "" || paymentAmount <= 0) {
      showMessage("Please enter a valid payment amount.");
      setShowResults(false);
      return;
    }

    // VATable calculations
    const vatableBase = paymentAmount / 1.12;
    const vatableEwt1 = vatableBase * 0.01;
    const vatableNet1 = paymentAmount - vatableEwt1;
    const vatableEwt2 = vatableBase * 0.02;
    const vatableNet2 = paymentAmount - vatableEwt2;

    // Zero-Rated / Non-VAT calculations
    const zeroBase = paymentAmount;
    const zeroEwt1 = zeroBase * 0.01;
    const zeroNet1 = paymentAmount - zeroEwt1;
    const zeroEwt2 = zeroBase * 0.02;
    const zeroNet2 = paymentAmount - zeroEwt2;

    setResults({
      vatable: { ewt1: vatableEwt1, net1: vatableNet1, ewt2: vatableEwt2, net2: vatableNet2, base: vatableBase },
      zeroRated: { ewt1: zeroEwt1, net1: zeroNet1, ewt2: zeroEwt2, net2: zeroNet2, base: zeroBase },
    });

    setShowResults(true);
  };

  const handleClear = () => {
    setPaymentAmount("");
    setShowResults(false);
  };

  return (
    <div className="min-h-screen  flex flex-col items-center justify-center pt-4 -m-6 p-0 font-inter">
      {/* Message Box */}
      {message && (
        <div className="fixed top-5 right-5 bg-red-500 text-white py-2 px-4 rounded-lg shadow-lg z-50">
          {message}
        </div>
      )}

      {/* Calculator Card */}
      <div className="w-full max-w-5xl bg-gradient-to-br from-white to-gray-200 shadow-lg rounded-2xl p-6 md:p-10">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-900 to-slate-900 bg-clip-text text-transparent">EWT Calculator</h1>
          <p className="text-gray-500 mt-2">Calculate all EWT combinations for a given payment amount.</p>
        </div>

        <form onSubmit={handleCalculate} className="space-y-6">
          {/* Payment Amount Input */}
          <div>
            <label htmlFor="payment-amount" className="block text-lg font-semibold text-gray-700 mb-2">
              Total Invoice Amount
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">₱</span>
              <input
                type="number"
                id="payment-amount"
                placeholder="e.g., 10000"
                className="w-full pl-8 pr-4 py-3 text-lg border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-300"
                step="0.01"
                value={paymentAmount}
                onChange={(e) => setPaymentAmount(e.target.value === "" ? "" : parseFloat(e.target.value))}
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
            <button type="submit" className="w-full bg-blue-700 hover:bg-blue-600 text-white font-bold py-4 rounded-lg text-lg transition">
              Calculate All
            </button>
            <button
              type="button"
              onClick={handleClear}
              className="w-full bg-gray-500 hover:bg-gray-600 text-white font-bold py-4 rounded-lg text-lg transition"
            >
              Clear
            </button>
          </div>
        </form>
      </div>

      {/* Results Display */}
      {showResults && (
        <div className="mt-8 w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* VATable Column */}
          <div className="bg-gradient-to-r from-gray-700 to-black text-white rounded-2xl p-6">
            <h3 className="text-xl font-bold text-center mb-4">With 12% VAT</h3>

            {/* 1% */}
            <div className="mb-6">
              <h4 className="font-semibold text-lg text-blue-300 mb-2">@ 1% EWT (Goods)</h4>
              <div className="space-y-2 text-md">
                <div className="flex justify-between items-center"><span className="text-gray-400">Tax Base:</span> <span className="font-semibold">₱ {formatNumber(results.vatable.base)}</span></div>
                <div className="flex justify-between items-center"><span className="text-gray-400">EWT Amount:</span> <span className="font-semibold text-red-400">- ₱ {formatNumber(results.vatable.ewt1)}</span></div>
                <div className="flex justify-between items-center text-lg"><span className="text-green-400">Net Amount:</span> <span className="font-bold text-green-400">₱ {formatNumber(results.vatable.net1)}</span></div>
              </div>
            </div>

            <hr className="border-gray-600" />

            {/* 2% */}
            <div className="mt-6">
              <h4 className="font-semibold text-lg text-blue-300 mb-2">@ 2% EWT (Services)</h4>
              <div className="space-y-2 text-md">
                <div className="flex justify-between items-center"><span className="text-gray-400">Tax Base:</span> <span className="font-semibold">₱ {formatNumber(results.vatable.base)}</span></div>
                <div className="flex justify-between items-center"><span className="text-gray-400">EWT Amount:</span> <span className="font-semibold text-red-400">- ₱ {formatNumber(results.vatable.ewt2)}</span></div>
                <div className="flex justify-between items-center text-lg"><span className="text-green-400">Net Amount:</span> <span className="font-bold text-green-400">₱ {formatNumber(results.vatable.net2)}</span></div>
              </div>
            </div>
          </div>

          {/* Zero-Rated Column */}
          <div className="bg-gradient-to-r from-gray-700 to-black text-white rounded-2xl p-6">
            <h3 className="text-xl font-bold text-center mb-4">Zero-Rated / Non-VAT</h3>

            {/* 1% */}
            <div className="mb-6">
              <h4 className="font-semibold text-lg text-blue-300 mb-2">@ 1% EWT (Goods)</h4>
              <div className="space-y-2 text-md">
                <div className="flex justify-between items-center"><span className="text-gray-400">Tax Base:</span> <span className="font-semibold">₱ {formatNumber(results.zeroRated.base)}</span></div>
                <div className="flex justify-between items-center"><span className="text-gray-400">EWT Amount:</span> <span className="font-semibold text-red-400">- ₱ {formatNumber(results.zeroRated.ewt1)}</span></div>
                <div className="flex justify-between items-center text-lg"><span className="text-green-400">Net Amount:</span> <span className="font-bold text-green-400">₱ {formatNumber(results.zeroRated.net1)}</span></div>
              </div>
            </div>

            <hr className="border-gray-600" />

            {/* 2% */}
            <div className="mt-6">
              <h4 className="font-semibold text-lg text-blue-300 mb-2">@ 2% EWT (Services)</h4>
              <div className="space-y-2 text-md">
                <div className="flex justify-between items-center"><span className="text-gray-400">Tax Base:</span> <span className="font-semibold">₱ {formatNumber(results.zeroRated.base)}</span></div>
                <div className="flex justify-between items-center"><span className="text-gray-400">EWT Amount:</span> <span className="font-semibold text-red-400">- ₱ {formatNumber(results.zeroRated.ewt2)}</span></div>
                <div className="flex justify-between items-center text-lg"><span className="text-green-400">Net Amount:</span> <span className="font-bold text-green-400">₱ {formatNumber(results.zeroRated.net2)}</span></div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EWTCalculator;
