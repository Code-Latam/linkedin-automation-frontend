// lib/admin-api.ts
import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export const adminApiClient = axios.create({
  baseURL: `${API_BASE_URL}/admin`,
});

// Request interceptor to add API key
adminApiClient.interceptors.request.use((config) => {
  const apiKey = localStorage.getItem('admin_api_key');
  if (apiKey) {
    config.headers['X-Admin-API-Key'] = apiKey;
  }
  return config;
});

// Response interceptor to handle 401
adminApiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Clear invalid key and redirect to key entry
      localStorage.removeItem('admin_api_key');
      window.location.href = '/admin/setup';
    }
    return Promise.reject(error);
  }
);

// API endpoint functions
export const adminApi = {
  // Clients
  getClientsOverview: () => adminApiClient.get('/clients/overview'),
  getClientHealth: (clientId: string) => adminApiClient.get(`/clients/${clientId}/health`),
  getClientDetails: (clientId: string) => adminApiClient.get(`/clients/${clientId}/details`),
  
  
  // Agents
  getAgentsPerformance: () => adminApiClient.get('/agents/performance'),
  getAgentRolesDistribution: () => adminApiClient.get('/agents/roles/distribution'),
  
  // Pipeline
  getPipelineOverview: (clientId?: string) => adminApiClient.get('/pipeline/overview', { params: { clientId } }),
  getStuckThreads: (clientId?: string, daysInactive?: number) => 
    adminApiClient.get('/pipeline/threads/stuck', { params: { clientId, daysInactive } }),
  
  // System
  getSystemHealth: () => adminApiClient.get('/system/health'),
  getSystemErrors: (params?: { limit?: number; clientId?: string; agentId?: string; from?: string; to?: string }) =>
    adminApiClient.get('/system/errors', { params }),
  
  // Inbound
  getInboundMetrics: (clientId?: string, days?: number) => 
    adminApiClient.get('/inbound/metrics', { params: { clientId, days } }),
  
  // Trends
  getTrendsOverview: (clientId?: string, days?: number) => 
    adminApiClient.get('/trends/overview', { params: { clientId, days } }),
  
  // Alerts
  getActiveAlerts: () => adminApiClient.get('/alerts/active'),
  
  // API Key
  checkApiKeyStatus: () => adminApiClient.get('/api-key/status'),
};