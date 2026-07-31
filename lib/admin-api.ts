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
  // ============================================
  // CLIENTS
  // ============================================
  
  /**
   * Get overview of all clients with health metrics
   */
  getClientsOverview: () => adminApiClient.get('/clients/overview'),
  
  /**
   * Get detailed health metrics for a specific client
   */
  getClientHealth: (clientId: string) => adminApiClient.get(`/clients/${clientId}/health`),
  
  /**
   * Get complete detailed view for a single client
   */
  getClientDetails: (clientId: string) => adminApiClient.get(`/clients/${clientId}/details`),
  
  // ============================================
  // COMMISSION MANAGEMENT
  // ============================================
  
  /**
   * Migrate a client from subscription to commission model
   */
  migrateToCommission: (data: { clientId: string; fixedSuccessFee: number; billingPreference: string }) =>
    adminApiClient.post('/clients/migrate-to-commission', data),
  
  /**
   * Get commission settings for a specific client
   */
  getCommissionSettings: (clientId: string) =>
    adminApiClient.get('/clients/commission-settings', { params: { clientId } }),
  
  /**
   * Update commission settings (fee/preference) for a client
   */
  updateCommissionSettings: (data: { clientId: string; fixedSuccessFee?: number; billingPreference?: string }) =>
    adminApiClient.put('/clients/commission-settings', data),
  
  /**
   * Revert a client from commission model back to subscription
   */
  revertToSubscription: (data: { clientId: string; voidPendingCommissions?: boolean; reason?: string }) =>
    adminApiClient.post('/clients/revert-to-subscription', data),
  
  /**
   * Get information about what would happen if client is reverted
   * Shows pending commissions and summary
   */
  getRevertInfo: (clientId: string) =>
    adminApiClient.get(`/clients/${clientId}/revert-info`),
  
  /**
   * Get overview of all commissions across all clients
   */
  getCommissionsOverview: (params?: { status?: string; limit?: number; offset?: number }) =>
    adminApiClient.get('/commissions/overview', { params }),
  
  /**
   * Get a single commission by ID
   */
  getCommissionById: (commissionId: string) =>
    adminApiClient.get(`/commissions/${commissionId}`),
  
  /**
   * Update commission status (mark as paid, void, etc.)
   */
  updateCommissionStatus: (commissionId: string, data: { status: string; transactionId?: string; paymentMethod?: string; notes?: string }) =>
    adminApiClient.put(`/commissions/${commissionId}/status`, data),
  
  /**
   * Get all commissions for a specific client
   */
  getClientCommissions: (clientId: string, params?: { status?: string; limit?: number; offset?: number }) =>
    adminApiClient.get(`/commissions/client/${clientId}`, { params }),
  
  // ============================================
  // AGENTS
  // ============================================
  
  /**
   * Performance metrics for all agents across clients
   */
  getAgentsPerformance: () => adminApiClient.get('/agents/performance'),
  
  /**
   * Distribution of agent roles across all clients
   */
  getAgentRolesDistribution: () => adminApiClient.get('/agents/roles/distribution'),
  
  // ============================================
  // PIPELINE / CONVERSATIONS
  // ============================================
  
  /**
   * Overall pipeline metrics across all clients
   */
  getPipelineOverview: (clientId?: string) => adminApiClient.get('/pipeline/overview', { params: { clientId } }),
  
  /**
   * Find threads that need attention (stuck/inactive)
   */
  getStuckThreads: (clientId?: string, daysInactive?: number) => 
    adminApiClient.get('/pipeline/threads/stuck', { params: { clientId, daysInactive } }),
  
  // ============================================
  // SYSTEM HEALTH & ERRORS
  // ============================================
  
  /**
   * Overall system health metrics
   */
  getSystemHealth: () => adminApiClient.get('/system/health'),
  
  /**
   * Detailed error log with filtering
   */
  getSystemErrors: (params?: { limit?: number; clientId?: string; agentId?: string; from?: string; to?: string }) =>
    adminApiClient.get('/system/errors', { params }),
  
  // ============================================
  // INBOUND INVITATIONS
  // ============================================
  
  /**
   * Performance metrics for inbound invitation handling
   */
  getInboundMetrics: (clientId?: string, days?: number) => 
    adminApiClient.get('/inbound/metrics', { params: { clientId, days } }),
  
  // ============================================
  // TRENDS / TIME-SERIES
  // ============================================
  
  /**
   * Time-series data for charts
   */
  getTrendsOverview: (clientId?: string, days?: number) => 
    adminApiClient.get('/trends/overview', { params: { clientId, days } }),
  
  // ============================================
  // ALERTS
  // ============================================
  
  /**
   * Get active alerts that need attention
   */
  getActiveAlerts: () => adminApiClient.get('/alerts/active'),
  
  // ============================================
  // API KEY
  // ============================================
  
  /**
   * Check if current API key is valid
   */
  checkApiKeyStatus: () => adminApiClient.get('/api-key/status'),

  getCommissionsList: (params?: { 
    status?: string; 
    clientId?: string; 
    from?: string; 
    to?: string; 
    limit?: number; 
    offset?: number 
  }) => adminApiClient.get('/commissions', { params }),
};