// app/components/AddRemoveUsers.tsx
"use client";

import { useState, useEffect } from "react";

type User = { id: string; email: string; role: "admin" | "member" };

export default function AddRemoveUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const loadUsers = async () => {
    const res = await fetch("/api/admin/users");
    const data = await res.json();
    setUsers(data);
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const addUser = async () => {
    if (!email) return;
    setLoading(true);
    await fetch("/api/admin/users", {
      method: "POST",
      body: JSON.stringify({ email }),
    });
    setEmail("");
    await loadUsers();
    setLoading(false);
  };

  const removeUser = async (email: string) => {
    setLoading(true);
    await fetch("/api/admin/users", {
      method: "DELETE",
      body: JSON.stringify({ email }),
    });
    await loadUsers();
    setLoading(false);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-3">
        <input
          type="email"
          placeholder="user@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="flex-1 rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={addUser}
          disabled={loading}
          className="rounded-lg bg-blue-600 px-5 py-2 text-white font-semibold hover:bg-blue-700 disabled:opacity-50"
        >
          Add User
        </button>
      </div>

      <table className="min-w-full border border-gray-200 rounded-xl overflow-hidden">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-2 text-left">Email</th>
            <th className="px-4 py-2 text-left">Role</th>
            <th className="px-4 py-2 text-right">Action</th>
          </tr>
        </thead>
        <tbody className="divide-y">
          {users.map((u) => (
            <tr key={u.id}>
              <td className="px-4 py-2">{u.email}</td>
              <td className="px-4 py-2">{u.role}</td>
              <td className="px-4 py-2 text-right">
                {u.role !== "admin" && (
                  <button
                    onClick={() => removeUser(u.email)}
                    disabled={loading}
                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 disabled:opacity-50"
                  >
                    Remove
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
