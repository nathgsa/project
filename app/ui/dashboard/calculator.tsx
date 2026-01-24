'use client';

import { useState } from 'react';

export default function Calculator() {
  const [value, setValue] = useState('');

  // Allow only numbers, operators, and decimal
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    if (/^[0-9+\-*/.]*$/.test(newValue)) {
      setValue(newValue);
    }
  };

  // Evaluate the expression safely
  const evaluate = () => {
    try {
      // eslint-disable-next-line no-eval
      setValue(eval(value).toString());
    } catch {
      setValue('Error');
    }
  };

  const handleButtonClick = (btn: string) => {
    if (btn === '=') {
      evaluate();
    } else {
      setValue(value + btn);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      evaluate();
    }
  };

  return (
    <div className="rounded-xl bg-white p-4 shadow">
      <h3 className="mb-2 font-semibold">Basic Calculator</h3>

      <input
        value={value}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        className="mb-3 w-full rounded border p-2 text-right text-lg"
        placeholder="0"
      />

      <div className="grid grid-cols-4 gap-2">
        {[
          '7','8','9','/',
          '4','5','6','*',
          '1','2','3','-',
          '0','.','=','+'
        ].map((btn) => (
          <button
            key={btn}
            className="rounded bg-gray-200 p-2 font-semibold hover:bg-gray-300"
            onClick={() => handleButtonClick(btn)}
          >
            {btn}
          </button>
        ))}
      </div>
    </div>
  );
}
