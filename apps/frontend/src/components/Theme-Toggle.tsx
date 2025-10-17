'use client';

import { useTheme } from 'next-themes';
import React, { useEffect, useState } from 'react';
import { MdOutlineLightMode } from 'react-icons/md';
import { FaRegMoon } from 'react-icons/fa';

interface ThemeToggleProps {
  showLabel?: boolean;
}

const ThemeToggle = ({ showLabel = false }: ThemeToggleProps) => {
  const { theme, setTheme } = useTheme();
  const [mounted, setmounted] = useState(false);

  useEffect(() => {
    setmounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <button
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      className=" flex gap-4 rounded-xl duration-300 transition-all"
    >
      {theme === 'dark' ? <MdOutlineLightMode size={20} /> : <FaRegMoon size={20}/>}
      {showLabel && (
        <span className="text-sm font-medium">
          {theme === "dark" ? 'Light Mode' : 'Dark Mode'}
        </span>
      )}
    </button>
  );
};

export default ThemeToggle;
