'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Clapperboard, LayoutDashboard, LogOut, BarChart3 } from 'lucide-react';
import { useMutation, useQuery, gql } from '@apollo/client';
import ThemeToggle from '@/components/Theme-Toggle';
import Movies from '@/components/movies/movies';

const LOGOUT_MUTATION = gql`
  mutation LogoutUser {
    logoutUser {
      success
      message
    }
  }
`;

const GET_MOVIE_COUNT = gql`
  query GetMovies {
    getMovie {
      id
    }
  }
`;

const Dashboard = () => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'dashboard' | 'movies'>('dashboard');

  useEffect(() => {
    // Auth guard: check if token exists
    const token = localStorage.getItem('accessToken');
    if (!token) {
      router.replace('/login');
    }
  }, [router]);

  const [logoutUser, { loading: loggingOut }] = useMutation(LOGOUT_MUTATION);
  const { data: movieData } = useQuery(GET_MOVIE_COUNT);
  const movieCount = movieData?.getMovie?.length ?? '—';

  const handleLogout = async () => {
    try {
      await logoutUser();
    } catch (e) {
      // ignore
    }
    router.push('/login');
  };

  return (
    <div className="flex min-h-screen">
      <aside className="border-r relative flex font-semibold flex-col min-h-screen w-64">
        <div className="p-6 flex items-center border-b gap-3">
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
            className={`w-full text-left px-6 py-2 flex items-center gap-3 transition ${activeTab === 'dashboard'
              ? 'bg-orange-500/10 text-orange-400 border-l-4 border-orange-500'
              : 'hover:bg-orange-500/10'
              }`}
          >
            <LayoutDashboard />
            Dashboard
          </button>
          <button
            onClick={() => setActiveTab('movies')}
            className={`w-full text-left px-6 py-2 flex items-center gap-3 transition ${activeTab === 'movies'
              ? 'bg-orange-500/10 text-orange-400 border-l-4 border-orange-500'
              : 'hover:bg-orange-500/10'
              }`}
          >
            <Clapperboard /> Movies
          </button>
        </nav>

        <div className="px-6 py-4 text-lg absolute bottom-0 w-full space-y-5 border-t border-border">
          <ThemeToggle showLabel />
          <button
            onClick={handleLogout}
            disabled={loggingOut}
            className="flex items-center gap-2 text-orange-500 hover:text-orange-400 transition disabled:opacity-50"
          >
            <LogOut /> {loggingOut ? 'Logging out...' : 'Logout'}
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-8 overflow-y-auto">
        {activeTab === 'dashboard' && (
          <div className="space-y-8">
            <div>
              <h1 className="text-3xl font-bold mb-1">Dashboard Overview</h1>
              <p className="text-muted-foreground">
                Welcome to your MovieMandap control panel.
              </p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-card border border-border rounded-2xl p-6 flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-orange-500/10 flex items-center justify-center">
                  <Clapperboard className="text-orange-500" size={24} />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Movies</p>
                  <p className="text-3xl font-bold">{movieCount}</p>
                </div>
              </div>

              <div className="bg-card border border-border rounded-2xl p-6 flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-orange-500/10 flex items-center justify-center">
                  <BarChart3 className="text-orange-500" size={24} />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Platform</p>
                  <p className="text-3xl font-bold">Live</p>
                </div>
              </div>
            </div>

            <div className="bg-card border border-border rounded-2xl p-6">
              <h2 className="text-lg font-semibold mb-2">Quick Actions</h2>
              <p className="text-muted-foreground text-sm">
                Use the <span className="text-orange-400 font-medium">Movies</span> tab to add, edit, or remove movie listings from the platform.
              </p>
            </div>
          </div>
        )}

        {activeTab === 'movies' && <Movies />}
      </main>
    </div>
  );
};

export default Dashboard;
