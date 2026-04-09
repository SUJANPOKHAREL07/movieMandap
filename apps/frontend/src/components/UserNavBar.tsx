'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useMutation, gql } from '@apollo/client';
import { Search, Bell, User, LogOut } from 'lucide-react';
import ThemeToggle from './Theme-Toggle';
import { useAuth } from '@/context/AuthContext';

const LOGOUT_MUTATION = gql`
  mutation LogoutUser {
    logoutUser {
      success
      message
    }
  }
`;

const UserNavBar = () => {
  const router = useRouter();
  const [showDropdown, setShowDropdown] = useState(false);
  const { logout, currentUser } = useAuth();
  const dropdownRef = useRef<HTMLDivElement>(null);

  const [logoutUser] = useMutation(LOGOUT_MUTATION);

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
          <Link href="/watchlist" className="hover:text-primary transition-colors">My List</Link>
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
        </div>
      </div>
    </nav>
  );
};

export default UserNavBar;
