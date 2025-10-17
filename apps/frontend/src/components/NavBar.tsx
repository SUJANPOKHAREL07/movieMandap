import React from 'react';
import ThemeToggle from './Theme-Toggle';
import Link from 'next/link';

const NavBar = () => {
  return (
    <div className="fixed top-5 left-0 right-0">
      <nav className=" flex items-center rounded-full shadow-2l  justify-between mx-auto px-5 py-2 max-w-[96rem]">
        <Link href={'/'} className="font-bold md:text-3xl">
          Movie<span className='text-orange-500'>Mandap</span>
        </Link>
        <ThemeToggle />
      </nav>
    </div>
  );
};

export default NavBar;
