'use client';
import { useEffect, useState } from 'react';

interface Material {
  id: string;
  name: string;
  baseRate: number;
}

export default function MaterialsTable() {
  const [materials, setMaterials] = useState<Material[]>([]);
  const [newName, setNewName] = useState('');
  const [newRate, setNewRate] = useState('');

  const fetchMaterials = async () => {
    const res = await fetch('/api/admin/materials');
    const data = await res.json();
    setMaterials(data);
  };

  useEffect(() => {
    fetchMaterials();
  }, []);

  const addMaterial = async () => {
    if (!newName || !newRate) return;
    await fetch('/api/admin/materials', {
      method: 'POST',
      body: JSON.stringify({ name: newName, baseRate: parseFloat(newRate) }),
      headers: { 'Content-Type': 'application/json' },
    });
    setNewName('');
    setNewRate('');
    fetchMaterials();
  };

  const updateMaterial = async (id: string, name: string, rate: number) => {
    await fetch('/api/admin/materials', {
      method: 'PUT',
      body: JSON.stringify({ id, name, baseRate: rate }),
      headers: { 'Content-Type': 'application/json' },
    });
    fetchMaterials();
  };

  const deleteMaterial = async (id: string) => {
    await fetch('/api/admin/materials', {
      method: 'DELETE',
      body: JSON.stringify({ id }),
      headers: { 'Content-Type': 'application/json' },
    });
    fetchMaterials();
  };

  return (
    <div className="bg-white p-4 rounded shadow">
      <h2 className="text-lg font-bold mb-2">Materials</h2>
      <table className="w-full border border-gray-200">
        <thead>
          <tr className="bg-gray-100">
            <th className="border px-2 py-1">Name</th>
            <th className="border px-2 py-1">Base Rate</th>
            <th className="border px-2 py-1">Actions</th>
          </tr>
        </thead>
        <tbody>
          {materials.map((m) => (
            <tr key={m.id}>
              <td className="border px-2 py-1">{m.name}</td>
              <td className="border px-2 py-1">{m.baseRate}</td>
              <td className="border px-2 py-1 space-x-2">
                <button
                  onClick={() => updateMaterial(m.id, m.name, m.baseRate)}
                  className="px-2 py-1 bg-blue-500 text-white rounded"
                >
                  Update
                </button>
                <button
                  onClick={() => deleteMaterial(m.id)}
                  className="px-2 py-1 bg-red-500 text-white rounded"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
          <tr>
            <td className="border px-2 py-1">
              <input value={newName} onChange={(e) => setNewName(e.target.value)} placeholder="New Name" />
            </td>
            <td className="border px-2 py-1">
              <input value={newRate} onChange={(e) => setNewRate(e.target.value)} placeholder="Rate" />
            </td>
            <td className="border px-2 py-1">
              <button onClick={addMaterial} className="px-2 py-1 bg-green-500 text-white rounded">
                Add
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
