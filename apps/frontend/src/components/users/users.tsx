'use client';

import React, { useState } from 'react';
import { useQuery, gql } from '@apollo/client';
import { Users as UsersIcon, Mail, Award, Search } from 'lucide-react';
import AdminAlert from '../AdminAlert';

const GET_USERS = gql`
  query GetUsers {
    users {
      id
      username
      email
      role
    }
  }
`;

const ROLE_COLORS: Record<string, string> = {
    admin: 'bg-red-500/10 text-red-400 border-red-500/20',
    moderator: 'bg-primary/10 text-primary border-primary/20',
    user: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
};

const CHART_COLORS: Record<string, string> = {
    admin: 'bg-red-500',
    moderator: 'bg-primary',
    user: 'bg-blue-500',
};

const Users = () => {
    const [search, setSearch] = useState('');
    const { data, loading, error } = useQuery(GET_USERS);

    const usersList = data?.users ?? [];

    const filteredUsers = usersList.filter((u: any) =>
        u.username.toLowerCase().includes(search.toLowerCase()) ||
        u.email.toLowerCase().includes(search.toLowerCase())
    );

    const roleStats = filteredUsers.reduce((acc: any, user: any) => {
        const role = user.role.toLowerCase();
        acc[role] = (acc[role] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);

    // Get max value for relative bar heights
    const maxRoleCount = Math.max(...Object.values(roleStats as Record<string, number>), 1);

    return (
        <section className="space-y-8">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-bold text-primary mb-1">Users Management</h1>
                    <p className="text-muted-foreground text-sm">
                        {usersList.length} user{usersList.length !== 1 ? 's' : ''} registered on the platform
                    </p>
                </div>
            </div>

            {/* Custom Tailwind Chart & Analytics */}
            {!loading && !error && usersList.length > 0 && (
                <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
                    <h2 className="text-lg font-bold mb-6 flex items-center gap-2">
                        <Award className="text-primary" size={20} />
                        Role Distribution
                    </h2>
                    <div className="flex items-end gap-4 h-40 mt-4 border-b border-border/50 pb-2">
                        {Object.entries(roleStats).map(([role, count]) => {
                            const value = count as number;
                            const height = (value / maxRoleCount) * 100;
                            return (
                                <div key={role} className="flex-1 flex flex-col items-center justify-end gap-2 group h-full">
                                    <div className="text-sm font-bold opacity-0 group-hover:opacity-100 transition-opacity translate-y-2 group-hover:translate-y-0 duration-300">
                                        {value}
                                    </div>
                                    <div
                                        className={`w-full max-w-[100px] rounded-t-xl transition-all duration-1000 ease-in-out shadow-lg ${CHART_COLORS[role] || CHART_COLORS.user}`}
                                        style={{ height: `${height}%` }}
                                    ></div>
                                    <div className="text-xs font-bold uppercase text-muted-foreground mt-2">{role}</div>
                                </div>
                            )
                        })}
                        {Object.keys(roleStats).length === 0 && (
                            <div className="w-full h-full flex items-center justify-center text-muted-foreground text-sm">
                                No roles to display.
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Search Input */}
            <div className="border border-border p-3 rounded-2xl flex items-center gap-2 bg-card shadow-sm transition-all focus-within:border-primary/50">
                <Search size={20} className="text-muted-foreground" />
                <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search users by username or email..."
                    className="w-full bg-transparent focus:ring-0 outline-none text-sm"
                />
                {search && (
                    <button onClick={() => setSearch('')} className="text-xs text-zinc-500 hover:text-foreground">
                        Clear
                    </button>
                )}
            </div>

            {/* States */}
            {loading && (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                    {Array.from({ length: 9 }).map((_, i) => (
                        <div key={i} className="bg-card border border-border rounded-2xl h-32 animate-pulse" />
                    ))}
                </div>
            )}

            {error && (
                <AdminAlert
                    type="error"
                    title="User Data Error"
                    message={error.message}
                />
            )}

            {!loading && !error && filteredUsers.length === 0 && (
                <div className="flex flex-col items-center justify-center py-20 gap-4 text-muted-foreground">
                    <UsersIcon size={48} className="opacity-20" />
                    <p>{search ? 'No users match your criteria.' : 'No users yet.'}</p>
                </div>
            )}

            {/* Users Grid */}
            {!loading && filteredUsers.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                    {filteredUsers.map((user: any) => (
                        <div
                            key={user.id}
                            className="bg-card border border-border rounded-2xl p-5 hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5 transition-all duration-200 flex flex-col gap-3"
                        >
                            <div className="flex justify-between items-start">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
                                        {user.username.charAt(0).toUpperCase()}
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-sm">{user.username}</h3>
                                        <div className="flex items-center gap-1 text-xs text-muted-foreground mt-0.5">
                                            <Mail size={12} />
                                            {user.email}
                                        </div>
                                    </div>
                                </div>
                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border uppercase ${ROLE_COLORS[user.role.toLowerCase() as string] || ROLE_COLORS.user}`}>
                                    {user.role}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </section>
    );
};

export default Users;
