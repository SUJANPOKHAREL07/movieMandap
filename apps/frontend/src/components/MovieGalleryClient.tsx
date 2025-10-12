'use client';

import React from 'react';
import MovieGallery from './MovieGallery';
import { AuthProvider, useAuth } from '../context/AuthContext';
import AuthForm from './AuthForm';
import SignupForm from './SignupForm';

function Header() {
  const { token, logout } = useAuth();
  const [show, setShow] = React.useState<'login' | 'signup' | false>(false);

  return (
    <header className="flex items-center justify-between p-6 bg-gray-900 text-white">
      <div>
        <h1 className="text-xl font-bold">Cine Gudi</h1>
        <p className="text-sm text-gray-300">Discover and manage movies</p>
      </div>
      <div className="flex items-center gap-4">
        {token ? (
          <>
            <button
              onClick={() => logout()}
              className="px-3 py-2 bg-red-600 rounded"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <button
              onClick={() => setShow('login')}
              className="px-3 py-2 bg-indigo-600 rounded"
            >
              Login
            </button>
            <button
              onClick={() => setShow('signup')}
              className="px-3 py-2 bg-green-600 rounded"
            >
              Sign up
            </button>
          </>
        )}
      </div>
      {show && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50">
          <div className="p-4">
            <button className="text-white mb-2" onClick={() => setShow(false)}>
              Close
            </button>
            {show === 'login' ? <AuthForm /> : <SignupForm />}
          </div>
        </div>
      )}
    </header>
  );
}

export default function MovieGalleryClient() {
  return (
    <AuthProvider>
      <div className="min-h-screen bg-gray-900 text-gray-100">
        <Header />
        <main>
          <MovieGallery />
        </main>
      </div>
    </AuthProvider>
  );
}
