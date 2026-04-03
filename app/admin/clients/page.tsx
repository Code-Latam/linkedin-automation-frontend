// app/admin/clients/page.tsx
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { adminApi } from '@/lib/admin-api';
import { useAdminRefresh } from '@/hooks/useAdminRefresh';
import { Search, ExternalLink, CheckCircle, AlertCircle, MinusCircle } from 'lucide-react';

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

export default function ClientsPage() {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [planFilter, setPlanFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  useEffect(() => {
    setMounted(true);
  }, []);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await adminApi.getClientsOverview();
      setClients(response.data.data || []);
    } catch (err: any) {
      setError(err.message || 'Failed to load clients data');
    } finally {
      setLoading(false);
    }
  };

  useAdminRefresh(fetchData);

  useEffect(() => {
    fetchData();
  }, []);

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

  const getLinkedinStatusText = (status: string) => {
    switch (status) {
      case 'connected':
        return 'Connected';
      case 'disconnected':
        return 'Disconnected';
      default:
        return status || 'Not connected';
    }
  };

  const filteredClients = clients.filter(client => {
    const matchesSearch = client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          client.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPlan = planFilter === 'all' || client.plan === planFilter;
    const matchesStatus = statusFilter === 'all' || client.linkedinStatus === statusFilter;
    return matchesSearch && matchesPlan && matchesStatus;
  });

  // Don't render on server
  if (!mounted) {
    return <div className="p-6"><div className="h-8 w-48 bg-gray-200 rounded animate-pulse"></div></div>;
  }

  if (loading) {
    return <ClientsSkeleton />;
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
        <h1 className="text-2xl font-bold text-gray-900">Clients</h1>
        <p className="text-gray-500 mt-1">Manage and monitor all client accounts</p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 mb-6">
        <div className="flex-1 min-w-[200px]">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
            <input
              type="text"
              placeholder="Search clients..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
        <select
          value={planFilter}
          onChange={(e) => setPlanFilter(e.target.value)}
          className="px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">All Plans</option>
          <option value="free">Free</option>
          <option value="pro">Pro</option>
          <option value="premium">Premium</option>
        </select>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">All LinkedIn Status</option>
          <option value="connected">Connected</option>
          <option value="disconnected">Disconnected</option>
        </select>
      </div>

      {/* Clients Table */}
      <div className="border border-gray-200 rounded-lg bg-white shadow-sm overflow-hidden">
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
              {filteredClients.map((client) => {
                const conversionRate = client.metrics.totalPersons > 0 
                  ? ((client.metrics.convertedCount / client.metrics.totalPersons) * 100).toFixed(1)
                  : '0';
                const rateNum = parseFloat(conversionRate);
                
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
                        {getLinkedinStatusIcon(client.linkedinStatus)}
                        <span className="text-sm text-gray-700">
                          {getLinkedinStatusText(client.linkedinStatus)}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-center font-medium text-gray-800">{client.metrics.totalPersons}</td>
                    <td className="px-4 py-3 text-center font-medium text-green-700">{client.metrics.convertedCount}</td>
                    <td className="px-4 py-3 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <span className={`font-medium ${rateNum > 10 ? 'text-green-700' : 'text-gray-800'}`}>
                          {conversionRate}%
                        </span>
                        <div className="w-12 bg-gray-200 rounded-full h-1.5">
                          <div className="bg-blue-600 h-1.5 rounded-full" style={{ width: `${Math.min(100, rateNum)}%` }} />
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
                      <Link
                        href={`/admin/clients/${client.clientId}`}
                        className="text-blue-600 hover:text-blue-800 flex items-center gap-1"
                      >
                        View <ExternalLink size={12} />
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {filteredClients.length === 0 && (
          <div className="text-center py-12 text-gray-500">No clients found</div>
        )}
      </div>
    </div>
  );
}

function ClientsSkeleton() {
  return (
    <div className="p-6">
      <div className="mb-6">
        <div className="h-8 w-48 bg-gray-200 rounded animate-pulse"></div>
        <div className="h-4 w-64 bg-gray-200 rounded mt-2 animate-pulse"></div>
      </div>
      <div className="h-10 bg-gray-200 rounded animate-pulse mb-6"></div>
      <div className="h-96 bg-gray-200 rounded animate-pulse"></div>
    </div>
  );
}