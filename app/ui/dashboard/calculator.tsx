'use client';

import { useEffect, useState } from 'react';

export default function Calculator() {
  const [value, setValue] = useState('');
  const [history, setHistory] = useState<string[]>([]);
  const [justEvaluated, setJustEvaluated] = useState(false);

  /* Load history */
  useEffect(() => {
    const saved = localStorage.getItem('calc-history');
    if (saved) setHistory(JSON.parse(saved));
  }, []);

  /* Save history */
  useEffect(() => {
    localStorage.setItem('calc-history', JSON.stringify(history));
  }, [history]);

  /* Input typing */
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;

    if (/^[0-9+\-*/.]*$/.test(newValue)) {
      setValue(newValue);
      setJustEvaluated(false);
    }
  };

  /* Evaluate */
  const evaluate = () => {
    if (!value) return;

    try {
      // eslint-disable-next-line no-eval
      const result = eval(value);

      if (typeof result === 'number' && !isNaN(result)) {
        setHistory(prev => [`${value} = ${result}`, ...prev.slice(0, 9)]);
        setValue(result.toString());
        setJustEvaluated(true);
      } else {
        setValue('Error');
        setJustEvaluated(true);
      }
    } catch {
      setValue('Error');
      setJustEvaluated(true);
    }
  };

  /* Button click logic */
  const handleButtonClick = (btn: string) => {
    const isOperator = /[+\-*/]/.test(btn);

    if (btn === '=') {
      evaluate();
      return;
    }

    // After "=" behavior
    if (justEvaluated) {
      if (isOperator) {
        // Continue calculation: 3 +
        setValue(prev => prev + btn);
      } else {
        // Start new number: 8 (not 38)
        setValue(btn);
      }
      setJustEvaluated(false);
      return;
    }

    // Normal behavior
    setValue(prev => prev + btn);
  };

  /* Keyboard */
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') evaluate();
  };

  return (
    <div className="rounded-xl bg-white p-4 shadow">
      <h3 className="mb-2 font-semibold">🧮 Calculator</h3>

      <input
        value={value}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        className="mb-3 w-full rounded border p-2 text-right text-lg"
        placeholder="0"
      />

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
      </div>

      {/* History */}
      <div>
        <h4 className="mb-2 text-sm font-semibold">History</h4>
        {history.length === 0 ? (
          <p className="text-sm text-gray-400">No calculations yet</p>
        ) : (
          <ul className="space-y-1 text-sm">
            {history.map((item, index) => (
              <li key={index} className="rounded bg-gray-100 px-2 py-1">
                {item}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
