const BASE = import.meta.env.VITE_API_URL || '';

function authHeaders(): HeadersInit {
  const t = localStorage.getItem('access');
  return t ? { Authorization: `Bearer ${t}`, 'Content-Type': 'application/json' } : { 'Content-Type': 'application/json' };
}

async function req<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(BASE + path, {
    ...init,
    headers: { ...authHeaders(), ...(init?.headers || {}) }
  });
  const body = await res.json().catch(() => ({}));
  if (!res.ok || body.ok === false) throw new Error(body.error || `HTTP ${res.status}`);
  return body.data as T;
}

export const api = {
  register: (b: object) => req('/api/auth/register', { method: 'POST', body: JSON.stringify(b) }),
  login: (b: object): Promise<{ access: string; refresh: string; role: string; id: number }> =>
    req('/api/auth/login', { method: 'POST', body: JSON.stringify(b) }),
  routes: (): Promise<any[]> => req('/api/routes'),
  stops: (id: number): Promise<any[]> => req(`/api/routes/${id}/stops`),
  apply: (routeId: number, academicYear: string) =>
    req('/api/passes/apply', { method: 'POST', body: JSON.stringify({ routeId, academicYear }) }),
  mine: (): Promise<any[]> => req('/api/passes/me'),
  renew: (id: number) => req(`/api/passes/${id}/renew`, { method: 'POST' }),
  // admin
  addBus: (b: object) => req('/api/admin/buses', { method: 'POST', body: JSON.stringify(b) }),
  buses: (): Promise<any[]> => req('/api/admin/buses'),
  addDriver: (b: object) => req('/api/admin/drivers', { method: 'POST', body: JSON.stringify(b) }),
  drivers: (): Promise<any[]> => req('/api/admin/drivers'),
  addRoute: (b: object) => req('/api/admin/routes', { method: 'POST', body: JSON.stringify(b) }),
  addStop: (b: object) => req('/api/admin/stops', { method: 'POST', body: JSON.stringify(b) }),
  assign: (b: object) => req('/api/admin/assignments', { method: 'POST', body: JSON.stringify(b) }),
  assignments: (): Promise<any[]> => req('/api/admin/assignments'),
  passes: (status?: string): Promise<any[]> => req(status ? `/api/admin/passes?status=${status}` : '/api/admin/passes'),
  approve: (id: number, assignmentId: number, feePaid: boolean) =>
    req(`/api/admin/passes/${id}/approve`, { method: 'PATCH', body: JSON.stringify({ assignmentId, feePaid }) }),
  reject: (id: number) => req(`/api/admin/passes/${id}/reject`, { method: 'PATCH' }),
  capacity: (routeId?: number): Promise<any[]> =>
    req(routeId ? `/api/admin/capacity?routeId=${routeId}` : '/api/admin/capacity'),
};

export function logout() { localStorage.removeItem('access'); localStorage.removeItem('role'); }
