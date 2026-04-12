'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Search, Bell, User, LogOut, LayoutDashboard } from 'lucide-react';
import ThemeToggle from './Theme-Toggle';
import { useAuth } from '@/context/AuthContext';
import ConfirmDialog from './ConfirmDialog';
import { buildAccessMap, isRouteAllowedInMap, Role } from '@/lib/routeAccess';
import { useQuery, useMutation, gql } from '@apollo/client';

const LOGOUT_MUTATION = gql`
  mutation LogoutUser {
    logoutUser {
      success
      message
    }
  }
`;

const GET_ROUTE_ACCESS = gql`
  query GetRouteAccess {
    getRouteAccess {
      routeId
      role
      allowed
    }
  }
`;

const UserNavBar = () => {
  const router = useRouter();
  const [showDropdown, setShowDropdown] = useState(false);
  const { logout, currentUser } = useAuth();
  const dropdownRef = useRef<HTMLDivElement>(null);

  const { data: accessData } = useQuery(GET_ROUTE_ACCESS);
  const accessMap = buildAccessMap(accessData?.getRouteAccess ?? []);
  const userRole = ((currentUser?.role as Role) || 'user');

  const canSeeStats = isRouteAllowedInMap(accessMap, 'statistics', userRole);
  const canSeeWatchlist = isRouteAllowedInMap(accessMap, 'watchlist', userRole);
  const [logoutUser] = useMutation(LOGOUT_MUTATION);
  const [confirmConfig, setConfirmConfig] = useState<{
    isOpen: boolean;
    onConfirm: () => void;
    title?: string;
    description?: string;
    confirmText?: string;
    variant?: 'danger' | 'warning' | 'primary';
  }>({
    isOpen: false,
    onConfirm: () => { },
  });

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    try {
      await logoutUser();
      await logout();
    } catch (e) { }
    router.push('/login');
  };

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border">
        <div className="max-w-[96rem] mx-auto px-6 h-16 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="font-bold text-2xl tracking-tight">
              Movie<span className="text-primary">Mandap</span>
            </div>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center gap-8 font-medium text-sm text-muted-foreground">
            <Link href="/" className="text-foreground hover:text-primary transition-colors">Home</Link>
            <Link href="#" className="hover:text-primary transition-colors">Movies</Link>
            <Link href="#" className="hover:text-primary transition-colors">Series</Link>
            {canSeeStats && (
              <Link href="/statistics" className="hover:text-primary transition-colors">Stats</Link>
            )}
            {canSeeWatchlist && (
              <button
                onClick={() => {
                  if (!currentUser) {
                    setConfirmConfig({
                      isOpen: true,
                      title: 'Authentication Required',
                      description: 'You need to be logged in to access your watchlist. Would you like to login or register now?',
                      confirmText: 'Go to Login',
                      variant: 'primary',
                      onConfirm: () => router.push('/login')
                    });
                  } else {
                    router.push('/watchlist');
                  }
                }}
                className="hover:text-primary transition-colors"
              >
                My List
              </button>
            )}
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-4">
            <div className="relative hidden sm:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <input
                type="text"
                placeholder="Search..."
                className="bg-secondary/50 border border-transparent focus:border-primary/50 rounded-full py-1.5 pl-9 pr-4 text-sm outline-none w-64 transition-all"
              />
            </div>

            <button className="text-muted-foreground hover:text-foreground transition-colors relative">
              <Bell size={20} />
              <span className="absolute top-0 right-0 w-2 h-2 bg-primary rounded-full"></span>
            </button>

            <ThemeToggle />

            {currentUser ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setShowDropdown(!showDropdown)}
                  className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white shadow-lg shadow-orange-500/20 transition-transform active:scale-95"
                >
                  <User size={16} />
                </button>

                {showDropdown && (
                  <div className="absolute right-0 mt-3 w-48 bg-card border border-border shadow-2xl rounded-xl overflow-hidden animate-in fade-in slide-in-from-top-2">
                    <div className="p-3 border-b border-border/50">
                      <p className="text-sm font-medium">{currentUser?.username || 'My Account'}</p>
                      {currentUser?.email && <p className="text-xs text-muted-foreground truncate">{currentUser.email}</p>}
                    </div>
                    <div className="p-1">
                      {(currentUser.role === 'admin' || currentUser.role === 'moderator') && (
                        <button
                          onClick={() => {
                            router.push('/dashboard');
                            setShowDropdown(false);
                          }}
                          className="w-full text-left px-3 py-2 text-sm text-foreground hover:bg-primary/10 rounded-lg flex items-center gap-2 transition-colors border-b border-border/50 mb-1 pb-2"
                        >
                          <LayoutDashboard size={14} className="text-primary" /> Admin Dashboard
                        </button>
                      )}
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-3 py-2 text-sm text-red-500 hover:bg-red-500/10 rounded-lg flex items-center gap-2 transition-colors"
                      >
                        <LogOut size={14} /> Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2 sm:gap-4">
                <Link
                  href="/login"
                  className="text-sm font-bold text-muted-foreground hover:text-primary transition-colors px-2 sm:px-4 py-2 hover:bg-secondary/50 rounded-lg"
                >
                  Log In
                </Link>
                <Link
                  href="/signup"
                  className="text-sm font-bold bg-primary text-black px-4 sm:px-6 py-2 rounded-full hover:bg-orange-600 transition-all shadow-lg shadow-orange-500/10 active:scale-95 whitespace-nowrap"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>

      </nav>

      <ConfirmDialog
        isOpen={confirmConfig.isOpen}
        onClose={() => setConfirmConfig(prev => ({ ...prev, isOpen: false }))}
        onConfirm={confirmConfig.onConfirm}
        title={confirmConfig.title || ""}
        description={confirmConfig.description || ""}
        confirmText={confirmConfig.confirmText || "Confirm"}
        variant={confirmConfig.variant || "primary"}
      />
    </>
  );
};

export default UserNavBar;
