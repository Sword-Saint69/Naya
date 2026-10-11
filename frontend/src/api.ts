const BASE = import.meta.env.VITE_API_URL || '';

function authHeaders(): HeadersInit {
  const t = localStorage.getItem('access');
  return t ? { Authorization: `Bearer ${t}`, 'Content-Type': 'application/json' } : { 'Content-Type': 'application/json' };
}

function unwrap<T>(data: any): T {
  // Spring Page -> content array; plain list passes through
  if (data && typeof data === 'object' && Array.isArray((data as any).content)) return (data as any).content as T;
  return data as T;
}

async function refreshAccess(): Promise<boolean> {
  const refresh = localStorage.getItem('refresh');
  if (!refresh) return false;
  try {
    const res = await fetch(BASE + '/api/auth/refresh', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refresh })
    });
    const body = await res.json().catch(() => ({}));
    if (!res.ok || body.ok === false) return false;
    localStorage.setItem('access', body.data.access);
    return true;
  } catch { return false; }
}

async function req<T>(path: string, init?: RequestInit, retried = false): Promise<T> {
  const res = await fetch(BASE + path, {
    ...init,
    headers: { ...authHeaders(), ...(init?.headers || {}) }
  });
  if (res.status === 401 && !retried && localStorage.getItem('refresh')) {
    if (await refreshAccess()) return req<T>(path, init, true);
    logout();
    throw new Error('session expired, please login again');
  }
  const body = await res.json().catch(() => ({}));
  if (!res.ok || body.ok === false) throw new Error(body.error || `HTTP ${res.status}`);
  return unwrap<T>(body.data);
}

export const api = {
  register: (b: object) => req('/api/auth/register', { method: 'POST', body: JSON.stringify(b) }),
  login: (b: object): Promise<{ access: string; refresh: string; role: string; id: number }> =>
    req('/api/auth/login', { method: 'POST', body: JSON.stringify(b) }),
  routes: (page = 0, size = 20): Promise<any[]> => req(`/api/routes?page=${page}&size=${size}`),
  stops: (id: number): Promise<any[]> => req(`/api/routes/${id}/stops`),
  apply: (routeId: number, academicYear: string) =>
    req('/api/passes/apply', { method: 'POST', body: JSON.stringify({ routeId, academicYear }) }),
  mine: (): Promise<any[]> => req('/api/passes/me'),
  renew: (id: number) => req(`/api/passes/${id}/renew`, { method: 'POST' }),
  // admin
  addBus: (b: object) => req('/api/admin/buses', { method: 'POST', body: JSON.stringify(b) }),
  buses: (page = 0, size = 20): Promise<any[]> => req(`/api/admin/buses?page=${page}&size=${size}`),
  addDriver: (b: object) => req('/api/admin/drivers', { method: 'POST', body: JSON.stringify(b) }),
  drivers: (page = 0, size = 20): Promise<any[]> => req(`/api/admin/drivers?page=${page}&size=${size}`),
  addRoute: (b: object) => req('/api/admin/routes', { method: 'POST', body: JSON.stringify(b) }),
  addStop: (b: object) => req('/api/admin/stops', { method: 'POST', body: JSON.stringify(b) }),
  assign: (b: object) => req('/api/admin/assignments', { method: 'POST', body: JSON.stringify(b) }),
  assignments: (page = 0, size = 20): Promise<any[]> => req(`/api/admin/assignments?page=${page}&size=${size}`),
  passes: (status?: string, page = 0, size = 20): Promise<any[]> =>
    req(status ? `/api/admin/passes?status=${status}&page=${page}&size=${size}` : `/api/admin/passes?page=${page}&size=${size}`),
  approve: (id: number, assignmentId: number, feePaid: boolean) =>
    req(`/api/admin/passes/${id}/approve`, { method: 'PATCH', body: JSON.stringify({ assignmentId, feePaid }) }),
  reject: (id: number) => req(`/api/admin/passes/${id}/reject`, { method: 'PATCH' }),
  capacity: (routeId?: number): Promise<any[]> =>
    req(routeId ? `/api/admin/capacity?routeId=${routeId}` : '/api/admin/capacity'),
};

export function logout() {
  localStorage.removeItem('access');
  localStorage.removeItem('refresh');
  localStorage.removeItem('role');
}
