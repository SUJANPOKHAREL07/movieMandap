// Route access control — backed by the GraphQL/database.
// Contains route metadata and helper functions.

export type Role = 'admin' | 'moderator' | 'user';

export interface RouteConfig {
    id: string;
    label: string;
    path: string;
    description: string;
    icon: string;
}

export const CONTROLLABLE_ROUTES: RouteConfig[] = [
    {
        id: 'browse',
        label: 'Browse Movies',
        path: '/',
        description: 'Main homepage where users can browse all movies.',
        icon: '🎬',
    },
    {
        id: 'statistics',
        label: 'Platform Stats',
        path: '/statistics',
        description: 'Public statistics page showing top movies and reviewers.',
        icon: '📊',
    },
    {
        id: 'watchlist',
        label: 'My Watchlist',
        path: '/watchlist',
        description: 'Personal watchlist to track movies to watch.',
        icon: '🔖',
    },
    {
        id: 'arated',
        label: 'A-Rated Movies',
        path: '/#arated',
        description: 'Section on the browse page showing adult-rated (A) movies.',
        icon: '🔞',
    },
    {
        id: 'reviews',
        label: 'Write Reviews',
        path: '/browse/[id]#review',
        description: 'Ability to write, edit, or delete reviews on movie pages.',
        icon: '✍️',
    },
    {
        id: 'comments',
        label: 'Comments',
        path: '/browse/[id]#comments',
        description: 'Ability to post comments on reviews.',
        icon: '💬',
    },
    {
        id: 'likes',
        label: 'Likes & Dislikes',
        path: '/browse/[id]#likes',
        description: 'Ability to like or dislike reviews.',
        icon: '👍',
    },
];

export type AccessMap = Record<string, Record<Role, boolean>>;

export function buildAccessMap(rules: { routeId: string; role: string; allowed: boolean }[]): AccessMap {
    const map: AccessMap = {};
    for (const rule of rules) {
        if (!map[rule.routeId]) {
            map[rule.routeId] = { admin: true, moderator: true, user: true };
        }
        map[rule.routeId][rule.role as Role] = rule.allowed;
    }
    return map;
}

export function isRouteAllowedInMap(map: AccessMap, routeId: string, role: Role): boolean {
    return map[routeId]?.[role] ?? true;
}
