// app/admin/inbound/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { adminApi } from '@/lib/admin-api';
import { useAdminRefresh } from '@/hooks/useAdminRefresh';
import { Mail, MessageSquare, TrendingUp, Users, CheckCircle, XCircle } from 'lucide-react';

interface InboundData {
  totalInbound: number;
  withInvitationMessages: number;
  messageRate: string;
  convertedCount: number;
  inboundConversionRate: string;
  byDay: Array<{ _id: string; count: number; withMessages: number }>;
  recentInbound: Array<{
    id: string;
    name: string;
    company: string;
    createdAt: string;
    hadMessage: boolean;
    converted: boolean;
  }>;
}

export default function InboundPage() {
  const [data, setData] = useState<InboundData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  const [days, setDays] = useState(30);

  useEffect(() => {
    setMounted(true);
  }, []);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await adminApi.getInboundMetrics(undefined, days);
      setData(response.data.data);
    } catch (err: any) {
      setError(err.message || 'Failed to load inbound metrics');
    } finally {
      setLoading(false);
    }
  };

  useAdminRefresh(fetchData);

  useEffect(() => {
    fetchData();
  }, [days]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  if (!mounted) {
    return <div className="p-6"><div className="h-8 w-48 bg-gray-200 rounded animate-pulse"></div></div>;
  }

  if (loading) {
    return <InboundSkeleton />;
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

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Inbound Invitations</h1>
        <p className="text-gray-500 mt-1">Track automatically accepted connection requests</p>
      </div>

      {/* Date Range Filter */}
      <div className="flex justify-end mb-4">
        <select
          value={days}
          onChange={(e) => setDays(parseInt(e.target.value))}
          className="px-3 py-1.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value={7}>Last 7 days</option>
          <option value={30}>Last 30 days</option>
          <option value={60}>Last 60 days</option>
          <option value={90}>Last 90 days</option>
        </select>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
        <div className="border border-gray-200 rounded-lg bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <Users size={18} className="text-gray-400" />
          </div>
          <p className="text-3xl font-bold text-gray-900">{data.totalInbound}</p>
          <p className="text-sm text-gray-500 mt-1">Total Inbound</p>
        </div>

        <div className="border border-gray-200 rounded-lg bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <MessageSquare size={18} className="text-gray-400" />
          </div>
          <p className="text-3xl font-bold text-gray-900">{data.withInvitationMessages}</p>
          <p className="text-sm text-gray-500 mt-1">With Messages</p>
          <p className="text-xs text-blue-600 mt-1">{data.messageRate}% of total</p>
        </div>

        <div className="border border-gray-200 rounded-lg bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <Mail size={18} className="text-gray-400" />
          </div>
          <p className="text-3xl font-bold text-green-700">{data.convertedCount}</p>
          <p className="text-sm text-gray-500 mt-1">Converted</p>
          <p className="text-xs text-green-600 mt-1">lifecycle.state = "converted"</p>
        </div>

        <div className="border border-gray-200 rounded-lg bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <TrendingUp size={18} className="text-gray-400" />
          </div>
          <p className="text-3xl font-bold text-blue-700">{data.inboundConversionRate}%</p>
          <p className="text-sm text-gray-500 mt-1">Inbound Conversion Rate</p>
          <div className="w-full bg-gray-200 rounded-full h-1.5 mt-2">
            <div 
              className="bg-blue-600 h-1.5 rounded-full" 
              style={{ width: `${Math.min(100, parseFloat(data.inboundConversionRate))}%` }} 
            />
          </div>
        </div>

        <div className="border border-gray-200 rounded-lg bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <MessageSquare size={18} className="text-gray-400" />
          </div>
          <p className="text-3xl font-bold text-purple-700">{data.messageRate}%</p>
          <p className="text-sm text-gray-500 mt-1">Message Rate</p>
          <div className="w-full bg-gray-200 rounded-full h-1.5 mt-2">
            <div 
              className="bg-purple-600 h-1.5 rounded-full" 
              style={{ width: `${Math.min(100, parseFloat(data.messageRate))}%` }} 
            />
          </div>
        </div>
      </div>

      {/* Recent Inbound Table */}
      <div className="border border-gray-200 rounded-lg bg-white shadow-sm">
        <div className="px-6 py-4 border-b border-gray-100 bg-gray-50">
          <h2 className="font-semibold text-gray-900">Recent Inbound Connections</h2>
          <p className="text-sm text-gray-500 mt-0.5">Last 20 inbound leads</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left text-gray-700 font-semibold">Name</th>
                <th className="px-4 py-3 text-left text-gray-700 font-semibold">Company</th>
                <th className="px-4 py-3 text-left text-gray-700 font-semibold">Date</th>
                <th className="px-4 py-3 text-center text-gray-700 font-semibold">Had Message</th>
                <th className="px-4 py-3 text-center text-gray-700 font-semibold">Converted</th>
              </tr>
            </thead>
            <tbody>
              {data.recentInbound.map((person) => (
                <tr key={person.id} className="border-t border-gray-100 hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium text-gray-800">{person.name || 'Unknown'}</td>
                  <td className="px-4 py-3 text-gray-600">{person.company || '-'}</td>
                  <td className="px-4 py-3 text-gray-500">{formatDate(person.createdAt)}</td>
                  <td className="px-4 py-3 text-center">
                    {person.hadMessage ? (
                      <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                        <CheckCircle size={12} /> Yes
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                        <XCircle size={12} /> No
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-center">
                    {person.converted ? (
                      <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                        <CheckCircle size={12} /> Yes
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                        No
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {data.recentInbound.length === 0 && (
          <div className="text-center py-12 text-gray-500">No inbound connections found</div>
        )}
      </div>

      {/* Insight Section */}
      {data.totalInbound > 0 && (
        <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <h3 className="font-semibold text-blue-800 mb-2">Insights</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
              <span className="text-gray-700">
                <strong>{data.withInvitationMessages}</strong> out of <strong>{data.totalInbound}</strong> inbound leads sent a message ({data.messageRate}%)
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-blue-500"></div>
              <span className="text-gray-700">
                <strong>{data.convertedCount}</strong> inbound leads converted ({data.inboundConversionRate}% conversion rate)
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function InboundSkeleton() {
  return (
    <div className="p-6">
      <div className="mb-6">
        <div className="h-8 w-48 bg-gray-200 rounded animate-pulse"></div>
        <div className="h-4 w-64 bg-gray-200 rounded mt-2 animate-pulse"></div>
      </div>
      <div className="grid grid-cols-5 gap-4 mb-8">
        {[1, 2, 3, 4, 5].map(i => <div key={i} className="h-32 bg-gray-200 rounded animate-pulse"></div>)}
      </div>
      <div className="h-96 bg-gray-200 rounded animate-pulse"></div>
    </div>
  );
}