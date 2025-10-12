'use client';

import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

export default function SignupForm() {
  const { register } = useAuth();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('user');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!register) return;
    setLoading(true);
    setMessage(null);
    const res = await register(username, email, password, role);
    setLoading(false);
    setMessage(res.message);
  }

  return (
    <div className="max-w-md mx-auto bg-gray-900 text-gray-100 rounded-lg p-6 shadow-lg">
      <h2 className="text-2xl font-semibold mb-4">Create account</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="text-sm text-gray-300">Username</label>
          <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full mt-1 p-2 rounded bg-gray-800 border border-gray-700"
            placeholder="johndoe"
            required
          />
        </div>
        <div>
          <label className="text-sm text-gray-300">Email</label>
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full mt-1 p-2 rounded bg-gray-800 border border-gray-700"
            placeholder="you@example.com"
            type="email"
            required
          />
        </div>
        <div>
          <label className="text-sm text-gray-300">Password</label>
          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full mt-1 p-2 rounded bg-gray-800 border border-gray-700"
            placeholder="••••••••"
            type="password"
            required
          />
        </div>
        <div>
          <label className="text-sm text-gray-300">Role</label>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="w-full mt-1 p-2 rounded bg-gray-800 border border-gray-700"
          >
            <option value="user">user</option>
            <option value="moderator">moderator</option>
            <option value="admin">admin</option>
          </select>
        </div>
        <div className="flex items-center justify-between">
          <button
            type="submit"
            className="px-4 py-2 bg-green-600 hover:bg-green-500 rounded"
            disabled={loading}
          >
            {loading ? 'Creating...' : 'Create account'}
          </button>
        </div>
        {message && <p className="text-sm pt-2 text-gray-300">{message}</p>}
      </form>
    </div>
  );
}
