// app/admin/webinars/page.tsx
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { adminApi } from '@/lib/admin-api';
import { useAdminRefresh } from '@/hooks/useAdminRefresh';
import { WebinarEvent, WebinarStatus } from '@/types/webinar';
import {
  Calendar,
  Plus,
  RefreshCw,
  Eye,
  Pencil,
  Trash2,
  Copy,
  Loader2,
} from 'lucide-react';

const STATUSES: WebinarStatus[] = ['draft', 'open', 'completed', 'cancelled'];

const STATUS_LABELS: Record<WebinarStatus, string> = {
  draft: 'Draft',
  open: 'Open',
  completed: 'Completed',
  cancelled: 'Cancelled',
};

const STATUS_BADGES: Record<WebinarStatus, string> = {
  draft: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300',
  open: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
  completed: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
  cancelled: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
};

const INTERVAL_OPTIONS = [
  { value: 1, label: 'Weekly' },
  { value: 2, label: 'Every 2 weeks' },
  { value: 3, label: 'Every 3 weeks' },
  { value: 4, label: 'Every 4 weeks' },
];

function intervalLabel(n: number | null | undefined): string {
  return INTERVAL_OPTIONS.find((o) => o.value === (n ?? 1))?.label ?? `Every ${n ?? 1} weeks`;
}

interface WebinarFormState {
  title: string;
  slug: string;
  description: string;
  location: string;
  meetingLink: string;
  recordingLink: string;
  startsAt: string; // datetime-local string
  endsAt: string; // datetime-local string
  timezone: string;
  status: WebinarStatus;
  capacity: string;
  repeatsWeekly: boolean;
  recurrenceIntervalWeeks: number; // 1..4
  recurrenceEndsAt: string; // YYYY-MM-DD, blank = no end date
}

const EMPTY_FORM: WebinarFormState = {
  title: '',
  slug: '',
  description: '',
  location: '',
  meetingLink: '',
  recordingLink: '',
  startsAt: '',
  endsAt: '',
  timezone: 'America/New_York',
  status: 'draft',
  capacity: '',
  repeatsWeekly: false,
  recurrenceIntervalWeeks: 1,
  recurrenceEndsAt: '',
};

