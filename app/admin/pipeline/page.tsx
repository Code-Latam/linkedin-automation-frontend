// app/admin/pipeline/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { adminApi } from '@/lib/admin-api';
import { useAdminRefresh } from '@/hooks/useAdminRefresh';

interface PipelineData {
  totalPersons: number;
  convertedCount: number;
  conversionRate: string;
  personStatus: Array<{ _id: string; count: number }>;
  lifecycleStates: Array<{ _id: string; count: number }>;
  conversationStages: Array<{ _id: string; count: number }>;
  meetingIntent: Array<{ _id: string; count: number }>;
}

export default function PipelinePage() {
  const [data, setData] = useState<PipelineData | null>(null);
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
      // Call without parameters to get all clients data
      const response = await adminApi.getPipelineOverview();
      setData(response.data.data);
    } catch (err: any) {
      setError(err.message || 'Failed to load pipeline data');
    } finally {
      setLoading(false);
    }
  };

  useAdminRefresh(fetchData);

  useEffect(() => {
    fetchData();
  }, []);

  const formatRate = (rate: string | number | undefined): string => {
    if (rate === undefined || rate === null) return '0';
    const num = typeof rate === 'string' ? parseFloat(rate) : rate;
    return isNaN(num) ? '0' : num.toFixed(1);
  };

  if (!mounted) {
    return <div className="p-6"><div className="h-8 w-48 bg-gray-200 rounded animate-pulse"></div></div>;
  }

  if (loading) {
    return <PipelineSkeleton />;
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

  const conversionRateNum = parseFloat(data.conversionRate);

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Pipeline Analytics</h1>
        <p className="text-gray-500 mt-1">Track leads through the conversation funnel</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="border border-gray-200 rounded-lg bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">Total Leads</p>
          <p className="text-3xl font-bold text-gray-900 mt-1">{data.totalPersons.toLocaleString()}</p>
        </div>
        <div className="border border-gray-200 rounded-lg bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">Converted</p>
          <p className="text-3xl font-bold text-green-700 mt-1">{data.convertedCount.toLocaleString()}</p>
          <p className="text-xs text-gray-500 mt-1">lifecycle.state = "converted"</p>
        </div>
        <div className="border border-gray-200 rounded-lg bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">Conversion Rate</p>
          <p className="text-3xl font-bold text-blue-700 mt-1">{formatRate(data.conversionRate)}%</p>
          <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
            <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${Math.min(100, conversionRateNum)}%` }} />
          </div>
        </div>
      </div>

      {/* Lead Status Distribution */}
      <div className="border border-gray-200 rounded-lg bg-white shadow-sm mb-6">
        <div className="px-6 py-4 border-b border-gray-100 bg-gray-50">
          <h2 className="font-semibold text-gray-900">Lead Status Distribution</h2>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {data.personStatus.map((status) => {
              const percentage = data.totalPersons > 0 ? (status.count / data.totalPersons * 100).toFixed(1) : '0';
              return (
                <div key={status._id}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-700 font-medium capitalize">{status._id || 'Unknown'}</span>
                    <div className="flex gap-4">
                      <span className="text-gray-600">{status.count}</span>
                      <span className="text-gray-400 w-12">{percentage}%</span>
                    </div>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${percentage}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Thread Lifecycle States */}
        <div className="border border-gray-200 rounded-lg bg-white shadow-sm">
          <div className="px-6 py-4 border-b border-gray-100 bg-gray-50">
            <h2 className="font-semibold text-gray-900">Thread Lifecycle States</h2>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-2 gap-3">
              {data.lifecycleStates.map((state) => (
                <div key={state._id} className="text-center p-3 bg-gray-50 rounded-lg">
                  <p className="text-2xl font-bold text-gray-900">{state.count}</p>
                  <p className="text-sm text-gray-600 capitalize">{state._id || 'Unknown'}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Conversation Stages */}
        <div className="border border-gray-200 rounded-lg bg-white shadow-sm">
          <div className="px-6 py-4 border-b border-gray-100 bg-gray-50">
            <h2 className="font-semibold text-gray-900">Conversation Stages</h2>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-2 gap-3">
              {data.conversationStages.map((stage) => (
                <div key={stage._id} className="text-center p-3 bg-gray-50 rounded-lg">
                  <p className="text-2xl font-bold text-gray-900">{stage.count}</p>
                  <p className="text-sm text-gray-600 capitalize">{stage._id || 'Unknown'}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Meeting Intent - Full Width */}
      <div className="border border-gray-200 rounded-lg bg-white shadow-sm">
        <div className="px-6 py-4 border-b border-gray-100 bg-gray-50">
          <h2 className="font-semibold text-gray-900">Meeting Intent</h2>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
            {data.meetingIntent.map((intent) => (
              <div key={intent._id} className="text-center p-3 bg-gray-50 rounded-lg">
                <p className="text-2xl font-bold text-gray-900">{intent.count}</p>
                <p className="text-sm text-gray-600 capitalize">{intent._id || 'Unknown'}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function PipelineSkeleton() {
  return (
    <div className="p-6">
      <div className="mb-6">
        <div className="h-8 w-48 bg-gray-200 rounded animate-pulse"></div>
        <div className="h-4 w-64 bg-gray-200 rounded mt-2 animate-pulse"></div>
      </div>
      <div className="grid grid-cols-3 gap-4 mb-8">
        {[1, 2, 3].map(i => <div key={i} className="h-28 bg-gray-200 rounded animate-pulse"></div>)}
      </div>
      <div className="h-64 bg-gray-200 rounded animate-pulse mb-6"></div>
      <div className="grid grid-cols-2 gap-6 mb-6">
        <div className="h-64 bg-gray-200 rounded animate-pulse"></div>
        <div className="h-64 bg-gray-200 rounded animate-pulse"></div>
      </div>
      <div className="h-48 bg-gray-200 rounded animate-pulse"></div>
    </div>
  );
}