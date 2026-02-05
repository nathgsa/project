"use client";

import React, { useState } from "react";

const EWTCalculator: React.FC = () => {
  const [paymentAmount, setPaymentAmount] = useState<number | "">("");
  const [showResults, setShowResults] = useState(false);
  const [message, setMessage] = useState("");

  const [results, setResults] = useState({
    vatable: { ewt1: 0, net1: 0, ewt2: 0, net2: 0, base: 0 },
    zeroRated: { ewt1: 0, net1: 0, ewt2: 0, net2: 0, base: 0 },
  });

  const formatNumber = (num: number) =>
    num.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  const showMessage = (msg: string) => {
    setMessage(msg);
    setTimeout(() => setMessage(""), 3000);
  };

  const handleCalculate = (e: React.FormEvent) => {
    e.preventDefault();
    if (paymentAmount === "" || paymentAmount <= 0) {
      showMessage("Please enter a valid payment amount.");
      setShowResults(false);
      return;
    }

    const vatableBase = paymentAmount / 1.12;
    const vatableEwt1 = vatableBase * 0.01;
    const vatableNet1 = paymentAmount - vatableEwt1;
    const vatableEwt2 = vatableBase * 0.02;
    const vatableNet2 = paymentAmount - vatableEwt2;

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
    // 🔥 REMOVE MOBILE PADDING COMPLETELY
    <div className="min-h-screen w-full flex flex-col items-stretch p-0 sm:p-4 font-inter">
      
      {message && (
        <div className="fixed top-2 right-2 bg-red-500 text-white py-1 px-2 rounded-md shadow-lg z-50 text-sm">
          {message}
        </div>
      )}

      {/* 🔥 EDGE-TO-EDGE ON MOBILE */}
      <div className="w-full flex flex-col bg-gradient-to-br from-white to-gray-200 shadow-lg rounded-none sm:rounded-xl p-1 sm:p-4">
        
        <div className="text-center mb-2 sm:mb-6">
          <h1 className="text-lg sm:text-3xl font-bold text-gray-800">EWT Calculator</h1>
          <p className="text-gray-500 text-xs sm:text-base">
            Calculate all EWT combinations for a given payment amount.
          </p>
        </div>

        <form onSubmit={handleCalculate} className="flex flex-col gap-2 sm:gap-4 w-full">
          <div>
            <label className="text-xs sm:text-xl font-semibold text-gray-700">
              Total Invoice Amount
            </label>

            <div className="relative">
              <span className="absolute left-1 inset-y-0 flex items-center text-gray-500 text-xs">₱</span>
              <input
                type="number"
                className="w-full pl-6 pr-2 py-1 sm:py-3 border border-gray-300 rounded-none sm:rounded-lg text-sm sm:text-lg"
                value={paymentAmount}
                onChange={(e) =>
                  setPaymentAmount(e.target.value === "" ? "" : parseFloat(e.target.value))
                }
              />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-1 sm:gap-4">
            <button className="bg-blue-700 text-white py-2 sm:py-4 rounded-none sm:rounded-xl">
              Calculate All
            </button>
            <button
              type="button"
              onClick={handleClear}
              className="bg-gray-500 text-white py-2 sm:py-4 rounded-none sm:rounded-xl"
            >
              Clear
            </button>
          </div>
        </form>
      </div>

      {/* 🔥 RESULTS EDGE-TO-EDGE */}
      {showResults && (
        <div className="mt-1 sm:mt-6 grid grid-cols-1 md:grid-cols-2 gap-1 sm:gap-4">
          <div className="bg-black text-white p-2 sm:p-4 rounded-none sm:rounded-xl">
            VATABLE RESULTS
          </div>
          <div className="bg-black text-white p-2 sm:p-4 rounded-none sm:rounded-xl">
            ZERO-RATED RESULTS
          </div>
        </div>
      )}
    </div>
  );
};

export default EWTCalculator;