// Convert an ISO date to a `datetime-local` input value (local time).
function toDatetimeLocal(iso: string | null | undefined): string {
  if (!iso) return '';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '';
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

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

export default function AdminWebinarsPage() {
  const [events, setEvents] = useState<WebinarEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<WebinarEvent | null>(null);
  const [form, setForm] = useState<WebinarFormState>(EMPTY_FORM);
  const [saving, setSaving] = useState(false);

  const [deleteTarget, setDeleteTarget] = useState<WebinarEvent | null>(null);
  const [deleting, setDeleting] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await adminApi.getWebinarEvents();
      setEvents(res.data.data || []);
    } catch (err: any) {
      setError(err.message || 'Failed to load webinars');
    } finally {
      setLoading(false);
    }
  };

  useAdminRefresh(fetchData);

  useEffect(() => {
    fetchData();
  }, []);

  const openCreate = () => {
    setEditingEvent(null);
    setForm(EMPTY_FORM);
    setModalOpen(true);
  };

  const openEdit = (event: WebinarEvent) => {
    setEditingEvent(event);
    setForm({
      title: event.title || '',
      slug: event.slug || '',
      description: event.description || '',
      location: event.location || '',
      meetingLink: event.meetingLink || '',
      recordingLink: event.recordingLink || '',
      startsAt: toDatetimeLocal(event.startsAt),
      endsAt: toDatetimeLocal(event.endsAt),
      timezone: event.timezone || 'America/New_York',
      status: event.status,
      capacity: event.capacity ? String(event.capacity) : '',
      repeatsWeekly: !!event.repeatsWeekly,
      recurrenceIntervalWeeks: event.recurrenceIntervalWeeks || 1,
      recurrenceEndsAt: event.recurrenceEndsAt
        ? new Date(event.recurrenceEndsAt).toISOString().slice(0, 10)
        : '',
    });
    setModalOpen(true);
  };

  const handleSubmit = async () => {
    if (!form.title.trim()) {
      alert('Title is required');
      return;
    }
    if (!form.startsAt) {
      alert('Start date/time is required');
      return;
    }

    const payload: Record<string, unknown> = {
      title: form.title.trim(),
      slug: form.slug.trim(),
      description: form.description,
      location: form.location,
      meetingLink: form.meetingLink,
      recordingLink: form.recordingLink,
      startsAt: new Date(form.startsAt).toISOString(),
      endsAt: form.endsAt ? new Date(form.endsAt).toISOString() : null,
      timezone: form.timezone,
      status: form.status,
      capacity: form.capacity ? Number(form.capacity) : null,
      repeatsWeekly: form.repeatsWeekly,
      recurrenceIntervalWeeks: form.recurrenceIntervalWeeks,
      recurrenceEndsAt:
        form.repeatsWeekly && form.recurrenceEndsAt
          ? `${form.recurrenceEndsAt}T00:00:00Z`
          : null,
    };

    setSaving(true);
    try {
      if (editingEvent) {
        await adminApi.updateWebinarEvent(editingEvent._id, payload);
      } else {
        await adminApi.createWebinarEvent(payload);
      }
      setModalOpen(false);
      setEditingEvent(null);
      await fetchData();
    } catch (err: any) {
      alert('Failed to save webinar: ' + (err.response?.data?.error || err.message));
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await adminApi.deleteWebinarEvent(deleteTarget._id);
      setDeleteTarget(null);
      await fetchData();
    } catch (err: any) {
      alert('Failed to delete webinar: ' + (err.response?.data?.error || err.message));
    } finally {
      setDeleting(false);
    }
  };

  const copyPublicLink = (slug: string) => {
    const url = `${window.location.origin}/events/${slug}`;
    navigator.clipboard?.writeText(url).then(() => {
      alert('Link copied: ' + url);
    });
  };

  if (loading) {
    return <WebinarsSkeleton />;
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
      <div className="mb-6 flex justify-between items-center flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">🎥 Webinar Events</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Create and manage webinars, registrations, and reminders
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={fetchData}
            className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition flex items-center gap-2"
          >
            <RefreshCw size={16} />
            Refresh
          </button>
          <button
            onClick={openCreate}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center gap-2"
          >
            <Plus size={16} />
            New Webinar
          </button>
        </div>
      </div>

      <div className="border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-700">
              <tr>
                <th className="px-4 py-3 text-left text-gray-700 dark:text-gray-300 font-semibold">Event</th>
                <th className="px-4 py-3 text-left text-gray-700 dark:text-gray-300 font-semibold">Starts</th>
                <th className="px-4 py-3 text-left text-gray-700 dark:text-gray-300 font-semibold">Status</th>
                <th className="px-4 py-3 text-center text-gray-700 dark:text-gray-300 font-semibold">Registrants</th>
                <th className="px-4 py-3 text-center text-gray-700 dark:text-gray-300 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {events.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-gray-500 dark:text-gray-400">
                    No webinars yet. Click &quot;New Webinar&quot; to create one.
                  </td>
                </tr>
              ) : (
                events.map((e) => (
                  <tr key={e._id} className="border-t border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-4 py-3">
                      <p className="font-semibold text-gray-800 dark:text-gray-200">
                        {e.title}
                        {e.repeatsWeekly && (
                          <span className="ml-2 px-2 py-0.5 rounded-full text-xs font-semibold bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400">
                            ↻ {intervalLabel(e.recurrenceIntervalWeeks)}
                          </span>
                        )}
                        {e.seriesOf && (
                          <span className="ml-2 px-2 py-0.5 rounded-full text-xs font-semibold bg-gray-100 text-gray-600 dark:bg-gray-600 dark:text-gray-300">
                            wk {e.occurrenceIndex ?? '?'}
                          </span>
                        )}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">/events/{e.slug}</p>
                      {e.repeatsWeekly && (
                        <p className="text-xs text-purple-600 dark:text-purple-400 mt-0.5">
                          Next: {formatDate(e.nextOccurrenceAt)}
                        </p>
                      )}
                    </td>
                    <td className="px-4 py-3 text-gray-600 dark:text-gray-400">{formatDate(e.startsAt)}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${STATUS_BADGES[e.status]}`}>
                        {STATUS_LABELS[e.status]}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center text-gray-700 dark:text-gray-300">{e.registeredCount ?? 0}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => copyPublicLink(e.slug)}
                          className="p-1.5 text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-600 rounded transition"
                          title="Copy public link"
                        >
                          <Copy size={16} />
                        </button>
                        <Link
                          href={`/admin/webinars/${e._id}`}
                          className="p-1.5 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded transition"
                          title="View registrants"
                        >
                          <Eye size={16} />
                        </Link>
                        <button
                          onClick={() => openEdit(e)}
                          className="p-1.5 text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-900/30 rounded transition"
                          title="Edit"
                        >
                          <Pencil size={16} />
                        </button>
                        <button
                          onClick={() => setDeleteTarget(e)}
                          className="p-1.5 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 rounded transition"
                          title="Delete"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create / Edit modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-2xl w-full mx-4 my-8 p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                {editingEvent ? 'Edit Webinar' : 'New Webinar'}
              </h2>
              <button
                onClick={() => { setModalOpen(false); setEditingEvent(null); }}
                className="text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 text-2xl"
              >
                ×
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[70vh] overflow-y-auto pr-1">
              <Field label="Title *">
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="w-full px-3 py-2 bg-white text-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                />
              </Field>

              <Field label="Slug (optional — auto-generated)">
                <input
                  type="text"
                  value={form.slug}
                  onChange={(e) => setForm({ ...form, slug: e.target.value })}
                  placeholder="my-webinar"
                  className="w-full px-3 py-2 bg-white text-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                />
              </Field>

              <Field label="Location / Platform" span={2}>
                <input
                  type="text"
                  value={form.location}
                  onChange={(e) => setForm({ ...form, location: e.target.value })}
                  placeholder="Zoom, Google Meet, or venue"
                  className="w-full px-3 py-2 bg-white text-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                />
              </Field>

              <Field label="Meeting Link" span={2}>
                <input
                  type="text"
                  value={form.meetingLink}
                  onChange={(e) => setForm({ ...form, meetingLink: e.target.value })}
                  placeholder="https://zoom.us/j/..."
                  className="w-full px-3 py-2 bg-white text-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                />
              </Field>

              <Field label="Recording Link (YouTube)" span={2}>
                <input
                  type="text"
                  value={form.recordingLink}
                  onChange={(e) => setForm({ ...form, recordingLink: e.target.value })}
                  placeholder="https://youtube.com/watch?v=..."
                  className="w-full px-3 py-2 bg-white text-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                />
              </Field>

              <Field label="Description" span={2}>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 bg-white text-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                />
              </Field>

              <Field
                label={
                  editingEvent?.repeatsWeekly
                    ? 'Starts At * (locked — defines the recurring weekday)'
                    : 'Starts At *'
                }
              >
                <input
                  type="datetime-local"
                  value={form.startsAt}
                  disabled={!!editingEvent?.repeatsWeekly}
                  onChange={(e) => setForm({ ...form, startsAt: e.target.value })}
                  className="w-full px-3 py-2 bg-white text-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white disabled:opacity-50"
                />
              </Field>

              <Field label="Ends At">
                <input
                  type="datetime-local"
                  value={form.endsAt}
                  onChange={(e) => setForm({ ...form, endsAt: e.target.value })}
                  className="w-full px-3 py-2 bg-white text-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                />
              </Field>

              <Field label="Timezone">
                <input
                  type="text"
                  value={form.timezone}
                  onChange={(e) => setForm({ ...form, timezone: e.target.value })}
                  placeholder="America/New_York"
                  className="w-full px-3 py-2 bg-white text-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                />
              </Field>

              <Field label="Capacity (blank = unlimited)">
                <input
                  type="number"
                  min={1}
                  value={form.capacity}
                  onChange={(e) => setForm({ ...form, capacity: e.target.value })}
                  className="w-full px-3 py-2 bg-white text-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                />
              </Field>

              <Field label="Status" span={2}>
                <select
                  value={form.status}
                  onChange={(e) => setForm({ ...form, status: e.target.value as WebinarStatus })}
                  className="w-full px-3 py-2 bg-white text-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                >
                  {STATUSES.map((s) => (
                    <option key={s} value={s}>{STATUS_LABELS[s]}</option>
                  ))}
                </select>
              </Field>

              <Field label="Repeats" span={2}>
                <label className="flex items-start gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.repeatsWeekly}
                    onChange={(e) => setForm({ ...form, repeatsWeekly: e.target.checked })}
                    className="mt-0.5"
                  />
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    Repeat on a schedule — same weekday, same time. Weeks landing on a weekend
                    or a US holiday are skipped, and registration links stay ~8 weeks ahead
                    automatically.
                  </span>
                </label>
                {form.repeatsWeekly && (
                  <div className="mt-2 flex flex-wrap items-center gap-2">
                    <select
                      value={form.recurrenceIntervalWeeks}
                      onChange={(e) => setForm({ ...form, recurrenceIntervalWeeks: Number(e.target.value) })}
                      className="px-3 py-2 bg-white text-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                    >
                      {INTERVAL_OPTIONS.map((o) => (
                        <option key={o.value} value={o.value}>{o.label}</option>
                      ))}
                    </select>
                    <input
                      type="date"
                      value={form.recurrenceEndsAt}
                      onChange={(e) => setForm({ ...form, recurrenceEndsAt: e.target.value })}
                      className="px-3 py-2 bg-white text-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                    />
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      End date (optional — leave blank to keep repeating)
                    </span>
                  </div>
                )}
              </Field>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => { setModalOpen(false); setEditingEvent(null); }}
                className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={saving}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center justify-center gap-2"
              >
                {saving ? <Loader2 size={16} className="animate-spin" /> : null}
                {editingEvent ? 'Save Changes' : 'Create Webinar'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete confirm modal */}
      {deleteTarget && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-md w-full mx-4 p-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Delete Webinar?</h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              {deleteTarget.repeatsWeekly ? (
                <>
                  This will permanently delete the recurring series{' '}
                  <strong>{deleteTarget.title}</strong> — every occurrence in the series and all
                  of their registrations. This cannot be undone.
                </>
              ) : (
                <>
                  This will permanently delete <strong>{deleteTarget.title}</strong> and all its
                  registrations. This cannot be undone.
                  {deleteTarget.seriesOf
                    ? ' This is one occurrence of a recurring series — the rest of the series is not affected.'
                    : ''}
                </>
              )}
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteTarget(null)}
                className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition flex items-center justify-center gap-2"
              >
                {deleting ? <Loader2 size={16} className="animate-spin" /> : null}
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Field({ label, children, span = 1 }: { label: string; children: React.ReactNode; span?: 1 | 2 }) {
  return (
    <div className={span === 2 ? 'md:col-span-2' : ''}>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{label}</label>
      {children}
    </div>
  );
}

function WebinarsSkeleton() {
  return (
    <div className="p-6">
      <div className="mb-6">
        <div className="h-8 w-48 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
        <div className="h-4 w-64 bg-gray-200 dark:bg-gray-700 rounded mt-2 animate-pulse"></div>
      </div>
      <div className="h-96 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
    </div>
  );
}
