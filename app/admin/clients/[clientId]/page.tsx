// app/admin/clients/[clientId]/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { adminApi } from '@/lib/admin-api';
import { useAdminRefresh } from '@/hooks/useAdminRefresh';
import { ArrowLeft, Users, Calendar, MessageSquare, AlertTriangle, CheckCircle, AlertCircle, MinusCircle, ExternalLink } from 'lucide-react';

interface ClientDetail {
  client: {
    id: string;
    name: string;
    email: string;
    status: string;
    plan: string;
    subscriptionStatus: string;
    timezone: string;
    createdAt: string;
    linkedinAccount: {
      status: string;
      unipileAccountId: string;
      lastCheckedAt: string;
    } | null;
  };
  agents: Array<{ id: string; name: string; role: string; isActive: boolean }>;
  recentPersons: Array<{
    _id: string;
    fullName: string;
    companyName: string;
    personStatus: string;
    createdAt: string;
  }>;
  recentActions: Array<{
    _id: string;
    type: string;
    status: string;
    createdAt: string;
    agent: { name: string };
    person: { fullName: string };
  }>;
  failedActions: Array<{
    _id: string;
    type: string;
    lastError: string;
    attempts: number;
    createdAt: string;
    agent: { name: string };
    person: { fullName: string };
  }>;
  summary: {
    totalPersons: number;
    totalAgents: number;
    failedActionsCount: number;
    convertedCount: number;
  };
}

