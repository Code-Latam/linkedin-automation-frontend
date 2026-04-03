// app/admin/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { adminApi } from '@/lib/admin-api';
import { useAdminRefresh } from '@/hooks/useAdminRefresh';
import { ConversionTrendsChart } from '@/components/admin/ConversionTrendsChart';

interface Client {
  clientId: string;
  name: string;
  email: string;
  status: string;
  plan: string;
  subscriptionStatus: string;
  linkedinStatus: string;
  lastLinkedinCheck: string | null;
  metrics: {
    totalPersons: number;
    activeThreads: number;
    convertedCount: number;
    recentActionsLast7Days: number;
    pendingFailedActions: number;
  };
  createdAt: string;
  lastActive: string;
}

interface DashboardData {
  clientsOverview: Client[];
  summary: {
    totalClients: number;
    activeClients: number;
    totalLeads: number;
    totalConverted: number;
    clientsWithIssues: number;
  };
  systemHealth: {
    clients: { total: number; withLinkedinIssues: number; healthy: number };
    actions: { failed: number; pending: number };
    sync: { threadsWithErrors: number; activeThreads: number };
  };
  activeAlerts: Array<{
    type: string;
    severity: string;
    clientId?: string;
    clientName?: string;
    message: string;
    timestamp: string;
  }>;
  trends: {
    personsByDay: Array<{ _id: string; count: number }>;
    conversionsByDay: Array<{ _id: string; count: number }>;
    dateRange: { from: Date; to: Date; days: number };
  };
}

