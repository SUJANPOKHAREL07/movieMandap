'use client';

import React from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Clapperboard, LayoutDashboard, LogOut, Users, Globe, ShieldCheck, Tv, Menu } from 'lucide-react';
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
    const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);

    const [logoutUser, { loading: loggingOut }] = useMutation(LOGOUT_MUTATION);

    const handleLogout = async () => {
        try {
            await logoutUser();
        } catch (e) {
            // ignore
        }
        router.push('/login');
    };

    const navItems = [
        { name: 'Analytics Stats', path: '/dashboard/stats', icon: LayoutDashboard },
        { name: 'Movies', path: '/dashboard/movies', icon: Clapperboard },
        { name: 'Series', path: '/dashboard/series', icon: Tv },
        { name: 'Users', path: '/dashboard/users', icon: Users },
        { name: 'Access Control', path: '/dashboard/access', icon: ShieldCheck },
    ];

    return (
        <div className="flex min-h-screen bg-background">
            {/* Mobile Sidebar Overlay */}
            {isSidebarOpen && (
                <div 
                    className="fixed inset-0 bg-black/50 z-40 lg:hidden" 
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-card border-r border-border transition-transform duration-300 lg:translate-x-0 lg:static ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                <div className="p-6 flex items-center border-b border-border/50 gap-3">
                    <div>
                        <div className="font-bold text-2xl tracking-tighter">
                            Movie<span className="text-primary">Mandap</span>
                        </div>
                        <p className="text-[10px] uppercase font-black tracking-widest text-muted-foreground opacity-70">Control Panel</p>
                    </div>
                </div>

                <nav className="mt-6 space-y-1 px-3">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = pathname === item.path || (item.path === '/dashboard/stats' && pathname === '/dashboard');
                        return (
                            <button
                                key={item.path}
                                onClick={() => {
                                    router.push(item.path);
                                    setIsSidebarOpen(false);
                                }}
                                className={`w-full text-left px-4 py-2.5 rounded-xl flex items-center gap-3 font-semibold transition-all ${isActive
                                    ? 'bg-primary/10 text-primary shadow-[inset_0_0_0_1px_rgba(249,115,22,0.2)]'
                                    : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
                                    }`}
                            >
                                <Icon size={18} className={isActive ? 'text-primary' : ''} />
                                <span className="text-sm">{item.name}</span>
                            </button>
                        );
                    })}
                    
                    <div className="my-4 border-t border-border/50 mx-4" />
                    
                    <button
                        onClick={() => router.push('/')}
                        className="w-full text-left px-4 py-2.5 rounded-xl flex items-center gap-3 font-semibold text-muted-foreground hover:bg-secondary hover:text-foreground transition-all"
                    >
                        <Globe size={18} />
                        <span className="text-sm">Browse Site</span>
                    </button>
                </nav>

                <div className="mt-auto p-4 space-y-4 border-t border-border/50">
                    <ThemeToggle showLabel />
                    <button
                        onClick={handleLogout}
                        disabled={loggingOut}
                        className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-red-500 hover:bg-red-500/10 font-bold transition disabled:opacity-50"
                    >
                        <LogOut size={18} />
                        <span className="text-sm">{loggingOut ? 'Logging out...' : 'Logout'}</span>
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
                {/* Top Navbar for Mobile/Global Actions */}
                <header className="h-16 border-b border-border/50 flex items-center justify-between px-6 bg-card/50 backdrop-blur-md shrink-0">
                    <button 
                        onClick={() => setIsSidebarOpen(true)}
                        className="p-2 -ml-2 lg:hidden text-muted-foreground hover:text-foreground"
                    >
                        <Menu size={20} />
                    </button>
                    
                    <div className="flex-1 lg:hidden ml-4">
                        <div className="font-bold text-xl tracking-tighter">
                            Movie<span className="text-primary">Mandap</span>
                        </div>
                    </div>

                    <div className="ml-auto flex items-center gap-4">
                        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-[10px] font-black uppercase text-primary border border-primary/20">
                            <ShieldCheck size={12} /> Admin Mode
                        </div>
                    </div>
                </header>

                <main className="flex-1 p-6 md:p-10 overflow-y-auto custom-scrollbar bg-background/50">
                    {children}
                </main>
            </div>
        </div>
    );
}

