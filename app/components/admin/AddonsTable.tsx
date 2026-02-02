'use client';
import { useEffect, useState } from 'react';

interface Addon {
  id: string;
  name: string;
  rate: number;
  type: 'perSquareFoot' | 'perPiece';
}

export default function AddonsTable() {
  const [addons, setAddons] = useState<{ perSquareFoot: Addon[]; perPiece: Addon[] }>({
    perSquareFoot: [],
    perPiece: [],
  });
  const [newName, setNewName] = useState('');
  const [newRate, setNewRate] = useState('');
  const [newType, setNewType] = useState<'perSquareFoot' | 'perPiece'>('perSquareFoot');

  const fetchAddons = async () => {
    const res = await fetch('/api/admin/addons');
    const data = await res.json();
    setAddons(data);
  };

  useEffect(() => {
    fetchAddons();
  }, []);

  const addAddon = async () => {
    if (!newName || !newRate) return;
    await fetch('/api/admin/addons', {
      method: 'POST',
      body: JSON.stringify({ name: newName, type: newType, rate: parseFloat(newRate) }),
      headers: { 'Content-Type': 'application/json' },
    });
    setNewName('');
    setNewRate('');
    fetchAddons();
  };

  const updateAddon = async (addon: Addon) => {
    await fetch('/api/admin/addons', {
      method: 'PUT',
      body: JSON.stringify({ id: addon.id, name: addon.name, type: addon.type, rate: addon.rate }),
      headers: { 'Content-Type': 'application/json' },
    });
    fetchAddons();
  };

  const deleteAddon = async (id: string) => {
    await fetch('/api/admin/addons', {
      method: 'DELETE',
      body: JSON.stringify({ id }),
      headers: { 'Content-Type': 'application/json' },
    });
    fetchAddons();
  };

  return (
    <div className="bg-white p-4 rounded shadow mt-4">
      <h2 className="text-lg font-bold mb-2">Add-ons</h2>
      {['perSquareFoot', 'perPiece'].map((type) => (
        <div key={type}>
          <h3 className="font-medium mt-2">{type === 'perSquareFoot' ? 'Per Square Foot' : 'Per Piece'}</h3>
          <table className="w-full border border-gray-200 mb-4">
            <thead>
              <tr className="bg-gray-100">
                <th className="border px-2 py-1">Name</th>
                <th className="border px-2 py-1">Rate</th>
                <th className="border px-2 py-1">Actions</th>
              </tr>
            </thead>
            <tbody>
              {(type === 'perSquareFoot' ? addons.perSquareFoot : addons.perPiece).map((a) => (
                <tr key={a.id}>
                  <td className="border px-2 py-1">{a.name}</td>
                  <td className="border px-2 py-1">{a.rate}</td>
                  <td className="border px-2 py-1 space-x-2">
                    <button
                      onClick={() => updateAddon(a)}
                      className="px-2 py-1 bg-blue-500 text-white rounded"
                    >
                      Update
                    </button>
                    <button
                      onClick={() => deleteAddon(a.id)}
                      className="px-2 py-1 bg-red-500 text-white rounded"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
              {type === newType && (
                <tr>
                  <td className="border px-2 py-1">
                    <input value={newName} onChange={(e) => setNewName(e.target.value)} placeholder="New Name" />
                  </td>
                  <td className="border px-2 py-1">
                    <input value={newRate} onChange={(e) => setNewRate(e.target.value)} placeholder="Rate" />
                  </td>
                  <td className="border px-2 py-1">
                    <button onClick={addAddon} className="px-2 py-1 bg-green-500 text-white rounded">
                      Add
                    </button>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      ))}

      <div className="mt-2">
        <label>Type: </label>
        <select value={newType} onChange={(e) => setNewType(e.target.value as 'perSquareFoot' | 'perPiece')}>
          <option value="perSquareFoot">Per Square Foot</option>
          <option value="perPiece">Per Piece</option>
        </select>
      </div>
    </div>
  );
}
