'use client';

import React from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Clapperboard, LayoutDashboard, LogOut, Users, Globe } from 'lucide-react';
import { useMutation, gql } from '@apollo/client';
import ThemeToggle from '@/components/Theme-Toggle';

const LOGOUT_MUTATION = gql`
  mutation LogoutUser {
    logoutUser {
      success
      message
    }
  }
`;

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const pathname = usePathname();

    const [logoutUser, { loading: loggingOut }] = useMutation(LOGOUT_MUTATION);

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
            <aside className="border-r relative flex font-semibold flex-col min-h-screen w-64 bg-background">
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
                        onClick={() => router.push('/dashboard/stats')}
                        className={`w-full text-left px-6 py-2 flex items-center gap-3 transition ${pathname === '/dashboard/stats' || pathname === '/dashboard'
                            ? 'bg-orange-500/10 text-orange-400 border-l-4 border-orange-500'
                            : 'hover:bg-orange-500/10'
                            }`}
                    >
                        <LayoutDashboard />
                        Analytics Stats
                    </button>
                    <button
                        onClick={() => router.push('/dashboard/movies')}
                        className={`w-full text-left px-6 py-2 flex items-center gap-3 transition ${pathname.includes('/movies')
                            ? 'bg-orange-500/10 text-orange-400 border-l-4 border-orange-500'
                            : 'hover:bg-orange-500/10'
                            }`}
                    >
                        <Clapperboard /> Movies
                    </button>
                    <button
                        onClick={() => router.push('/dashboard/users')}
                        className={`w-full text-left px-6 py-2 flex items-center gap-3 transition ${pathname.includes('/users')
                            ? 'bg-orange-500/10 text-orange-400 border-l-4 border-orange-500'
                            : 'hover:bg-orange-500/10'
                            }`}
                    >
                        <Users /> Users
                    </button>
                    <button
                        onClick={() => router.push('/')}
                        className={`w-full text-left px-6 py-2 flex items-center gap-3 transition hover:bg-orange-500/10`}
                    >
                        <Globe /> Browse Site
                    </button>
                </nav>

                <div className="px-6 py-4 text-lg absolute bottom-0 w-full space-y-5 border-t border-border bg-background">
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

            <main className="flex-1 p-8 overflow-y-auto">
                {children}
            </main>
        </div>
    );
}
