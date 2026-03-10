const ADMIN_TOKEN_STORAGE_KEY = 'adminAccessToken';

function readAdminToken() {
  if (typeof window === 'undefined') return '';
  return window.localStorage.getItem(ADMIN_TOKEN_STORAGE_KEY) || '';
}

export function setAdminToken(token: string) {
  if (typeof window === 'undefined') return;
  if (!token) {
    window.localStorage.removeItem(ADMIN_TOKEN_STORAGE_KEY);
    return;
  }
  window.localStorage.setItem(ADMIN_TOKEN_STORAGE_KEY, token);
}

export function clearAdminToken() {
  if (typeof window === 'undefined') return;
  window.localStorage.removeItem(ADMIN_TOKEN_STORAGE_KEY);
}

export function getAdminAuthHeaders(includeContentType = true): HeadersInit {
  const headers: Record<string, string> = {};

  if (includeContentType) {
    headers['Content-Type'] = 'application/json';
  }

  const token = readAdminToken();
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  return headers;
}

export function getAdminRequestInit(
  init: RequestInit = {},
  includeContentType = true,
): RequestInit {
  return {
    ...init,
    credentials: 'include',
    headers: {
      ...getAdminAuthHeaders(includeContentType),
      ...(init.headers || {}),
    },
  };
}
