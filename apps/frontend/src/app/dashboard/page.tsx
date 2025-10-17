'use client';

import React, { useState } from 'react';
import { Clapperboard, LayoutDashboard, LogOut } from 'lucide-react';
import ThemeToggle from '@/components/Theme-Toggle';

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'movies'>(
    'dashboard'
  );

  return (
    <div className="flex">
      <aside className="border-r relative flex font-semibold flex-col min-h-screen w-64 ">
        <div className="p-6 flex items-center  border-b gap-3">
          <div>
            <div className="font-bold text-2xl">
              Movie<span className="text-orange-500">Mandap</span>
            </div>
            <p className="text-sm text-foreground opacity-70">Control Panel</p>
          </div>
        </div>

        <nav className="mt-6 text-lg space-y-1">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`w-full text-left px-6 py-2 flex items-center gap-3 transition ${
              activeTab === 'dashboard'
                ? 'bg-orange-500/10 text-orange-400 border-l-4 border-orange-500'
                : 'hover:bg-orange-500/10'
            }`}
          >
            <LayoutDashboard />
            Dashboard
          </button>
          <button
            onClick={() => setActiveTab('movies')}
            className={`w-full text-left px-6 py-2 flex items-center gap-3 transition ${
              activeTab === 'movies'
                ? 'bg-orange-500/10 text-orange-400 border-l-4 border-orange-500'
                : 'hover:bg-orange-500/10'
            }`}
          >
            <Clapperboard /> Movies
          </button>
        </nav>

        <div className="px-6 py-4 text-lg absolute bottom-0 w-full space-y-5  border-t border-border">
          <ThemeToggle showLabel />

          <button
            // onClick={() => router.push('/app')}
            className="flex items-center gap-2 text-orange-500 hover:text-orange-400 transition"
          >
            <LogOut /> Logout
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-8 overflow-y-auto">
        {activeTab === 'dashboard' && (
          <div>
            <h1 className="text-3xl font-bold mb-4">Dashboard Overview</h1>
            <p className="text-muted-foreground">
              Welcome to your MovieMandap control panel! Here you can see stats,
              insights, and quick summaries.
            </p>
          </div>
        )}

        {activeTab === 'movies' && (
          <div>
            <h1 className="text-3xl font-bold mb-4">Movies Management</h1>
            <p className="text-muted-foreground">
              Manage all your movie listings, add new films, and edit existing
              ones here.
            </p>
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
