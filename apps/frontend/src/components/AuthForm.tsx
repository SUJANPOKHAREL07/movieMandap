'use client';

import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

export default function AuthForm() {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    const res = await login(email, password);
    setLoading(false);
    setMessage(res.message);
  }

  return (
    <div className="max-w-md mx-auto bg-gray-900 text-gray-100 rounded-lg p-6 shadow-lg">
      <h2 className="text-2xl font-semibold mb-4">Sign in</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
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
        <div className="flex items-center justify-between">
          <button
            type="submit"
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 rounded"
            disabled={loading}
          >
            {loading ? 'Signing in...' : 'Sign in'}
          </button>
        </div>
        {message && <p className="text-sm pt-2 text-gray-300">{message}</p>}
      </form>
    </div>
  );
}
