/**
 * API Service Layer
 * Centralized Axios client with interceptors, mock support, and typed endpoints.
 */
import axios, { type AxiosInstance, type AxiosRequestConfig } from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api/v1';
const USE_MOCK = import.meta.env.VITE_USE_MOCK !== 'false'; // default to mock

// ─── Axios Client ───────────────────────────────────────────────────

const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: { 'Content-Type': 'application/json' },
});

// Request interceptor — attach auth token
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Response interceptor — global error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('auth_token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export { apiClient };

// ─── Generic Fetch Helper ───────────────────────────────────────────

export async function apiFetch<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
  const { data } = await apiClient.get<T>(url, config);
  return data;
}

export async function apiPost<T>(url: string, body?: unknown, config?: AxiosRequestConfig): Promise<T> {
  const { data } = await apiClient.post<T>(url, body, config);
  return data;
}
