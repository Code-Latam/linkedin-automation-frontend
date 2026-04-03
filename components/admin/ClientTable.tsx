// components/admin/ClientTable.tsx
'use client';

import Link from 'next/link';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { ExternalLink, CheckCircle, AlertCircle, MinusCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

dayjs.extend(relativeTime);

interface Client {
  clientId: string;
  name: string;
  email: string;
  status: string;
  plan: string;
  linkedinStatus: string;
  metrics: {
    totalPersons: number;
    activeThreads: number;
    meetingsBooked: number;
    pendingFailedActions: number;
  };
  createdAt: string;
}

interface ClientTableProps {
  clients: Client[];
}

export function ClientTable({ clients }: ClientTableProps) {
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

  const formatDate = (dateString: string) => {
    const date = dayjs(dateString);
    return date.fromNow();
  };

  return (
    <div className="rounded-lg border border-gray-200 bg-white shadow-sm">
      <div className="px-4 py-3 border-b border-gray-200 bg-gray-50">
        <h3 className="font-semibold text-gray-800">Clients Overview</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr className="border-b border-gray-200">
              <th className="px-4 py-3 text-left text-gray-700 font-semibold">Client</th>
              <th className="px-4 py-3 text-left text-gray-700 font-semibold">Plan</th>
              <th className="px-4 py-3 text-left text-gray-700 font-semibold">LinkedIn</th>
              <th className="px-4 py-3 text-center text-gray-700 font-semibold">Leads</th>
              <th className="px-4 py-3 text-center text-gray-700 font-semibold">Active</th>
              <th className="px-4 py-3 text-center text-gray-700 font-semibold">Meetings</th>
              <th className="px-4 py-3 text-center text-gray-700 font-semibold">Errors</th>
              <th className="px-4 py-3 text-left text-gray-700 font-semibold">Created</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {clients.map((client) => (
              <tr key={client.clientId} className="border-t border-gray-100 hover:bg-gray-50 transition-colors">
                <td className="px-4 py-3">
                  <div>
                    <p className="font-semibold text-gray-800">{client.name}</p>
                    <p className="text-xs text-gray-500">{client.email}</p>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <span className={cn(
                    'px-2 py-1 rounded-full text-xs font-semibold',
                    client.plan === 'premium' && 'bg-purple-100 text-purple-700',
                    client.plan === 'pro' && 'bg-blue-100 text-blue-700',
                    client.plan === 'free' && 'bg-gray-100 text-gray-700'
                  )}>
                    {client.plan}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1.5">
                    {getLinkedinStatusIcon(client.linkedinStatus)}
                    <span className="text-sm text-gray-700">{getLinkedinStatusText(client.linkedinStatus)}</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-center font-medium text-gray-800">{client.metrics.totalPersons}</td>
                <td className="px-4 py-3 text-center font-medium text-gray-800">{client.metrics.activeThreads}</td>
                <td className="px-4 py-3 text-center font-medium text-gray-800">{client.metrics.meetingsBooked}</td>
                <td className="px-4 py-3 text-center">
                  {client.metrics.pendingFailedActions > 0 ? (
                    <span className="text-red-600 font-semibold">{client.metrics.pendingFailedActions}</span>
                  ) : (
                    <span className="text-green-600 font-medium">0</span>
                  )}
                </td>
                <td className="px-4 py-3 text-sm text-gray-500">
                  {formatDate(client.createdAt)}
                </td>
                <td className="px-4 py-3">
                  <Link
                    href={`/admin/clients/${client.clientId}`}
                    className="text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1"
                  >
                    View <ExternalLink size={12} />
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}