export default function AdminDashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [clientsRes, healthRes, alertsRes, trendsRes] = await Promise.all([
        adminApi.getClientsOverview(),
        adminApi.getSystemHealth(),
        adminApi.getActiveAlerts(),
        adminApi.getTrendsOverview(),
      ]);
      setData({
        clientsOverview: clientsRes.data.data,
        summary: clientsRes.data.summary,
        systemHealth: healthRes.data.data,
        activeAlerts: alertsRes.data.data,
        trends: trendsRes.data.data,
      });
    } catch (err: any) {
      setError(err.message || 'Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  useAdminRefresh(fetchData);

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) {
    return <DashboardSkeleton />;
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <p className="text-red-700 mb-4">{error}</p>
          <button onClick={fetchData} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const totalLeads = data?.summary?.totalLeads || 0;
  const totalConverted = data?.summary?.totalConverted || 0;
  const overallConversionRate = totalLeads > 0 ? ((totalConverted / totalLeads) * 100).toFixed(1) : '0';

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500 mt-1">Monitor conversions and system health</p>
      </div>

      {/* Row 1: Conversion Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="border border-gray-200 rounded-lg bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">Total Leads</p>
          <p className="text-3xl font-bold text-gray-900 mt-1">{totalLeads.toLocaleString()}</p>
        </div>
        <div className="border border-gray-200 rounded-lg bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">Converted</p>
          <p className="text-3xl font-bold text-green-700 mt-1">{totalConverted.toLocaleString()}</p>
          <p className="text-xs text-gray-500 mt-1">lifecycle.state = "converted"</p>
        </div>
        <div className="border border-gray-200 rounded-lg bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">Conversion Rate</p>
          <p className="text-3xl font-bold text-blue-700 mt-1">{overallConversionRate}%</p>
          <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
            <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${overallConversionRate}%` }} />
          </div>
        </div>
        <div className="border border-gray-200 rounded-lg bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">Active Conversations</p>
          <p className="text-3xl font-bold text-gray-900 mt-1">{data?.systemHealth?.sync?.activeThreads || 0}</p>
        </div>
      </div>

      {/* Row 2: System Health Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="border border-gray-200 rounded-lg bg-white p-4 shadow-sm">
          <p className="text-sm text-gray-500">LinkedIn Issues</p>
          <p className="text-2xl font-bold text-red-700">{data?.systemHealth?.clients?.withLinkedinIssues || 0}</p>
          <p className="text-xs text-gray-400 mt-1">Accounts needing reauth</p>
        </div>
        <div className="border border-gray-200 rounded-lg bg-white p-4 shadow-sm">
          <p className="text-sm text-gray-500">Failed Actions</p>
          <p className="text-2xl font-bold text-red-700">{data?.systemHealth?.actions?.failed || 0}</p>
          <p className="text-xs text-gray-400 mt-1">Pending resolution</p>
        </div>
        <div className="border border-gray-200 rounded-lg bg-white p-4 shadow-sm">
          <p className="text-sm text-gray-500">Total Clients</p>
          <p className="text-2xl font-bold text-gray-900">{data?.systemHealth?.clients?.total || 0}</p>
          <p className="text-xs text-gray-400 mt-1">Active: {data?.systemHealth?.clients?.healthy || 0}</p>
        </div>
      </div>

      {/* Row 3: Conversion Trends Chart */}
      {data?.trends && (
        <div className="mb-6">
          <ConversionTrendsChart data={data.trends} />
        </div>
      )}

      {/* Row 4: Active Alerts */}
      {data?.activeAlerts && data.activeAlerts.length > 0 && (
        <div className="border border-gray-200 rounded-lg bg-white shadow-sm mb-6">
          <div className="px-6 py-4 border-b border-gray-100 bg-gray-50">
            <h2 className="font-semibold text-gray-900">Active Alerts ({data.activeAlerts.length})</h2>
          </div>
          <div className="divide-y divide-gray-100">
            {data.activeAlerts.slice(0, 5).map((alert, idx) => (
              <div key={idx} className="p-4 flex items-start gap-3">
                <div className="w-2 h-2 mt-2 rounded-full bg-red-500"></div>
                <div className="flex-1">
                  <p className="text-sm text-gray-800">{alert.message}</p>
                  {alert.clientName && <p className="text-xs text-gray-500 mt-1">Client: {alert.clientName}</p>}
                  <p className="text-xs text-gray-400 mt-1">{new Date(alert.timestamp).toLocaleString()}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Row 5: Clients Table */}
      <div className="border border-gray-200 rounded-lg bg-white shadow-sm">
        <div className="px-6 py-4 border-b border-gray-100 bg-gray-50">
          <h2 className="font-semibold text-gray-900">Clients Overview</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left text-gray-700 font-semibold">Client</th>
                <th className="px-4 py-3 text-left text-gray-700 font-semibold">Plan</th>
                <th className="px-4 py-3 text-left text-gray-700 font-semibold">LinkedIn</th>
                <th className="px-4 py-3 text-center text-gray-700 font-semibold">Leads</th>
                <th className="px-4 py-3 text-center text-gray-700 font-semibold">Converted</th>
                <th className="px-4 py-3 text-center text-gray-700 font-semibold">Conv %</th>
                <th className="px-4 py-3 text-center text-gray-700 font-semibold">Active</th>
                <th className="px-4 py-3 text-center text-gray-700 font-semibold">Errors</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {data?.clientsOverview?.map((client: Client) => {
                const conversionRate = client.metrics.totalPersons > 0 
                  ? ((client.metrics.convertedCount / client.metrics.totalPersons) * 100).toFixed(1)
                  : '0';
                return (
                  <tr key={client.clientId} className="border-t border-gray-100 hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <p className="font-semibold text-gray-800">{client.name}</p>
                      <p className="text-xs text-gray-500">{client.email}</p>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        client.plan === 'premium' ? 'bg-purple-100 text-purple-700' :
                        client.plan === 'pro' ? 'bg-blue-100 text-blue-700' :
                        'bg-gray-100 text-gray-700'
                      }`}>
                        {client.plan}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5">
                        <div className={`w-2 h-2 rounded-full ${client.linkedinStatus === 'connected' ? 'bg-green-500' : 'bg-red-500'}`} />
                        <span className="text-sm text-gray-700">
                          {client.linkedinStatus === 'connected' ? 'Connected' : client.linkedinStatus || 'Not connected'}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-center font-medium text-gray-800">{client.metrics.totalPersons}</td>
                    <td className="px-4 py-3 text-center">
                      <span className="font-semibold text-green-700">{client.metrics.convertedCount}</span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <span className="font-medium text-gray-800">{conversionRate}%</span>
                        <div className="w-12 bg-gray-200 rounded-full h-1.5">
                          <div className="bg-blue-600 h-1.5 rounded-full" style={{ width: `${conversionRate}%` }} />
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-center text-gray-700">{client.metrics.activeThreads}</td>
                    <td className="px-4 py-3 text-center">
                      {client.metrics.pendingFailedActions > 0 ? (
                        <span className="text-red-600 font-semibold">{client.metrics.pendingFailedActions}</span>
                      ) : (
                        <span className="text-green-600">0</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <a href={`/admin/clients/${client.clientId}`} className="text-blue-600 hover:text-blue-800 text-sm">
                        View →
                      </a>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function DashboardSkeleton() {
  return (
    <div className="p-6">
      <div className="mb-6">
        <div className="h-8 w-48 bg-gray-200 rounded animate-pulse"></div>
        <div className="h-4 w-64 bg-gray-200 rounded mt-2 animate-pulse"></div>
      </div>
      <div className="grid grid-cols-4 gap-4 mb-6">
        {[1, 2, 3, 4].map(i => <div key={i} className="h-28 bg-gray-200 rounded animate-pulse"></div>)}
      </div>
      <div className="grid grid-cols-3 gap-4 mb-6">
        {[1, 2, 3].map(i => <div key={i} className="h-24 bg-gray-200 rounded animate-pulse"></div>)}
      </div>
      <div className="mb-6">
        <div className="h-96 bg-gray-200 rounded animate-pulse"></div>
      </div>
      <div className="h-96 bg-gray-200 rounded animate-pulse"></div>
    </div>
  );
}