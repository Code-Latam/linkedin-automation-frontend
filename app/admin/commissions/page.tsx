// app/admin/commissions/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { adminApi } from '@/lib/admin-api';
import { useAdminRefresh } from '@/hooks/useAdminRefresh';
import { 
  DollarSign, 
  CheckCircle, 
  Clock, 
  AlertCircle, 
  Eye,
  Check,
  X,
  Download,
  Search,
  ChevronLeft,
  ChevronRight,
  Loader2
} from 'lucide-react';

interface Commission {
  _id: string;
  clientId: {
    _id: string;
    name: string;
    email: string;
    plan?: string;
  };
  dealId: {
    _id: string;
    name: string;
    dealSize: number;
  };
  amount: number;
  status: 'pending' | 'in_transit' | 'paid' | 'voided' | 'refunded';
  closedAt: string;
  invoicedAt: string | null;
  remittedAt: string | null;
  paidAt: string | null;
  invoiceId: string | null;
  notes: string;
  createdAt: string;
  updatedAt: string;
}

interface CommissionSummary {
  totalCommissions: number;
  totalOutstanding: number;
  totalPaid: number;
  totalCount: number;
  pendingCount: number;
  paidCount: number;
}

interface DashboardData {
  commissions: Commission[];
  summary: CommissionSummary;
  byClient: any[];
  pagination: {
    total: number;
    limit: number;
    offset: number;
  };
}

