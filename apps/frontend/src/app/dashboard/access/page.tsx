'use client';

import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, gql } from '@apollo/client';
import {
    CONTROLLABLE_ROUTES,
    buildAccessMap,
    AccessMap,
    Role,
} from '@/lib/routeAccess';
import { ShieldCheck, Save, RotateCcw } from 'lucide-react';

const GET_ROUTE_ACCESS = gql`
  query GetRouteAccess {
    getRouteAccess {
      routeId
      role
      allowed
    }
  }
`;

const SAVE_ROUTE_ACCESS = gql`
  mutation SaveRouteAccess($rules: [RouteAccessInput!]!) {
    saveRouteAccess(rules: $rules) {
      success
      message
    }
  }
`;

const ROLES: { id: Role; label: string; color: string }[] = [
    { id: 'admin', label: 'Admin', color: 'text-red-400' },
    { id: 'moderator', label: 'Moderator', color: 'text-purple-400' },
    { id: 'user', label: 'User', color: 'text-blue-400' },
];

function buildDefaultMap(): AccessMap {
    return CONTROLLABLE_ROUTES.reduce((acc, r) => {
        acc[r.id] = { admin: true, moderator: true, user: true };
        return acc;
    }, {} as AccessMap);
}

export default function AccessControlPage() {
    const [accessMap, setAccessMap] = useState<AccessMap>(buildDefaultMap());
    const [saved, setSaved] = useState(false);

    const { data, loading } = useQuery(GET_ROUTE_ACCESS, { fetchPolicy: 'network-only' });
    const [saveRouteAccess, { loading: saving }] = useMutation(SAVE_ROUTE_ACCESS);

    useEffect(() => {
        if (data?.getRouteAccess) {
            const base = buildDefaultMap();
            const fromDb = buildAccessMap(data.getRouteAccess);
            setAccessMap({ ...base, ...fromDb });
        }
    }, [data]);

    const toggle = (routeId: string, role: Role) => {
        setAccessMap(prev => ({
            ...prev,
            [routeId]: {
                ...prev[routeId],
                [role]: !prev[routeId]?.[role],
            },
        }));
        setSaved(false);
    };

    const handleSave = async () => {
        const rules = CONTROLLABLE_ROUTES.flatMap(route =>
            ROLES.map(role => ({
                routeId: route.id,
                role: role.id,
                allowed: accessMap[route.id]?.[role.id] ?? true,
            }))
        );
        await saveRouteAccess({ variables: { rules } });
        setSaved(true);
        setTimeout(() => setSaved(false), 2500);
    };

    const handleReset = async () => {
        const defaults = buildDefaultMap();
        setAccessMap(defaults);
        const rules = CONTROLLABLE_ROUTES.flatMap(route =>
            ROLES.map(role => ({ routeId: route.id, role: role.id, allowed: true }))
        );
        await saveRouteAccess({ variables: { rules } });
        setSaved(true);
        setTimeout(() => setSaved(false), 2500);
    };

    return (
        <section className="space-y-8">
            {/* Header */}
            <div className="flex items-start justify-between flex-wrap gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-orange-500 mb-1 flex items-center gap-3">
                        <ShieldCheck size={28} />
                        Access Control
                    </h1>
                    <p className="text-muted-foreground text-sm">
                        Configure which routes are visible per user role. Saved to the database — applies across all browsers.
                    </p>
                </div>
                <div className="flex gap-3">
                    <button
                        onClick={handleReset}
                        disabled={saving}
                        className="flex items-center gap-2 text-sm px-4 py-2 rounded-xl border border-border hover:bg-secondary transition-all disabled:opacity-50"
                    >
                        <RotateCcw size={14} /> Reset Defaults
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={saving}
                        className={`flex items-center gap-2 text-sm px-4 py-2 rounded-xl font-bold transition-all shadow-lg disabled:opacity-70 ${saved
                            ? 'bg-green-500 text-white shadow-green-500/20'
                            : 'bg-orange-500 text-white hover:bg-orange-600 shadow-orange-500/20'
                            }`}
                    >
                        <Save size={14} /> {saving ? 'Saving...' : saved ? 'Saved!' : 'Save Changes'}
                    </button>
                </div>
            </div>

            {/* Info Banner */}
            <div className="bg-orange-500/5 border border-orange-500/20 rounded-2xl p-4 text-sm text-orange-400 flex items-start gap-3">
                <ShieldCheck size={18} className="shrink-0 mt-0.5" />
                <p>
                    These settings control <strong>visibility of nav links</strong> for each role and are stored in the database. Admins always retain full access to the dashboard.
                </p>
            </div>

            {/* Route Matrix */}
            {loading ? (
                <div className="space-y-3">
                    {[1, 2, 3].map(i => <div key={i} className="h-20 bg-card border border-border rounded-2xl animate-pulse" />)}
                </div>
            ) : (
                <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm">
                    {/* Table Header */}
                    <div className="grid grid-cols-[1fr_repeat(3,_140px)] border-b border-border bg-background/50">
                        <div className="px-6 py-4 text-sm font-bold text-muted-foreground uppercase tracking-wider">
                            Route / Feature
                        </div>
                        {ROLES.map(role => (
                            <div key={role.id} className={`px-6 py-4 text-sm font-bold uppercase tracking-wider text-center ${role.color}`}>
                                {role.label}
                            </div>
                        ))}
                    </div>

                    {/* Route Rows */}
                    {CONTROLLABLE_ROUTES.map((route, idx) => (
                        <div
                            key={route.id}
                            className={`grid grid-cols-[1fr_repeat(3,_140px)] items-center transition-colors hover:bg-orange-500/5 ${idx !== CONTROLLABLE_ROUTES.length - 1 ? 'border-b border-border/50' : ''}`}
                        >
                            <div className="px-6 py-5 space-y-1">
                                <p className="font-semibold text-sm flex items-center gap-2">
                                    <span className="text-base">{route.icon}</span>
                                    {route.label}
                                </p>
                                <p className="text-xs text-muted-foreground">{route.description}</p>
                                <code className="text-[10px] bg-secondary/50 px-1.5 py-0.5 rounded text-muted-foreground">{route.path}</code>
                            </div>

                            {ROLES.map(role => {
                                const isOn = accessMap[route.id]?.[role.id] ?? true;
                                const isAdmin = role.id === 'admin';
                                return (
                                    <div key={role.id} className="flex items-center justify-center px-6 py-5">
                                        <button
                                            onClick={() => !isAdmin && toggle(route.id, role.id)}
                                            disabled={isAdmin}
                                            title={isAdmin ? 'Admins always have access' : undefined}
                                            className={`relative w-11 h-6 rounded-full transition-all duration-300 focus:outline-none ${isAdmin
                                                ? 'opacity-40 cursor-not-allowed bg-orange-500'
                                                : isOn
                                                    ? 'bg-orange-500 shadow-[0_0_10px_rgba(249,115,22,0.4)]'
                                                    : 'bg-border'
                                                }`}
                                        >
                                            <span
                                                className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-300 ${isOn ? 'translate-x-5' : 'translate-x-0'}`}
                                            />
                                        </button>
                                    </div>
                                );
                            })}
                        </div>
                    ))}
                </div>
            )}
        </section>
    );
}
