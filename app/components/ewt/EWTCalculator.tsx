"use client"

import { useMemo, useState } from "react"

type NumberFormatter = (num: number) => string

export default function EWTCalculator() {
  const [paymentAmount, setPaymentAmount] = useState<number | "">("")
  const [resultsVisible, setResultsVisible] = useState(false)
  const [message, setMessage] = useState("")

  const showMessage = (msg: string) => {
    setMessage(msg)
    setTimeout(() => setMessage(""), 3000)
  }

  const formatNumber: NumberFormatter = (num) =>
    num.toLocaleString("en-US", { minimumFractionDigits: 2 })

  const handleCalculate = (e: React.FormEvent) => {
    e.preventDefault()
    if (paymentAmount === "" || paymentAmount <= 0) {
      showMessage("Please enter a valid payment amount.")
      setResultsVisible(false)
      return
    }
    setResultsVisible(true)
  }

  const calculations = useMemo(() => {
    if (!resultsVisible || paymentAmount === "") return null

    const amount = paymentAmount
    const vatBase = amount / 1.12

    return {
      vat: {
        base: vatBase,
        ewt1: vatBase * 0.01,
        net1: amount - vatBase * 0.01,
        ewt2: vatBase * 0.02,
        net2: amount - vatBase * 0.02,
      },
      zero: {
        base: amount,
        ewt1: amount * 0.01,
        net1: amount - amount * 0.01,
        ewt2: amount * 0.02,
        net2: amount - amount * 0.02,
      },
    }
  }, [paymentAmount, resultsVisible])

  return (
    <div className="space-y-8">
      <form onSubmit={handleCalculate} className="bg-white p-8 rounded-xl shadow">
        <label className="block mb-2 font-semibold">Total Invoice Amount</label>
        <input
          type="number"
          className="border p-3 w-full rounded"
          value={paymentAmount}
          onChange={(e) =>
            setPaymentAmount(e.target.value === "" ? "" : Number(e.target.value))
          }
        />
        <button className="mt-4 bg-blue-600 text-white px-6 py-3 rounded">
          Calculate
        </button>
      </form>

      {calculations && (
        <pre className="bg-black text-green-400 p-6 rounded">
          {JSON.stringify(calculations, null, 2)}
        </pre>
      )}

      {message && (
        <div className="fixed top-5 right-5 bg-red-500 text-white px-4 py-2 rounded">
          {message}
        </div>
      )}
    </div>
  )
}
