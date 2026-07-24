const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const API_ENDPOINTS = {
  METRICS: `${API_BASE_URL}/api/metrics`,
} as const;