export default function AdminCommissionsPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [limit, setLimit] = useState(50);
  const [offset, setOffset] = useState(0);

  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [selectedCommission, setSelectedCommission] = useState<Commission | null>(null);
  const [showActionModal, setShowActionModal] = useState(false);
  const [actionType, setActionType] = useState<'markPaid' | 'void' | null>(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [overviewRes, listRes] = await Promise.all([
        adminApi.getCommissionsOverview(),
        adminApi.getCommissionsList({
          status: statusFilter !== 'all' ? statusFilter : undefined,
          limit,
          offset,
        }),
      ]);

      setData({
        commissions: listRes.data.data || [],
        summary: overviewRes.data.data.summary,
        byClient: overviewRes.data.data.byClient || [],
        pagination: listRes.data.pagination || { total: 0, limit, offset },
      });
    } catch (err: any) {
      setError(err.message || 'Failed to load commissions data');
    } finally {
      setLoading(false);
    }
  };

  useAdminRefresh(fetchData);

  useEffect(() => {
    fetchData();
  }, [statusFilter, limit, offset]);

  const handleStatusUpdate = async (commissionId: string, newStatus: string) => {
    setActionLoading(commissionId);
    try {
      await adminApi.updateCommissionStatus(commissionId, {
        status: newStatus,
        notes: `Status changed to ${newStatus} by admin on ${new Date().toISOString()}`,
      });
      await fetchData();
      setShowActionModal(false);
      setSelectedCommission(null);
      setActionType(null);
    } catch (err: any) {
      alert('Failed to update commission: ' + (err.response?.data?.error || err.message));
    } finally {
      setActionLoading(null);
    }
  };

  const openActionModal = (commission: Commission, type: 'markPaid' | 'void') => {
    setSelectedCommission(commission);
    setActionType(type);
    setShowActionModal(true);
  };

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
      in_transit: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
      paid: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
      voided: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-400',
      refunded: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
    };
    return styles[status] || styles.pending;
  };

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      pending: 'Pending',
      in_transit: 'In Transit',
      paid: 'Paid',
      voided: 'Voided',
      refunded: 'Refunded',
    };
    return labels[status] || status;
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    }).format(amount);
  };

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return '-';
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getDaysOverdue = (closedAt: string, status: string) => {
    if (status === 'paid' || status === 'voided' || status === 'refunded') return 0;
    const dueDate = new Date(closedAt);
    dueDate.setDate(dueDate.getDate() + 30);
    const now = new Date();
    const diff = Math.floor((now.getTime() - dueDate.getTime()) / (1000 * 60 * 60 * 24));
    return Math.max(0, diff);
  };

  const exportToCSV = () => {
    if (!data || !data.commissions.length) return;

    const headers = ['Client', 'Deal', 'Amount', 'Status', 'Closed Date', 'Paid Date', 'Invoice'];
    const rows = data.commissions.map(c => [
      c.clientId?.name || 'Unknown',
      c.dealId?.name || 'Unknown',
      c.amount.toFixed(2),
      getStatusLabel(c.status),
      formatDate(c.closedAt),
      formatDate(c.paidAt),
      c.invoiceId || '',
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `commissions_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const totalPages = data ? Math.ceil(data.pagination.total / limit) : 0;
  const currentPage = Math.floor(offset / limit) + 1;

  const goToPage = (page: number) => {
    setOffset((page - 1) * limit);
  };

  // Filter commissions by search term
  const filteredCommissions = data?.commissions?.filter(c => {
    if (!searchTerm) return true;
    const searchLower = searchTerm.toLowerCase();
    return (
      c.clientId?.name?.toLowerCase().includes(searchLower) ||
      c.clientId?.email?.toLowerCase().includes(searchLower) ||
      c.dealId?.name?.toLowerCase().includes(searchLower)
    );
  }) || [];

  if (loading) {
    return <CommissionsSkeleton />;
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
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">💰 Commission Management</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Monitor and manage all client commissions
          </p>
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
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Refresh
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      {data?.summary && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-500 dark:text-gray-400">Total Outstanding</p>
              <DollarSign size={20} className="text-blue-600 dark:text-blue-400" />
            </div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
              {formatCurrency(data.summary.totalOutstanding || 0)}
            </p>
          </div>
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-500 dark:text-gray-400">Total Paid</p>
              <CheckCircle size={20} className="text-green-600 dark:text-green-400" />
            </div>
            <p className="text-2xl font-bold text-green-700 dark:text-green-400 mt-1">
              {formatCurrency(data.summary.totalPaid || 0)}
            </p>
          </div>
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-500 dark:text-gray-400">Pending</p>
              <Clock size={20} className="text-yellow-600 dark:text-yellow-400" />
            </div>
            <p className="text-2xl font-bold text-yellow-700 dark:text-yellow-400 mt-1">
              {data.summary.pendingCount || 0}
            </p>
          </div>
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-500 dark:text-gray-400">Total Commissions</p>
              <AlertCircle size={20} className="text-purple-600 dark:text-purple-400" />
            </div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
              {data.summary.totalCount || 0}
            </p>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-wrap gap-4 mb-6">
        <div className="flex-1 min-w-[200px]">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
            <input
              type="text"
              placeholder="Search client or deal..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
            />
          </div>
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
        >
          <option value="all">All Status</option>
          <option value="pending">Pending</option>
          <option value="in_transit">In Transit</option>
          <option value="paid">Paid</option>
          <option value="voided">Voided</option>
          <option value="refunded">Refunded</option>
        </select>
        <button
          onClick={() => {
            setStatusFilter('all');
            setSearchTerm('');
            setOffset(0);
          }}
          className="px-3 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition"
        >
          Clear Filters
        </button>
      </div>

      {/* Commissions Table */}
      <div className="border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-700">
              <tr>
                <th className="px-4 py-3 text-left text-gray-700 dark:text-gray-300 font-semibold">Client</th>
                <th className="px-4 py-3 text-left text-gray-700 dark:text-gray-300 font-semibold">Deal</th>
                <th className="px-4 py-3 text-right text-gray-700 dark:text-gray-300 font-semibold">Amount</th>
                <th className="px-4 py-3 text-left text-gray-700 dark:text-gray-300 font-semibold">Status</th>
                <th className="px-4 py-3 text-left text-gray-700 dark:text-gray-300 font-semibold">Closed Date</th>
                <th className="px-4 py-3 text-left text-gray-700 dark:text-gray-300 font-semibold">Paid Date</th>
                <th className="px-4 py-3 text-center text-gray-700 dark:text-gray-300 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredCommissions.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-gray-500 dark:text-gray-400">
                    {searchTerm ? 'No commissions match your search' : 'No commissions found'}
                  </td>
                </tr>
              ) : (
                filteredCommissions.map((c: Commission) => {
                  const isOverdue = getDaysOverdue(c.closedAt, c.status) > 30;
                  return (
                    <tr key={c._id} className="border-t border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700">
                      <td className="px-4 py-3">
                        <p className="font-semibold text-gray-800 dark:text-gray-200">{c.clientId?.name || 'Unknown'}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">{c.clientId?.email || ''}</p>
                      </td>
                      <td className="px-4 py-3">
                        <p className="font-medium text-gray-800 dark:text-gray-200">{c.dealId?.name || 'Unknown'}</p>
                        {c.dealId?.dealSize && (
                          <p className="text-xs text-gray-500 dark:text-gray-400">${c.dealId.dealSize.toLocaleString()}</p>
                        )}
                      </td>
                      <td className="px-4 py-3 text-right font-semibold text-gray-900 dark:text-white">
                        {formatCurrency(c.amount)}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusBadge(c.status)}`}>
                          {getStatusLabel(c.status)}
                        </span>
                        {isOverdue && c.status !== 'paid' && c.status !== 'voided' && (
                          <span className="ml-2 text-xs text-red-600 dark:text-red-400 font-semibold">
                            ({getDaysOverdue(c.closedAt, c.status)} days overdue)
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-gray-600 dark:text-gray-400">{formatDate(c.closedAt)}</td>
                      <td className="px-4 py-3 text-gray-600 dark:text-gray-400">{formatDate(c.paidAt)}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => {
                              if (c.invoiceId) {
                                window.open(`/admin/invoices/${c.invoiceId}`, '_blank');
                              }
                            }}
                            className={`p-1.5 rounded transition ${c.invoiceId ? 'text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30' : 'text-gray-300 cursor-not-allowed'}`}
                            title="View Invoice"
                            disabled={!c.invoiceId}
                          >
                            <Eye size={16} />
                          </button>
                          {(c.status === 'pending' || c.status === 'in_transit') && (
                            <>
                              <button
                                onClick={() => openActionModal(c, 'markPaid')}
                                disabled={actionLoading === c._id}
                                className="p-1.5 text-green-600 hover:bg-green-50 dark:hover:bg-green-900/30 rounded transition"
                                title="Mark as Paid"
                              >
                                {actionLoading === c._id ? (
                                  <Loader2 size={16} className="animate-spin" />
                                ) : (
                                  <Check size={16} />
                                )}
                              </button>
                              <button
                                onClick={() => openActionModal(c, 'void')}
                                disabled={actionLoading === c._id}
                                className="p-1.5 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 rounded transition"
                                title="Void Commission"
                              >
                                <X size={16} />
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {data && data.pagination.total > 0 && (
        <div className="mt-4 flex items-center justify-between flex-wrap gap-2">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Showing {offset + 1} - {Math.min(offset + limit, data.pagination.total)} of {data.pagination.total} commissions
          </p>
          <div className="flex items-center gap-1">
            <button
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage === 1}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              <ChevronLeft size={18} />
            </button>
            {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
              let pageNum;
              if (totalPages <= 5) {
                pageNum = i + 1;
              } else if (currentPage <= 3) {
                pageNum = i + 1;
              } else if (currentPage >= totalPages - 2) {
                pageNum = totalPages - 4 + i;
              } else {
                pageNum = currentPage - 2 + i;
              }
              return (
                <button
                  key={pageNum}
                  onClick={() => goToPage(pageNum)}
                  className={`px-3 py-1 rounded-lg transition ${
                    currentPage === pageNum
                      ? 'bg-blue-600 text-white'
                      : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}
            <button
              onClick={() => goToPage(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      )}

      {/* Action Modal */}
      {showActionModal && selectedCommission && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-md w-full mx-4 p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                {actionType === 'markPaid' ? 'Mark as Paid' : 'Void Commission'}
              </h2>
              <button
                onClick={() => {
                  setShowActionModal(false);
                  setSelectedCommission(null);
                  setActionType(null);
                }}
                className="text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 text-2xl"
              >
                ×
              </button>
            </div>

            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              {actionType === 'markPaid'
                ? `Are you sure you want to mark this commission as PAID?`
                : `Are you sure you want to VOID this commission? This action cannot be undone.`}
            </p>

            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 mb-4 text-sm">
              <p><strong>Client:</strong> {selectedCommission.clientId?.name || 'Unknown'}</p>
              <p><strong>Deal:</strong> {selectedCommission.dealId?.name || 'Unknown'}</p>
              <p><strong>Amount:</strong> {formatCurrency(selectedCommission.amount)}</p>
              <p><strong>Status:</strong> {getStatusLabel(selectedCommission.status)}</p>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => {
                  setShowActionModal(false);
                  setSelectedCommission(null);
                  setActionType(null);
                }}
                className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  const newStatus = actionType === 'markPaid' ? 'paid' : 'voided';
                  handleStatusUpdate(selectedCommission._id, newStatus);
                }}
                className={`flex-1 px-4 py-2 rounded-lg text-white transition ${
                  actionType === 'markPaid'
                    ? 'bg-green-600 hover:bg-green-700'
                    : 'bg-red-600 hover:bg-red-700'
                }`}
              >
                {actionLoading === selectedCommission._id ? (
                  <Loader2 size={16} className="animate-spin mx-auto" />
                ) : actionType === 'markPaid' ? (
                  'Mark as Paid'
                ) : (
                  'Void Commission'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function CommissionsSkeleton() {
  return (
    <div className="p-6">
      <div className="mb-6">
        <div className="h-8 w-48 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
        <div className="h-4 w-64 bg-gray-200 dark:bg-gray-700 rounded mt-2 animate-pulse"></div>
      </div>
      <div className="grid grid-cols-4 gap-4 mb-6">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="h-24 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
        ))}
      </div>
      <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-6"></div>
      <div className="h-96 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
    </div>
  );
}