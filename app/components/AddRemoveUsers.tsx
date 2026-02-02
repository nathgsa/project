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
    <div className="space-y-6">
      {/* Add User Form */}
      <div className="flex flex-col sm:flex-row gap-3 w-full max-w-lg">
        <input
          type="email"
          placeholder="user@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="flex-1 rounded-lg border border-gray-300 px-4 py-2 text-sm
                     focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
        />
        <button
          onClick={addUser}
          disabled={loading}
          className="rounded-lg bg-blue-600 px-5 py-2 text-sm font-semibold text-white
                     hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
        >
          Add User
        </button>
      </div>

      {/* Users Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-200 rounded-lg overflow-hidden shadow-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">
                Email
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">
                Role
              </th>
              <th className="px-6 py-3 text-right text-sm font-semibold text-gray-600">
                Action
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {users.length === 0 && (
              <tr>
                <td colSpan={3} className="px-6 py-4 text-center text-gray-500">
                  No users found
                </td>
              </tr>
            )}

            {users.map((u) => (
              <tr
                key={u.id}
                className="hover:bg-gray-50 transition-colors duration-200"
              >
                <td className="px-6 py-3 text-sm text-gray-700">{u.email}</td>
                <td className="px-6 py-3 text-sm">
                  <span
                    className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium
                      ${
                        u.role === "admin"
                          ? "bg-red-100 text-red-700"
                          : "bg-green-100 text-green-700"
                      }`}
                  >
                    {u.role}
                  </span>
                </td>
                <td className="px-6 py-3 text-right">
                  {u.role !== "admin" && (
                    <button
                      onClick={() => removeUser(u.email)}
                      disabled={loading}
                      className="rounded-lg bg-red-500 px-3 py-1 text-xs font-semibold text-white
                                 hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed transition"
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
    </div>
  );
}
