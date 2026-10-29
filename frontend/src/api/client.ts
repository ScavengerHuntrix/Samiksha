import axios from 'axios';
import type { HealthStatus, SystemInfo, Approval } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor to attach JWT token if available
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('samiksha_auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// API helper functions
export const getHealth = async (): Promise<HealthStatus> => {
  const response = await apiClient.get<HealthStatus>('/health');
  return response.data;
};

export const getSystemInfo = async (): Promise<SystemInfo> => {
  const response = await apiClient.get<SystemInfo>('/system/info');
  return response.data;
};

export const getApprovals = async (params?: { category?: string; state?: string; search?: string }): Promise<Approval[]> => {
  const response = await apiClient.get<Approval[]>('/approvals', { params });
  return response.data;
};
