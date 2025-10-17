'use client';

import { useTheme } from 'next-themes';
import React, { useEffect, useState } from 'react';
import { MdOutlineLightMode } from 'react-icons/md';
import { FaRegMoon } from 'react-icons/fa';

const ThemeToggle = () => {
  const { theme, setTheme } = useTheme();
  const [mounted, setmounted] = useState(false);

  useEffect(() => {
    setmounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <button
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      className="p-2 bg-red-400  rounded-xl duration-300 transition-all"
    >
      {theme === 'dark' ? <MdOutlineLightMode /> : <FaRegMoon />}
    </button>
  );
};

export default ThemeToggle;
