// Centraliserade API-konstanter - använd Vite env `VITE_API_URL` i produktion
export const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';
export const API = `${API_BASE}/api`;

export default API;
