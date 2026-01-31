import React from 'react';
import Link from 'next/link';
import { Search, Bell, User } from 'lucide-react';
import ThemeToggle from './Theme-Toggle';

const UserNavBar = () => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b border-white/5">
      <div className="max-w-[96rem] mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/browse" className="flex items-center gap-2">
           <div className="font-bold text-2xl tracking-tight">
            Movie<span className="text-primary">Mandap</span>
          </div>
        </Link>
        
        {/* Navigation Links */}
        <div className="hidden md:flex items-center gap-8 font-medium text-sm text-muted-foreground">
            <Link href="/browse" className="text-foreground hover:text-primary transition-colors">Home</Link>
            <Link href="#" className="hover:text-primary transition-colors">Movies</Link>
            <Link href="#" className="hover:text-primary transition-colors">Series</Link>
            <Link href="#" className="hover:text-primary transition-colors">My List</Link>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-4">
          <div className="relative hidden sm:block">
             <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4"/>
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
          
          <button className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white shadow-lg shadow-orange-500/20">
             <User size={16} />
          </button>
        </div>
      </div>
    </nav>
  );
};

export default UserNavBar;
