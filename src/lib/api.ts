const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Retrieve token from localStorage
const getToken = () => localStorage.getItem('govfeedback_token');

const headers = (isFormData = false) => {
  const h: Record<string, string> = {};
  const token = getToken();
  if (token) h['Authorization'] = `Bearer ${token}`;
  if (!isFormData) h['Content-Type'] = 'application/json';
  return h;
};

const handleResponse = async (res: Response) => {
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'API Error');
  return data;
};

// ─── AUTH ───────────────────────────────────────────
export const apiRegister = (name: string, email: string, phone: string) =>
  fetch(`${API_BASE}/auth/register`, { method: 'POST', headers: headers(), body: JSON.stringify({ name, email, phone }) }).then(handleResponse);

export const apiAdminLogin = (email: string, password: string) =>
  fetch(`${API_BASE}/auth/admin/login`, { method: 'POST', headers: headers(), body: JSON.stringify({ email, password }) }).then(handleResponse);

export const apiGetMe = () =>
  fetch(`${API_BASE}/auth/me`, { headers: headers() }).then(handleResponse);

// ─── BUILDINGS ───────────────────────────────────────
export const apiGetBuildings = () =>
  fetch(`${API_BASE}/buildings`, { headers: headers() }).then(handleResponse);

export const apiAddBuilding = (data: object) =>
  fetch(`${API_BASE}/buildings`, { method: 'POST', headers: headers(), body: JSON.stringify(data) }).then(handleResponse);

export const apiDeleteBuilding = (id: string) =>
  fetch(`${API_BASE}/buildings/${id}`, { method: 'DELETE', headers: headers() }).then(handleResponse);

export const apiUpdateBuilding = (id: string, data: object) =>
  fetch(`${API_BASE}/buildings/${id}`, { method: 'PUT', headers: headers(), body: JSON.stringify(data) }).then(handleResponse);

export const apiAssignAdmin = (buildingId: string, data: object) =>
  fetch(`${API_BASE}/buildings/${buildingId}/assign-admin`, { method: 'POST', headers: headers(), body: JSON.stringify(data) }).then(handleResponse);

// ─── EMPLOYEES ───────────────────────────────────────
export const apiGetEmployees = (buildingId?: string) =>
  fetch(`${API_BASE}/employees${buildingId ? `?buildingId=${buildingId}` : ''}`, { headers: headers() }).then(handleResponse);

export const apiAddEmployee = (data: object) =>
  fetch(`${API_BASE}/employees`, { method: 'POST', headers: headers(), body: JSON.stringify(data) }).then(handleResponse);

export const apiUpdateEmployee = (id: string, data: object) =>
  fetch(`${API_BASE}/employees/${id}`, { method: 'PUT', headers: headers(), body: JSON.stringify(data) }).then(handleResponse);

export const apiDeleteEmployee = (id: string) =>
  fetch(`${API_BASE}/employees/${id}`, { method: 'DELETE', headers: headers() }).then(handleResponse);

// ─── FEEDBACK ────────────────────────────────────────
export const apiSubmitFeedback = (data: {
  employeeId: string; buildingId: string; rating: number;
  comment: string; userEmail: string; photo?: File;
}) => {
  const form = new FormData();
  Object.entries(data).forEach(([k, v]) => { if (v !== undefined && k !== 'photo') form.append(k, String(v)); });
  if (data.photo) form.append('photo', data.photo);
  return fetch(`${API_BASE}/feedback`, { method: 'POST', headers: headers(true), body: form }).then(handleResponse);
};

export const apiGetFeedback = (params?: { buildingId?: string; status?: string }) => {
  const query = params ? '?' + new URLSearchParams(params as Record<string,string>).toString() : '';
  return fetch(`${API_BASE}/feedback${query}`, { headers: headers() }).then(handleResponse);
};

export const apiUpdateFeedbackStatus = (id: string, status: string) =>
  fetch(`${API_BASE}/feedback/${id}/status`, { method: 'PUT', headers: headers(), body: JSON.stringify({ status }) }).then(handleResponse);

export const apiGetStats = () =>
  fetch(`${API_BASE}/feedback/stats`, { headers: headers() }).then(handleResponse);

// ─── ANALYTICS ────────────────────────────────────────
export const apiGetAnalytics = () =>
  fetch(`${API_BASE}/analytics/overview`, { headers: headers() }).then(handleResponse);

export const apiGetBuildingAnalytics = (id: string) =>
  fetch(`${API_BASE}/analytics/building/${id}`, { headers: headers() }).then(handleResponse);

// ─── PROFILE / AUTH ───────────────────────────────────
export const apiUpdateProfile = (data: { name: string; phone: string }) =>
  fetch(`${API_BASE}/auth/profile`, { method: 'PUT', headers: headers(), body: JSON.stringify(data) }).then(handleResponse);

export const apiChangePassword = (data: { currentPassword: string; newPassword: string }) =>
  fetch(`${API_BASE}/auth/change-password`, { method: 'PUT', headers: headers(), body: JSON.stringify(data) }).then(handleResponse);

export const apiForgotPassword = (email: string) =>
  fetch(`${API_BASE}/auth/forgot-password`, { method: 'POST', headers: headers(), body: JSON.stringify({ email }) }).then(handleResponse);

export const apiResetPassword = (token: string, password: string) =>
  fetch(`${API_BASE}/auth/reset-password/${token}`, { method: 'POST', headers: headers(), body: JSON.stringify({ password }) }).then(handleResponse);

// ─── USERS (SUPER_ADMIN) ──────────────────────────────
export const apiGetUsers = () =>
  fetch(`${API_BASE}/auth/users`, { headers: headers() }).then(handleResponse);

export const apiAddUser = (data: object) =>
  fetch(`${API_BASE}/auth/users`, { method: 'POST', headers: headers(), body: JSON.stringify(data) }).then(handleResponse);

export const apiUpdateUser = (id: string, data: object) =>
  fetch(`${API_BASE}/auth/users/${id}`, { method: 'PUT', headers: headers(), body: JSON.stringify(data) }).then(handleResponse);

export const apiDeleteUser = (id: string) =>
  fetch(`${API_BASE}/auth/users/${id}`, { method: 'DELETE', headers: headers() }).then(handleResponse);

// ─── HELPERS ─────────────────────────────────────────
export const saveToken = (token: string) => localStorage.setItem('govfeedback_token', token);
export const clearToken = () => localStorage.removeItem('govfeedback_token');
export const isLoggedIn = () => !!getToken();
