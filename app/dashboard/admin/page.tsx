'use client';

import { useState, useEffect } from 'react';

interface User {
  id: string;
  email: string;
  role: 'admin' | 'member';
  disabled: boolean;
  created_at: string;
}

export default function AdminPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch all users
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/users');
      if (!res.ok) throw new Error('Failed to fetch users');
      const data = await res.json();
      setUsers(data);
      setError(null);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Add new user
  const handleAddUser = async () => {
    if (!email) return;
    try {
      setLoading(true);
      const res = await fetch('/api/admin/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to add user');
      }

      setEmail('');
      fetchUsers();
    } catch (err: any) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Toggle user active/disabled
  const handleToggleUser = async (id: string, disabled: boolean) => {
    try {
      setLoading(true);
      const res = await fetch(`/api/admin/users/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ disabled: !disabled }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to update user');
      }

      fetchUsers();
    } catch (err: any) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Admin - Users</h1>

      {/* Add User */}
      <div className="mb-6 flex gap-2">
        <input
          type="email"
          value={email}
          placeholder="Add user email..."
          onChange={(e) => setEmail(e.target.value)}
          className="border p-2 rounded w-full"
        />
        <button
          onClick={handleAddUser}
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
        >
          {loading ? 'Adding...' : 'Add'}
        </button>
      </div>

      {/* Error message */}
      {error && <p className="mb-4 text-red-600">{error}</p>}

      {/* Users Table */}
      <table className="w-full border-collapse border">
        <thead>
          <tr className="bg-gray-100">
            <th className="border p-2">Email</th>
            <th className="border p-2">Role</th>
            <th className="border p-2">Status</th>
            <th className="border p-2">Action</th>
          </tr>
        </thead>
        <tbody>
          {loading && users.length === 0 ? (
            <tr>
              <td colSpan={4} className="p-4 text-center">
                Loading users...
              </td>
            </tr>
          ) : users.length === 0 ? (
            <tr>
              <td colSpan={4} className="p-4 text-center">
                No users found
              </td>
            </tr>
          ) : (
            users.map((user) => (
              <tr key={user.id}>
                <td className="border p-2">{user.email}</td>
                <td className="border p-2">{user.role}</td>
                <td className="border p-2">{user.disabled ? 'Disabled' : 'Active'}</td>
                <td className="border p-2">
                  {user.role === 'member' && (
                    <button
                      onClick={() => handleToggleUser(user.id, user.disabled)}
                      className={`px-3 py-1 rounded text-white ${
                        user.disabled ? 'bg-green-600' : 'bg-red-600'
                      }`}
                    >
                      {user.disabled ? 'Enable' : 'Disable'}
                    </button>
                  )}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
