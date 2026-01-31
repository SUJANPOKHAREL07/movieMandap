'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import NavBar from '@/components/NavBar';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // 🧪 Demo validation only
    if (email === 'admin@demo.com' && password === '123456') {
      setError('');
      alert('✅ Login successful!');
      router.push('/dashboard');
    } else {
      setError('Invalid email or password.');
    }
  };

  return (
    <div className="flex flex-col p-5 min-h-screen items-center justify-center bg-background text-foreground transition-all">
      <NavBar />
      <div className="w-full max-w-md rounded-2xl border border-border bg-card p-8 shadow-2xl backdrop-blur-sm">
        <div className="mb-8 text-center">
             <h1 className="text-3xl font-bold tracking-tight">Welcome Back</h1>
             <p className="text-muted-foreground mt-2">Sign in to access your admin dashboard</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label htmlFor="email" className="block text-sm font-medium text-foreground">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-lg border border-input bg-background/50 px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all duration-200"
              placeholder="admin@demo.com"
              required
            />
          </div>

          <div className="space-y-2">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-foreground"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-lg border border-input bg-background/50 px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all duration-200"
              placeholder="••••••"
              required
            />
          </div>

          {error && <p className="text-sm text-destructive font-medium text-center bg-destructive/10 py-2 rounded-lg">{error}</p>}

          <button
            type="submit"
            className="w-full rounded-xl bg-primary px-4 py-3 font-bold text-primary-foreground hover:opacity-90 transition-all duration-200 shadow-lg shadow-primary/25"
          >
            Sign In
          </button>
        </form>

        <p className="mt-8 text-center text-sm text-muted-foreground">
          Demo Login → <code className="bg-muted px-2 py-1 rounded text-foreground font-mono">admin@demo.com / 123456</code>
        </p>
      </div>
    </div>
  );
}
