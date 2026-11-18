// app/admin/webinars/[webinarId]/page.tsx
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { adminApi } from '@/lib/admin-api';
import { useAdminRefresh } from '@/hooks/useAdminRefresh';
import { WebinarEvent, WebinarRegistration } from '@/types/webinar';
import { ArrowLeft, Download, RefreshCw, Users } from 'lucide-react';

const STATUS_LABELS: Record<string, string> = {
  draft: 'Draft',
  open: 'Open',
  completed: 'Completed',
  cancelled: 'Cancelled',
};

function formatDate(iso: string | null | undefined): string {
  if (!iso) return '-';
  return new Date(iso).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}

function csvEscape(value: string): string {
  if (/[",\n]/.test(value)) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

export default function AdminWebinarDetailPage() {
  const params = useParams();
  const webinarId = params.webinarId as string;

  const [event, setEvent] = useState<WebinarEvent | null>(null);
  const [registrations, setRegistrations] = useState<WebinarRegistration[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [eventRes, regRes] = await Promise.all([
        adminApi.getWebinarEvent(webinarId),
        adminApi.getWebinarRegistrations(webinarId),
      ]);
      setEvent(eventRes.data.data);
      setRegistrations(regRes.data.data || []);
    } catch (err: any) {
      setError(err.message || 'Failed to load webinar');
    } finally {
      setLoading(false);
    }
  };

  useAdminRefresh(fetchData);

  useEffect(() => {
    if (webinarId) fetchData();
  }, [webinarId]);

  const exportToCSV = () => {
    if (!event || registrations.length === 0) return;

    const headers = ['Full Name', 'Email', 'Company', 'Job Title', 'LinkedIn URL', 'Registered At'];
    const rows = registrations.map((r) => [
      r.fullName,
      r.email,
      r.company || '',
      r.jobTitle || '',
      r.linkedInUrl || '',
      formatDate(r.createdAt),
    ]);

    const csv = [headers.join(','), ...rows.map((row) => row.map(csvEscape).join(','))].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `webinar_${event.slug}_registrations.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="h-8 w-64 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-4"></div>
        <div className="h-96 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <p className="text-red-700 mb-4">{error || 'Webinar not found'}</p>
          <Link href="/admin/webinars" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 inline-block">
            Back to Webinars
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6 flex justify-between items-start flex-wrap gap-4">
        <div>
          <Link
            href="/admin/webinars"
            className="inline-flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700 mb-3"
          >
            <ArrowLeft size={16} />
            Back to Webinars
          </Link>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{event.title}</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">/events/{event.slug}</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={exportToCSV}
            className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition flex items-center gap-2"
          >
            <Download size={16} />
            Export CSV
          </button>
          <button
            onClick={fetchData}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center gap-2"
          >
            <RefreshCw size={16} />
            Refresh
          </button>
        </div>
      </div>

      {/* Event details */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-5 shadow-sm">
          <p className="text-sm text-gray-500 dark:text-gray-400">Status</p>
          <p className="text-lg font-semibold text-gray-900 dark:text-white mt-1">
            {STATUS_LABELS[event.status] || event.status}
          </p>
        </div>
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-5 shadow-sm">
          <p className="text-sm text-gray-500 dark:text-gray-400">Starts</p>
          <p className="text-lg font-semibold text-gray-900 dark:text-white mt-1">{formatDate(event.startsAt)}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-5 shadow-sm">
          <div className="flex items-center gap-2">
            <Users size={16} className="text-blue-600" />
            <p className="text-sm text-gray-500 dark:text-gray-400">Registrants</p>
          </div>
          <p className="text-lg font-semibold text-gray-900 dark:text-white mt-1">
            {registrations.length}
            {event.capacity ? ` / ${event.capacity}` : ''}
          </p>
        </div>
      </div>

      {event.location && (
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-1"><strong>Location:</strong> {event.location}</p>
      )}
      {event.meetingLink && (
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
          <strong>Meeting link:</strong>{' '}
          <a href={event.meetingLink} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
            {event.meetingLink}
          </a>
        </p>
      )}
      {event.recordingLink && (
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
          <strong>Recording:</strong>{' '}
          <a href={event.recordingLink} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
            {event.recordingLink}
          </a>
        </p>
      )}

      {/* Registrants table */}
      <div className="border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-700">
              <tr>
                <th className="px-4 py-3 text-left text-gray-700 dark:text-gray-300 font-semibold">Name</th>
                <th className="px-4 py-3 text-left text-gray-700 dark:text-gray-300 font-semibold">Email</th>
                <th className="px-4 py-3 text-left text-gray-700 dark:text-gray-300 font-semibold">Company</th>
                <th className="px-4 py-3 text-left text-gray-700 dark:text-gray-300 font-semibold">Job Title</th>
                <th className="px-4 py-3 text-left text-gray-700 dark:text-gray-300 font-semibold">LinkedIn</th>
                <th className="px-4 py-3 text-left text-gray-700 dark:text-gray-300 font-semibold">Registered</th>
              </tr>
            </thead>
            <tbody>
              {registrations.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-gray-500 dark:text-gray-400">
                    No registrations yet.
                  </td>
                </tr>
              ) : (
                registrations.map((r) => (
                  <tr key={r._id} className="border-t border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-4 py-3 font-medium text-gray-800 dark:text-gray-200">{r.fullName}</td>
                    <td className="px-4 py-3 text-gray-600 dark:text-gray-400">{r.email}</td>
                    <td className="px-4 py-3 text-gray-600 dark:text-gray-400">{r.company || '-'}</td>
                    <td className="px-4 py-3 text-gray-600 dark:text-gray-400">{r.jobTitle || '-'}</td>
                    <td className="px-4 py-3 text-gray-600 dark:text-gray-400">
                      {r.linkedInUrl ? (
                        <a href={r.linkedInUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                          Profile
                        </a>
                      ) : '-'}
                    </td>
                    <td className="px-4 py-3 text-gray-600 dark:text-gray-400">{formatDate(r.createdAt)}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
