export const Endpoint = {
    LOGIN: '/api/auth/login',
    REGISTER: '/api/auth/register',
    REFRESH: '/api/auth/refresh',
    LOGOUT: '/api/auth/logout',
    USER: '/api/user',
    MATCH_HISTORY: '/api/match/history',
    MATCH_STATS: '/api/match/stats',
} as const;

export type EndpointKey = keyof typeof Endpoint;