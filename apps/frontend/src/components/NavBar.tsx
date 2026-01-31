import React from 'react';
import ThemeToggle from './Theme-Toggle';
import Link from 'next/link';

const NavBar = () => {
  return (
    <div className="fixed top-5 left-0 right-0 z-50">
      <nav className="flex items-center rounded-full shadow-xl justify-between mx-auto px-6 py-3 max-w-[96rem] bg-background/80 backdrop-blur-md border border-border">
        <Link href={'/'} className="font-bold text-xl md:text-3xl tracking-tight">
          Movie<span className="text-primary">Mandap</span>
        </Link>
        <div className="flex items-center gap-4">
            {/* Add more nav items here later if needed */}
            <ThemeToggle />
        </div>
      </nav>
    </div>
  );
};

export default NavBar;
