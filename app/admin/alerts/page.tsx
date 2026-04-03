// app/admin/alerts/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { adminApi } from '@/lib/admin-api';
import { useAdminRefresh } from '@/hooks/useAdminRefresh';
import { AlertTriangle, AlertCircle, Info, CheckCircle, Bell, XCircle, ExternalLink } from 'lucide-react';

interface Alert {
  type: string;
  severity: 'high' | 'medium' | 'low' | 'info';
  clientId?: string;
  clientName?: string;
  message: string;
  timestamp: string;
}

export default function AlertsPage() {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  const [filter, setFilter] = useState<string>('all');

  useEffect(() => {
    setMounted(true);
  }, []);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await adminApi.getActiveAlerts();
      setAlerts(response.data.data || []);
    } catch (err: any) {
      setError(err.message || 'Failed to load alerts');
    } finally {
      setLoading(false);
    }
  };

  useAdminRefresh(fetchData);

  useEffect(() => {
    fetchData();
  }, []);

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'high':
        return <AlertTriangle size={18} className="text-red-600" />;
      case 'medium':
        return <AlertCircle size={18} className="text-yellow-600" />;
      case 'low':
        return <Info size={18} className="text-blue-600" />;
      default:
        return <CheckCircle size={18} className="text-green-600" />;
    }
  };

  const getSeverityBg = (severity: string) => {
    switch (severity) {
      case 'high':
        return 'bg-red-50 border-red-200 hover:bg-red-100';
      case 'medium':
        return 'bg-yellow-50 border-yellow-200 hover:bg-yellow-100';
      case 'low':
        return 'bg-blue-50 border-blue-200 hover:bg-blue-100';
      default:
        return 'bg-green-50 border-green-200 hover:bg-green-100';
    }
  };

  const getSeverityTextColor = (severity: string) => {
    switch (severity) {
      case 'high':
        return 'text-red-800';
      case 'medium':
        return 'text-yellow-800';
      case 'low':
        return 'text-blue-800';
      default:
        return 'text-green-800';
    }
  };

  const getTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      linkedin_disconnected: 'LinkedIn Disconnected',
      high_failure_rate: 'High Failure Rate',
      no_activity_24h: 'No Activity (24h)',
      stuck_threads: 'Stuck Threads',
      new_client: 'New Client'
    };
    return labels[type] || type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  const filteredAlerts = filter === 'all' 
    ? alerts 
    : alerts.filter(alert => alert.severity === filter);

  const severityCounts = {
    high: alerts.filter(a => a.severity === 'high').length,
    medium: alerts.filter(a => a.severity === 'medium').length,
    low: alerts.filter(a => a.severity === 'low').length,
    info: alerts.filter(a => a.severity === 'info').length,
  };

  if (!mounted) {
    return <div className="p-6"><div className="h-8 w-48 bg-gray-200 rounded animate-pulse"></div></div>;
  }

  if (loading) {
    return <AlertsSkeleton />;
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

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Alerts</h1>
        <p className="text-gray-500 mt-1">System alerts requiring attention</p>
      </div>

      {/* Severity Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="border border-gray-200 rounded-lg bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">High Severity</p>
              <p className="text-2xl font-bold text-red-700">{severityCounts.high}</p>
            </div>
            <AlertTriangle size={24} className="text-red-500" />
          </div>
          <button
            onClick={() => setFilter('high')}
            className="text-xs text-blue-600 hover:text-blue-800 mt-2"
          >
            Filter →
          </button>
        </div>
        <div className="border border-gray-200 rounded-lg bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Medium Severity</p>
              <p className="text-2xl font-bold text-yellow-700">{severityCounts.medium}</p>
            </div>
            <AlertCircle size={24} className="text-yellow-500" />
          </div>
          <button
            onClick={() => setFilter('medium')}
            className="text-xs text-blue-600 hover:text-blue-800 mt-2"
          >
            Filter →
          </button>
        </div>
        <div className="border border-gray-200 rounded-lg bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Low Severity</p>
              <p className="text-2xl font-bold text-blue-700">{severityCounts.low}</p>
            </div>
            <Info size={24} className="text-blue-500" />
          </div>
          <button
            onClick={() => setFilter('low')}
            className="text-xs text-blue-600 hover:text-blue-800 mt-2"
          >
            Filter →
          </button>
        </div>
        <div className="border border-gray-200 rounded-lg bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Info</p>
              <p className="text-2xl font-bold text-green-700">{severityCounts.info}</p>
            </div>
            <CheckCircle size={24} className="text-green-500" />
          </div>
          <button
            onClick={() => setFilter('info')}
            className="text-xs text-blue-600 hover:text-blue-800 mt-2"
          >
            Filter →
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div className="flex gap-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
              filter === 'all'
                ? 'bg-gray-800 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            All ({alerts.length})
          </button>
          <button
            onClick={() => setFilter('high')}
            className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
              filter === 'high'
                ? 'bg-red-600 text-white'
                : 'bg-red-50 text-red-700 hover:bg-red-100'
            }`}
          >
            High ({severityCounts.high})
          </button>
          <button
            onClick={() => setFilter('medium')}
            className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
              filter === 'medium'
                ? 'bg-yellow-600 text-white'
                : 'bg-yellow-50 text-yellow-700 hover:bg-yellow-100'
            }`}
          >
            Medium ({severityCounts.medium})
          </button>
          <button
            onClick={() => setFilter('low')}
            className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
              filter === 'low'
                ? 'bg-blue-600 text-white'
                : 'bg-blue-50 text-blue-700 hover:bg-blue-100'
            }`}
          >
            Low ({severityCounts.low})
          </button>
          <button
            onClick={() => setFilter('info')}
            className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
              filter === 'info'
                ? 'bg-green-600 text-white'
                : 'bg-green-50 text-green-700 hover:bg-green-100'
            }`}
          >
            Info ({severityCounts.info})
          </button>
        </div>
      </div>

      {/* Alerts List */}
      {filteredAlerts.length > 0 ? (
        <div className="space-y-3">
          {filteredAlerts.map((alert, index) => (
            <div
              key={index}
              className={`border rounded-lg p-5 transition-all ${getSeverityBg(alert.severity)}`}
            >
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  {getSeverityIcon(alert.severity)}
                </div>
                <div className="flex-1">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`text-xs font-semibold uppercase px-2 py-0.5 rounded ${getSeverityBg(alert.severity)} ${getSeverityTextColor(alert.severity)}`}>
                        {getTypeLabel(alert.type)}
                      </span>
                      <span className={`text-xs font-medium ${getSeverityTextColor(alert.severity)}`}>
                        {alert.severity.toUpperCase()}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500">
                      {new Date(alert.timestamp).toLocaleString()}
                    </p>
                  </div>
                  <p className="text-sm font-medium text-gray-800 mt-2">
                    {alert.message}
                  </p>
                  {alert.clientName && (
                    <div className="mt-2 flex items-center gap-2">
                      <span className="text-xs text-gray-500">Client:</span>
                      <a
                        href={`/admin/clients/${alert.clientId}`}
                        className="text-xs text-blue-600 hover:text-blue-800 flex items-center gap-1"
                      >
                        {alert.clientName} <ExternalLink size={10} />
                      </a>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-green-50 rounded-lg border border-green-200">
          <Bell size={48} className="text-green-600 mx-auto mb-3" />
          <p className="text-green-700 font-medium">No active alerts</p>
          <p className="text-sm text-green-600 mt-1">All systems are operating normally</p>
        </div>
      )}

      {/* Summary Footer */}
      {filteredAlerts.length > 0 && (
        <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <span className="text-sm text-gray-600">High: {severityCounts.high}</span>
              <div className="w-3 h-3 rounded-full bg-yellow-500 ml-3"></div>
              <span className="text-sm text-gray-600">Medium: {severityCounts.medium}</span>
              <div className="w-3 h-3 rounded-full bg-blue-500 ml-3"></div>
              <span className="text-sm text-gray-600">Low: {severityCounts.low}</span>
              <div className="w-3 h-3 rounded-full bg-green-500 ml-3"></div>
              <span className="text-sm text-gray-600">Info: {severityCounts.info}</span>
            </div>
            <button
              onClick={fetchData}
              className="text-sm text-blue-600 hover:text-blue-800"
            >
              Refresh Alerts →
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function AlertsSkeleton() {
  return (
    <div className="p-6">
      <div className="mb-6">
        <div className="h-8 w-48 bg-gray-200 rounded animate-pulse"></div>
        <div className="h-4 w-64 bg-gray-200 rounded mt-2 animate-pulse"></div>
      </div>
      <div className="grid grid-cols-4 gap-4 mb-6">
        {[1, 2, 3, 4].map(i => <div key={i} className="h-24 bg-gray-200 rounded animate-pulse"></div>)}
      </div>
      <div className="space-y-3">
        {[1, 2, 3].map(i => <div key={i} className="h-32 bg-gray-200 rounded animate-pulse"></div>)}
      </div>
    </div>
  );
}