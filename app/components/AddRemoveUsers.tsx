"use client";

import { useEffect, useState } from "react";

export default function AddRemoveUsers() {
  const [email, setEmail] = useState("");
  const [users, setUsers] = useState<any[]>([]);

  const loadUsers = async () => {
    const res = await fetch("/api/admin/users");
    setUsers(await res.json());
  };

  useEffect(() => {
    loadUsers();
  }, []);

  return (
    <div>
      <input
        placeholder="user@email.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <button
        onClick={async () => {
          await fetch("/api/admin/users", {
            method: "POST",
            body: JSON.stringify({ email }),
          });
          setEmail("");
          loadUsers();
        }}
      >
        Add User
      </button>

      <ul>
        {users.map((u) => (
          <li key={u.id}>
            {u.email}
            <button
              onClick={async () => {
                await fetch("/api/admin/users", {
                  method: "DELETE",
                  body: JSON.stringify({ email: u.email }),
                });
                loadUsers();
              }}
            >
              Remove
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
