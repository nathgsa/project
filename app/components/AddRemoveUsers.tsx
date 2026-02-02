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

  useEffect(() => { loadUsers(); }, []);

  const addUser = async () => {
    if (!email) return;
    setLoading(true);
    await fetch("/api/admin/users", { method: "POST", body: JSON.stringify({ email }) });
    setEmail("");
    await loadUsers();
    setLoading(false);
  };

  const removeUser = async (email: string) => {
    setLoading(true);
    await fetch("/api/admin/users", { method: "DELETE", body: JSON.stringify({ email }) });
    await loadUsers();
    setLoading(false);
  };

  return (
    <div className="space-y-6">
      {/* Add user */}
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

      {/* Users table */}
      <div className="overflow-x-auto rounded-xl border border-gray-200">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-2 text-left font-medium text-gray-600">Email</th>
              <th className="px-4 py-2 text-left font-medium text-gray-600">Role</th>
              <th className="px-4 py-2 text-right font-medium text-gray-600">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {users.length === 0 && (
              <tr>
                <td colSpan={3} className="px-4 py-6 text-center text-gray-500">
                  No users found
                </td>
              </tr>
            )}

            {users.map((user) => (
              <tr key={user.id} className="hover:bg-gray-50">
                <td className="px-4 py-2">{user.email}</td>
                <td className="px-4 py-2">
                  <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${user.role === "admin" ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"}`}>
                    {user.role}
                  </span>
                </td>
                <td className="px-4 py-2 text-right">
                  {user.role !== "admin" && (
                    <button
                      onClick={() => removeUser(user.email)}
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
    </div>
  );
}
