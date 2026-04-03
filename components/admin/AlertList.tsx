// components/admin/AlertList.tsx
'use client';

import { AlertTriangle, AlertCircle, Info, CheckCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Alert {
  type: string;
  severity: 'high' | 'medium' | 'low' | 'info';
  clientId?: string;
  clientName?: string;
  message: string;
  timestamp: string;
}

interface AlertListProps {
  alerts: Alert[];
}

export function AlertList({ alerts }: AlertListProps) {
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
        return 'bg-red-50 border-red-200';
      case 'medium':
        return 'bg-yellow-50 border-yellow-200';
      case 'low':
        return 'bg-blue-50 border-blue-200';
      default:
        return 'bg-green-50 border-green-200';
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

  if (alerts.length === 0) {
    return null;
  }

  return (
    <div className="rounded-lg border border-gray-200 bg-white shadow-sm">
      <div className="px-4 py-3 border-b border-gray-200 bg-gray-50">
        <h3 className="font-semibold text-gray-800 flex items-center gap-2">
          <AlertTriangle size={16} className="text-yellow-600" />
          Active Alerts ({alerts.length})
        </h3>
      </div>
      <div className="divide-y divide-gray-100">
        {alerts.map((alert, index) => (
          <div key={index} className={cn('p-4', getSeverityBg(alert.severity))}>
            <div className="flex items-start gap-3">
              {getSeverityIcon(alert.severity)}
              <div className="flex-1">
                <p className={cn('text-sm font-semibold', getSeverityTextColor(alert.severity))}>
                                  {alert.clientName ? `Client: ${alert.clientName}` : alert.message}
                </p>
                {!alert.clientName && (
                  <p className="text-sm text-gray-700 mt-1">{alert.message}</p>
                )}
                <p className="text-xs text-gray-500 mt-2">
                  {new Date(alert.timestamp).toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}