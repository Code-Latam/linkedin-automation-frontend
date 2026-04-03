// app/admin/system/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { adminApi } from '@/lib/admin-api';
import { useAdminRefresh } from '@/hooks/useAdminRefresh';
import { AlertTriangle, CheckCircle, XCircle, Clock, RefreshCw, Server, Activity, Bell } from 'lucide-react';

interface SystemHealth {
  clients: {
    total: number;
    withLinkedinIssues: number;
    healthy: number;
  };
  actions: {
    failed: number;
    pending: number;
  };
  sync: {
    threadsWithErrors: number;
  };
  recentFailures: Array<{
    id: string;
    client: string;
    agent: string;
    person: string;
    type: string;
    error: string;
    attempts: number;
    createdAt: string;
  }>;
  errorTypeSummary: Array<{ error: string; count: number }>;
}

export default function SystemHealthPage() {
  const [data, setData] = useState<SystemHealth | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  const [showAllErrors, setShowAllErrors] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await adminApi.getSystemHealth();
      setData(response.data.data);
    } catch (err: any) {
      setError(err.message || 'Failed to load system health data');
    } finally {
      setLoading(false);
    }
  };

  useAdminRefresh(fetchData);

  useEffect(() => {
    fetchData();
  }, []);

  const getStatusColor = (value: number, isError: boolean = true) => {
    if (isError) {
      return value > 0 ? 'text-red-700' : 'text-green-700';
    }
    return value > 0 ? 'text-yellow-700' : 'text-green-700';
  };

  const getStatusBgColor = (value: number, isError: boolean = true) => {
    if (isError) {
      return value > 0 ? 'bg-red-50 border-red-200' : 'bg-green-50 border-green-200';
    }
    return value > 0 ? 'bg-yellow-50 border-yellow-200' : 'bg-green-50 border-green-200';
  };

  if (!mounted) {
    return <div className="p-6"><div className="h-8 w-48 bg-gray-200 rounded animate-pulse"></div></div>;
  }

  if (loading) {
    return <SystemHealthSkeleton />;
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

  if (!data) return null;

  const displayedFailures = showAllErrors ? data.recentFailures : data.recentFailures.slice(0, 10);

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">System Health</h1>
        <p className="text-gray-500 mt-1">Monitor overall system status and errors</p>
      </div>

      {/* Health Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {/* Total Clients */}
        <div className="border border-gray-200 rounded-lg bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <Server size={20} className="text-gray-400" />
            <span className="text-xs text-gray-400">Total</span>
          </div>
          <p className="text-3xl font-bold text-gray-900">{data.clients.total}</p>
          <p className="text-sm text-gray-500 mt-1">Active Clients</p>
          <p className="text-xs text-green-600 mt-2">{data.clients.healthy} healthy</p>
        </div>

        {/* LinkedIn Issues */}
        <div className={`border rounded-lg p-5 shadow-sm ${getStatusBgColor(data.clients.withLinkedinIssues, true)}`}>
          <div className="flex items-center justify-between mb-2">
            <Activity size={20} className={data.clients.withLinkedinIssues > 0 ? 'text-red-500' : 'text-green-500'} />
            <span className="text-xs text-gray-400">Issues</span>
          </div>
          <p className={`text-3xl font-bold ${getStatusColor(data.clients.withLinkedinIssues, true)}`}>
            {data.clients.withLinkedinIssues}
          </p>
          <p className="text-sm text-gray-500 mt-1">LinkedIn Connection Issues</p>
          {data.clients.withLinkedinIssues > 0 && (
            <p className="text-xs text-red-600 mt-2">Accounts need re-authentication</p>
          )}
        </div>

        {/* Failed Actions */}
        <div className={`border rounded-lg p-5 shadow-sm ${getStatusBgColor(data.actions.failed, true)}`}>
          <div className="flex items-center justify-between mb-2">
            <XCircle size={20} className={data.actions.failed > 0 ? 'text-red-500' : 'text-green-500'} />
            <span className="text-xs text-gray-400">Errors</span>
          </div>
          <p className={`text-3xl font-bold ${getStatusColor(data.actions.failed, true)}`}>
            {data.actions.failed}
          </p>
          <p className="text-sm text-gray-500 mt-1">Failed Actions</p>
          {data.actions.pending > 0 && (
            <p className="text-xs text-yellow-600 mt-2">{data.actions.pending} pending</p>
          )}
        </div>

        {/* Sync Errors */}
        <div className={`border rounded-lg p-5 shadow-sm ${getStatusBgColor(data.sync.threadsWithErrors, false)}`}>
          <div className="flex items-center justify-between mb-2">
            <RefreshCw size={20} className={data.sync.threadsWithErrors > 0 ? 'text-yellow-500' : 'text-green-500'} />
            <span className="text-xs text-gray-400">Sync</span>
          </div>
          <p className={`text-3xl font-bold ${getStatusColor(data.sync.threadsWithErrors, false)}`}>
            {data.sync.threadsWithErrors}
          </p>
          <p className="text-sm text-gray-500 mt-1">Threads with Sync Errors</p>
        </div>
      </div>

      {/* Error Type Summary */}
      {data.errorTypeSummary && data.errorTypeSummary.length > 0 && (
        <div className="border border-gray-200 rounded-lg bg-white shadow-sm mb-6">
          <div className="px-6 py-4 border-b border-gray-100 bg-gray-50">
            <h2 className="font-semibold text-gray-900 flex items-center gap-2">
              <AlertTriangle size={18} className="text-yellow-600" />
              Error Type Summary
            </h2>
          </div>
          <div className="p-6">
            <div className="space-y-3">
              {data.errorTypeSummary.map((error, idx) => (
                <div key={idx} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm text-gray-700 font-mono flex-1 truncate">{error.error}</span>
                  <span className="text-sm font-semibold text-gray-900 ml-4 bg-white px-2 py-1 rounded">
                    {error.count}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Recent Failures */}
      <div className="border border-gray-200 rounded-lg bg-white shadow-sm">
        <div className="px-6 py-4 border-b border-gray-100 bg-gray-50">
          <h2 className="font-semibold text-gray-900 flex items-center gap-2">
            <Bell size={18} className="text-red-600" />
            Recent Failures (Last 24h)
            {data.recentFailures.length > 0 && (
              <span className="ml-2 text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded-full">
                {data.recentFailures.length}
              </span>
            )}
          </h2>
        </div>
        <div className="p-6">
          {data.recentFailures.length > 0 ? (
            <>
              <div className="space-y-4">
                {displayedFailures.map((failure) => (
                  <div key={failure.id} className="p-4 bg-red-50 rounded-lg border border-red-200">
                    <div className="flex flex-wrap justify-between items-start gap-2">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-semibold text-red-800 px-2 py-0.5 bg-red-100 rounded text-xs uppercase">
                            {failure.type}
                          </span>
                          <span className="text-xs text-gray-500">
                            Attempts: {failure.attempts}
                          </span>
                        </div>
                        <p className="text-sm text-gray-700 mt-2">
                          <span className="font-medium">Client:</span> {failure.client || 'Unknown'} &nbsp;|&nbsp;
                          <span className="font-medium">Agent:</span> {failure.agent || 'Unknown'} &nbsp;|&nbsp;
                          <span className="font-medium">Person:</span> {failure.person || 'Unknown'}
                        </p>
                        <p className="text-sm text-red-700 mt-2 font-mono bg-red-100 p-2 rounded">
                          {failure.error}
                        </p>
                      </div>
                      <p className="text-xs text-gray-500 whitespace-nowrap">
                        {new Date(failure.createdAt).toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Show More/Less Button */}
              {data.recentFailures.length > 10 && (
                <div className="mt-4 text-center">
                  <button
                    onClick={() => setShowAllErrors(!showAllErrors)}
                    className="text-sm text-blue-600 hover:text-blue-800"
                  >
                    {showAllErrors ? 'Show Less' : `Show ${data.recentFailures.length - 10} More Errors`}
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-8 bg-green-50 rounded-lg">
              <CheckCircle size={32} className="text-green-600 mx-auto mb-2" />
              <p className="text-green-700">No recent failures. System is healthy!</p>
            </div>
          )}
        </div>
      </div>

      {/* System Summary */}
      <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
            <span className="text-sm text-gray-600">Healthy: {data.clients.healthy} clients</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <span className="text-sm text-gray-600">Issues: {data.clients.withLinkedinIssues} clients</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
            <span className="text-sm text-gray-600">Sync Errors: {data.sync.threadsWithErrors} threads</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock size={14} className="text-gray-400" />
            <span className="text-sm text-gray-500">Last updated: {new Date().toLocaleString()}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function SystemHealthSkeleton() {
  return (
    <div className="p-6">
      <div className="mb-6">
        <div className="h-8 w-48 bg-gray-200 rounded animate-pulse"></div>
        <div className="h-4 w-64 bg-gray-200 rounded mt-2 animate-pulse"></div>
      </div>
      <div className="grid grid-cols-4 gap-4 mb-8">
        {[1, 2, 3, 4].map(i => <div key={i} className="h-32 bg-gray-200 rounded animate-pulse"></div>)}
      </div>
      <div className="h-64 bg-gray-200 rounded animate-pulse mb-6"></div>
      <div className="h-96 bg-gray-200 rounded animate-pulse"></div>
    </div>
  );
}