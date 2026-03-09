export function getAdminAuthHeaders(includeContentType = true): HeadersInit {
  const headers: Record<string, string> = {};

  if (includeContentType) {
    headers['Content-Type'] = 'application/json';
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
