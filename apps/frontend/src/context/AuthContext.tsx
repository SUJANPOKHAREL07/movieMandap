'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { fetchGraphQL } from '../lib/graphql';

type AuthContextType = {
  token: string | null;
  currentUser: { id: number; username: string; email: string } | null;
  login: (
    email: string,
    password: string
  ) => Promise<{ success: boolean; message: string }>;
  logout: () => Promise<void>;
  register?: (
    username: string,
    email: string,
    password: string,
    role: string
  ) => Promise<{ success: boolean; message: string }>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(() =>
    typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null
  );
  const [currentUser, setCurrentUser] = useState<AuthContextType['currentUser']>(null);

  useEffect(() => {
    if (token) {
      localStorage.setItem('accessToken', token);
      fetchGraphQL(`query { getMe { id username email } }`)
        .then((data) => {
          if (data?.getMe) setCurrentUser(data.getMe);
        })
        .catch(() => setCurrentUser(null));
    } else {
      localStorage.removeItem('accessToken');
      setCurrentUser(null);
    }
  }, [token]);

  async function login(email: string, password: string) {
    const query = `mutation Login($email: String, $password: String!, $username: String) { loginUser(email: $email, password: $password) { success message accessToken refreshToken } }`;
    try {
      const data = await fetchGraphQL(query, { email, password });
      const res = data?.loginUser;
      if (res?.success) {
        setToken(res.accessToken || null);
        // refreshToken is stored in httpOnly cookie by backend if possible
        return { success: true, message: res.message };
      }
      return { success: false, message: res?.message || 'Login failed' };
    } catch (err: any) {
      return { success: false, message: err?.message || 'Network error' };
    }
  }

  async function logout() {
    const query = `mutation { logoutUser { success message } }`;
    try {
      await fetchGraphQL(query);
    } catch (err) {
      // ignore
    }
    setToken(null);
    setCurrentUser(null);
  }

  async function register(
    username: string,
    email: string,
    password: string,
    role: string
  ) {
    const query = `mutation CreateUser($username: String!, $email: String!, $password: String!, $role: Role!) { createUser(username: $username, email: $email, password: $password, role: $role) { success message } }`;
    try {
      const data = await fetchGraphQL(query, {
        username,
        email,
        password,
        role,
      });
      const res = data?.createUser;
      if (res) return res;
      return { success: false, message: 'Failed to register' };
    } catch (err: any) {
      return { success: false, message: err?.message || 'Network error' };
    }
  }

  return (
    <AuthContext.Provider value={{ token, currentUser, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
}
