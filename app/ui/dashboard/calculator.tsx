'use client';

import { useEffect, useState } from 'react';

export default function Calculator() {
  const [value, setValue] = useState('');
  const [history, setHistory] = useState<string[]>([]);

  /* -----------------------------
   Load history from localStorage
  ------------------------------*/
  useEffect(() => {
    const saved = localStorage.getItem('calc-history');
    if (saved) {
      setHistory(JSON.parse(saved));
    }
  }, []);

  /* -----------------------------
   Save history to localStorage
  ------------------------------*/
  useEffect(() => {
    localStorage.setItem('calc-history', JSON.stringify(history));
  }, [history]);

  /* -----------------------------
   Input validation
  ------------------------------*/
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;

    // Allow numbers and operators only
    if (/^[0-9+\-*/.]*$/.test(newValue)) {
      setValue(newValue);
    }
  };

  /* -----------------------------
   Evaluate expression
  ------------------------------*/
  const evaluate = () => {
    if (!value) return;

    try {
      // eslint-disable-next-line no-eval
      const result = eval(value);

      if (typeof result === 'number' && !isNaN(result)) {
        const entry = `${value} = ${result}`;
        setHistory(prev => [entry, ...prev.slice(0, 9)]); // keep last 10
        setValue(result.toString());
      } else {
        setValue('Error');
      }
    } catch {
      setValue('Error');
    }
  };

  /* -----------------------------
   Button click
  ------------------------------*/
  const handleButtonClick = (btn: string) => {
    if (btn === '=') {
      evaluate();
    } else if (btn === 'C') {
      setValue('');
    } else {
      setValue(prev => prev + btn);
    }
  };

  /* -----------------------------
   Keyboard support
  ------------------------------*/
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      evaluate();
    }
    if (e.key === 'Escape') {
      setValue('');
    }
  };

  /* -----------------------------
   Clear history
  ------------------------------*/
  const clearHistory = () => {
    setHistory([]);
    localStorage.removeItem('calc-history');
  };

  return (
    <div className="rounded-xl bg-white p-4 shadow">
      <h3 className="mb-2 font-semibold">🧮 Calculator</h3>

      {/* Display */}
      <input
        value={value}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        className="mb-3 w-full rounded border p-2 text-right text-lg"
        placeholder="0"
      />

      {/* Buttons */}
      <div className="grid grid-cols-4 gap-2 mb-4">
        {[
          '7','8','9','/',
          '4','5','6','*',
          '1','2','3','-',
          '0','.','=','+',
        ].map(btn => (
          <button
            key={btn}
            className="rounded bg-gray-200 p-2 font-semibold hover:bg-gray-300"
            onClick={() => handleButtonClick(btn)}
          >
            {btn}
          </button>
        ))}

        {/* Clear button */}
        <button
          className="col-span-4 rounded bg-red-100 p-2 font-semibold hover:bg-red-200"
          onClick={() => handleButtonClick('C')}
        >
          Clear
        </button>
      </div>

      {/* History */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <h4 className="font-semibold text-sm">History</h4>
          {history.length > 0 && (
            <button
              onClick={clearHistory}
              className="text-xs text-red-500 hover:underline"
            >
              Clear
            </button>
          )}
        </div>

        {history.length === 0 ? (
          <p className="text-sm text-gray-400">No calculations yet</p>
        ) : (
          <ul className="space-y-1 text-sm">
            {history.map((item, index) => (
              <li
                key={index}
                className="rounded bg-gray-100 px-2 py-1"
              >
                {item}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