export default function ClientDetailPage() {
  const params = useParams();
  const clientId = params.clientId as string;
  const [data, setData] = useState<ClientDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await adminApi.getClientDetails(clientId);
      setData(response.data.data);
    } catch (err: any) {
      setError(err.message || 'Failed to load client details');
    } finally {
      setLoading(false);
    }
  };

  useAdminRefresh(fetchData);

  useEffect(() => {
    if (clientId) {
      fetchData();
    }
  }, [clientId]);

  const getLinkedinStatusIcon = (status: string) => {
    switch (status) {
      case 'connected':
        return <CheckCircle size={16} className="text-green-600" />;
      case 'disconnected':
        return <AlertCircle size={16} className="text-red-600" />;
      default:
        return <MinusCircle size={16} className="text-gray-400" />;
    }
  };

  const getPersonStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      converted: 'bg-green-100 text-green-700',
      active: 'bg-blue-100 text-blue-700',
      new: 'bg-gray-100 text-gray-700',
      paused: 'bg-yellow-100 text-yellow-700',
      irrelevant: 'bg-gray-100 text-gray-500',
      archived: 'bg-gray-100 text-gray-500',
    };
    return styles[status] || 'bg-gray-100 text-gray-700';
  };

  // Don't render on server
  if (!mounted) {
    return <div className="p-6"><div className="h-8 w-48 bg-gray-200 rounded animate-pulse"></div></div>;
  }

  if (loading) {
    return <ClientDetailSkeleton />;
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

  const conversionRate = data.summary.totalPersons > 0 
    ? ((data.summary.convertedCount / data.summary.totalPersons) * 100).toFixed(1)
    : '0';

  return (
    <div className="p-6">
      {/* Header with back button */}
      <div className="flex items-center gap-4 mb-6">
        <Link
          href="/admin/clients"
          className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <ArrowLeft size={20} className="text-gray-600" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{data.client.name}</h1>
          <p className="text-gray-500 mt-1">{data.client.email}</p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="border border-gray-200 rounded-lg bg-white p-5 shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <Users size={18} className="text-gray-400" />
            <p className="text-sm text-gray-500">Total Leads</p>
          </div>
          <p className="text-3xl font-bold text-gray-900">{data.summary.totalPersons}</p>
        </div>
        <div className="border border-gray-200 rounded-lg bg-white p-5 shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <Calendar size={18} className="text-gray-400" />
            <p className="text-sm text-gray-500">Converted</p>
          </div>
          <p className="text-3xl font-bold text-green-700">{data.summary.convertedCount}</p>
          <p className="text-xs text-gray-500 mt-1">{conversionRate}% conversion rate</p>
        </div>
        <div className="border border-gray-200 rounded-lg bg-white p-5 shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <MessageSquare size={18} className="text-gray-400" />
            <p className="text-sm text-gray-500">Active Agents</p>
          </div>
          <p className="text-3xl font-bold text-gray-900">{data.summary.totalAgents}</p>
        </div>
        <div className="border border-gray-200 rounded-lg bg-white p-5 shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle size={18} className="text-gray-400" />
            <p className="text-sm text-gray-500">Failed Actions</p>
          </div>
          <p className={`text-3xl font-bold ${data.summary.failedActionsCount > 0 ? 'text-red-700' : 'text-green-700'}`}>
            {data.summary.failedActionsCount}
          </p>
        </div>
      </div>

      {/* LinkedIn Account Status */}
      <div className="border border-gray-200 rounded-lg bg-white shadow-sm mb-6">
        <div className="px-6 py-4 border-b border-gray-100 bg-gray-50">
          <h2 className="font-semibold text-gray-900">LinkedIn Account</h2>
        </div>
        <div className="p-6">
          {data.client.linkedinAccount ? (
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                {getLinkedinStatusIcon(data.client.linkedinAccount.status)}
                <span className="text-gray-700">
                  Status: <span className="font-medium">{data.client.linkedinAccount.status}</span>
                </span>
              </div>
              <p className="text-sm text-gray-500">
                Account ID: {data.client.linkedinAccount.unipileAccountId}
              </p>
              {data.client.linkedinAccount.lastCheckedAt && (
                <p className="text-sm text-gray-500">
                  Last checked: {new Date(data.client.linkedinAccount.lastCheckedAt).toLocaleString()}
                </p>
              )}
            </div>
          ) : (
            <p className="text-gray-500">No LinkedIn account connected</p>
          )}
        </div>
      </div>

      {/* Agents List */}
      {data.agents.length > 0 && (
        <div className="border border-gray-200 rounded-lg bg-white shadow-sm mb-6">
          <div className="px-6 py-4 border-b border-gray-100 bg-gray-50">
            <h2 className="font-semibold text-gray-900">Agents ({data.agents.length})</h2>
          </div>
          <div className="p-6">
            <div className="flex flex-wrap gap-2">
              {data.agents.map((agent) => (
                <span
                  key={agent.id}
                  className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-full text-sm"
                >
                  {agent.name} ({agent.role})
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Recent Persons */}
      <div className="border border-gray-200 rounded-lg bg-white shadow-sm mb-6">
        <div className="px-6 py-4 border-b border-gray-100 bg-gray-50">
          <h2 className="font-semibold text-gray-900">Recent Leads</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left text-gray-700 font-semibold">Name</th>
                <th className="px-4 py-3 text-left text-gray-700 font-semibold">Company</th>
                <th className="px-4 py-3 text-left text-gray-700 font-semibold">Status</th>
                <th className="px-4 py-3 text-left text-gray-700 font-semibold">Created</th>
              </tr>
            </thead>
            <tbody>
              {data.recentPersons.map((person) => (
                <tr key={person._id} className="border-t border-gray-100 hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium text-gray-800">{person.fullName || 'Unnamed'}</td>
                  <td className="px-4 py-3 text-gray-600">{person.companyName || '-'}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPersonStatusBadge(person.personStatus)}`}>
                      {person.personStatus}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-500">{new Date(person.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {data.recentPersons.length === 0 && (
          <div className="text-center py-8 text-gray-500">No leads found</div>
        )}
      </div>

      {/* Failed Actions */}
      {data.failedActions.length > 0 && (
        <div className="border border-red-200 rounded-lg bg-white shadow-sm">
          <div className="px-6 py-4 border-b border-red-100 bg-red-50">
            <h2 className="font-semibold text-red-800">Failed Actions ({data.failedActions.length})</h2>
          </div>
          <div className="divide-y divide-gray-100">
            {data.failedActions.map((action) => (
              <div key={action._id} className="p-4">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <p className="font-semibold text-red-800">{action.type}</p>
                    <p className="text-sm text-gray-600 mt-1">
                      Agent: {action.agent?.name || 'Unknown'} | Person: {action.person?.fullName || 'Unknown'}
                    </p>
                    <p className="text-sm text-red-600 mt-2">{action.lastError}</p>
                  </div>
                  <p className="text-xs text-gray-500 whitespace-nowrap ml-4">
                    {new Date(action.createdAt).toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function ClientDetailSkeleton() {
  return (
    <div className="p-6">
      <div className="flex items-center gap-4 mb-6">
        <div className="h-10 w-10 bg-gray-200 rounded animate-pulse"></div>
        <div>
          <div className="h-8 w-48 bg-gray-200 rounded animate-pulse"></div>
          <div className="h-4 w-64 bg-gray-200 rounded mt-2 animate-pulse"></div>
        </div>
      </div>
      <div className="grid grid-cols-4 gap-4 mb-6">
        {[1, 2, 3, 4].map(i => <div key={i} className="h-28 bg-gray-200 rounded animate-pulse"></div>)}
      </div>
      <div className="h-32 bg-gray-200 rounded animate-pulse mb-6"></div>
      <div className="h-64 bg-gray-200 rounded animate-pulse"></div>
    </div>
  );
}