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
  billingModel?: string;
  fixedSuccessFee?: number;
  billingPreference?: string;
  migratedToCommissionAt?: string | null;
  revertedToSubscriptionAt?: string | null;
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

  // Commission migration state
  const [migrateModalOpen, setMigrateModalOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [fixedSuccessFee, setFixedSuccessFee] = useState<number>(1000);
  const [billingPreference, setBillingPreference] = useState<'per_deal' | 'monthly_consolidated'>('per_deal');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Revert modal state
  const [revertModalOpen, setRevertModalOpen] = useState(false);
  const [revertClient, setRevertClient] = useState<Client | null>(null);
  const [voidPending, setVoidPending] = useState(true);
  const [revertReason, setRevertReason] = useState('');
  const [isReverting, setIsReverting] = useState(false);
  const [revertInfo, setRevertInfo] = useState<any>(null);

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

  // Open migration modal
  const openMigrateModal = (client: Client) => {
    setSelectedClient(client);
    setFixedSuccessFee(1000);
    setBillingPreference('per_deal');
    setMigrateModalOpen(true);
  };

  // Open edit commission modal
  const openEditCommissionModal = (client: Client) => {
    setSelectedClient(client);
    setFixedSuccessFee(client.fixedSuccessFee || 1000);
    setBillingPreference(client.billingPreference as 'per_deal' | 'monthly_consolidated' || 'per_deal');
    setMigrateModalOpen(true);
  };

  // Open revert modal
  const openRevertModal = async (client: Client) => {
    setRevertClient(client);
    setVoidPending(true);
    setRevertReason('');
    setRevertInfo(null);
    setRevertModalOpen(true);
    
    try {
      const response = await adminApi.getRevertInfo(client.clientId);
      setRevertInfo(response.data.data);
    } catch (err: any) {
      alert('Error fetching revert info: ' + (err.response?.data?.error || err.message));
    }
  };

  // Submit migration
  const handleMigrateSubmit = async () => {
    if (!selectedClient) return;
    
    setIsSubmitting(true);
    try {
      const response = await adminApi.migrateToCommission({
        clientId: selectedClient.clientId,
        fixedSuccessFee,
        billingPreference,
      });

      if (response.data.success) {
        setMigrateModalOpen(false);
        setSelectedClient(null);
        await fetchData();
        alert('Client successfully migrated to commission model!');
      }
    } catch (err: any) {
      alert('Error: ' + (err.response?.data?.error || err.message));
    } finally {
      setIsSubmitting(false);
    }
  };

  // Submit revert
  const handleRevertSubmit = async () => {
    if (!revertClient) return;
    
    setIsReverting(true);
    try {
      const response = await adminApi.revertToSubscription({
        clientId: revertClient.clientId,
        voidPendingCommissions: voidPending,
        reason: revertReason || 'Admin requested revert',
      });

      if (response.data.success) {
        setRevertModalOpen(false);
        setRevertClient(null);
        await fetchData();
        alert('Client successfully reverted to subscription!');
      }
    } catch (err: any) {
      alert('Error: ' + (err.response?.data?.error || err.message));
    } finally {
      setIsReverting(false);
    }
  };

  // Close modals
  const closeMigrateModal = () => {
    setMigrateModalOpen(false);
    setSelectedClient(null);
  };

  const closeRevertModal = () => {
    setRevertModalOpen(false);
    setRevertClient(null);
    setRevertInfo(null);
  };

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
          <option value="postboost">PostBoost</option>
          <option value="marketing">Marketing</option>
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
                <th className="px-4 py-3 text-left text-gray-700 font-semibold">Billing</th>
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
                const isCommission = client.billingModel === 'commission';
                
                return (
                  <tr key={client.clientId} className="border-t border-gray-100 hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <p className="font-semibold text-gray-800">{client.name}</p>
                      <p className="text-xs text-gray-500">{client.email}</p>
                      {isCommission && client.migratedToCommissionAt && (
                        <p className="text-xs text-green-600 mt-1">
                          Migrated: {new Date(client.migratedToCommissionAt).toLocaleDateString()}
                        </p>
                      )}
                      {client.billingModel === 'subscription' && client.revertedToSubscriptionAt && (
                        <p className="text-xs text-orange-500 mt-1">
                          Reverted: {new Date(client.revertedToSubscriptionAt).toLocaleDateString()}
                        </p>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        client.plan === 'premium' ? 'bg-purple-100 text-purple-700' :
                        client.plan === 'marketing' ? 'bg-blue-100 text-blue-700' :
                        client.plan === 'postboost' ? 'bg-green-100 text-green-700' :
                        'bg-gray-100 text-gray-700'
                      }`}>
                        {client.plan}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div>
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                          isCommission ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                        }`}>
                          {isCommission ? 'Commission' : 'Subscription'}
                        </span>
                        {isCommission && client.fixedSuccessFee && (
                          <span className="text-xs text-gray-700 dark:text-gray-300 font-medium block mt-1">
                            Fee: ${client.fixedSuccessFee.toLocaleString()}
                          </span>
                        )}
                        {isCommission && client.billingPreference && (
                          <span className="text-xs text-gray-600 dark:text-gray-400 block">
                            {client.billingPreference === 'per_deal' ? 'Per-deal invoicing' : 'Monthly consolidated'}
                          </span>
                        )}
                      </div>
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
                      <div className="flex items-center gap-1 flex-wrap">
                        <Link
                          href={`/admin/clients/${client.clientId}`}
                          className="text-blue-600 hover:text-blue-800 flex items-center gap-1 text-sm"
                        >
                          View <ExternalLink size={12} />
                        </Link>
                        {!isCommission && (
                          <button
                            onClick={() => openMigrateModal(client)}
                            className="text-xs bg-green-100 text-green-700 hover:bg-green-200 px-2 py-1 rounded transition whitespace-nowrap"
                          >
                            Migrate
                          </button>
                        )}
                        {isCommission && (
                          <>
                            <button
                              onClick={() => openRevertModal(client)}
                              className="text-xs bg-red-100 text-red-700 hover:bg-red-200 px-2 py-1 rounded transition whitespace-nowrap"
                            >
                              Revert
                            </button>
                            <button
                              onClick={() => openEditCommissionModal(client)}
                              className="text-xs bg-blue-100 text-blue-700 hover:bg-blue-200 px-2 py-1 rounded transition whitespace-nowrap"
                            >
                              Edit Fee
                            </button>
                          </>
                        )}
                      </div>
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

      {/* Migration Modal */}
      {migrateModalOpen && selectedClient && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full mx-4 p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-900">
                {selectedClient.billingModel === 'commission' ? 'Edit Commission Settings' : 'Migrate to Commission Model'}
              </h2>
              <button
                onClick={closeMigrateModal}
                className="text-gray-400 hover:text-gray-600 text-2xl"
                disabled={isSubmitting}
              >
                ×
              </button>
            </div>

            <p className="text-sm text-gray-600 mb-4">
              {selectedClient.billingModel === 'commission'
                ? `Update the commission settings for "${selectedClient.name}".`
                : `"${selectedClient.name}" will be moved from subscription to commission-based billing.`}
            </p>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Fixed Success Fee ($)
                </label>
                <input
                  type="number"
                  value={fixedSuccessFee}
                  onChange={(e) => setFixedSuccessFee(parseFloat(e.target.value) || 0)}
                  min={0}
                  step={100}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., 2500"
                />
                <p className="text-xs text-gray-500 mt-1">
                  The fixed amount charged per closed deal. Recommended: 3-10% of average deal size.
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Billing Preference
                </label>
                <select
                  value={billingPreference}
                  onChange={(e) => setBillingPreference(e.target.value as 'per_deal' | 'monthly_consolidated')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="per_deal">Per-Deal Invoicing (Immediate)</option>
                  <option value="monthly_consolidated">Monthly Consolidated Invoicing</option>
                </select>
                <p className="text-xs text-gray-500 mt-1">
                  Per-deal: Invoice sent immediately when a deal closes. Monthly: All deals invoiced together on the 1st of each month.
                </p>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={closeMigrateModal}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button
                onClick={handleMigrateSubmit}
                disabled={isSubmitting || fixedSuccessFee <= 0}
                className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Saving...' : selectedClient.billingModel === 'commission' ? 'Save Changes' : 'Migrate to Commission'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Revert Modal */}
      {revertModalOpen && revertClient && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full mx-4 p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-900">
                Revert to Subscription
              </h2>
              <button
                onClick={closeRevertModal}
                className="text-gray-400 hover:text-gray-600 text-2xl"
                disabled={isReverting}
              >
                ×
              </button>
            </div>

            <p className="text-sm text-gray-600 mb-4">
              Revert <strong>"{revertClient.name}"</strong> from commission model back to subscription.
            </p>

            {/* Revert Info */}
            {revertInfo && (
              <div className="bg-gray-50 rounded-lg p-4 mb-4 text-sm">
                <p><strong>Fixed Fee:</strong> ${revertInfo.fixedSuccessFee?.toLocaleString()}</p>
                {revertInfo.migratedAt && (
                  <p><strong>Migrated At:</strong> {new Date(revertInfo.migratedAt).toLocaleDateString()}</p>
                )}
                
                <div className="mt-2 pt-2 border-t border-gray-200">
                  <p><strong>Pending Commissions:</strong> {revertInfo.summary?.pendingCount || 0}</p>
                  <p><strong>Total Pending Amount:</strong> ${(revertInfo.summary?.totalPendingAmount || 0).toLocaleString()}</p>
                  <p><strong>Paid Commissions:</strong> {revertInfo.summary?.paidCount || 0}</p>
                  <p><strong>Total Paid Amount:</strong> ${(revertInfo.summary?.totalPaidAmount || 0).toLocaleString()}</p>
                </div>

                {revertInfo.pendingCommissions?.length > 0 && (
                  <div className="mt-2 pt-2 border-t border-gray-200">
                    <p className="font-medium">Pending Deals:</p>
                    <ul className="list-disc list-inside text-xs text-gray-600 max-h-24 overflow-y-auto">
                      {revertInfo.pendingCommissions.map((c: any) => (
                        <li key={c.id}>{c.dealName} - ${c.amount.toLocaleString()}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  What to do with pending commissions?
                </label>
                <div className="space-y-2">
                  <label className="flex items-start gap-2 cursor-pointer">
                    <input
                      type="radio"
                      checked={voidPending === true}
                      onChange={() => setVoidPending(true)}
                      className="mt-1"
                    />
                    <div>
                      <span className="font-medium text-gray-800">Void all pending commissions</span>
                      <p className="text-xs text-gray-500">
                        Client will NOT owe you any pending commissions. All pending commissions will be voided.
                      </p>
                    </div>
                  </label>
                  <label className="flex items-start gap-2 cursor-pointer">
                    <input
                      type="radio"
                      checked={voidPending === false}
                      onChange={() => setVoidPending(false)}
                      className="mt-1"
                    />
                    <div>
                      <span className="font-medium text-gray-800">Keep pending commissions</span>
                      <p className="text-xs text-gray-500">
                        Client will still owe you for pending commissions. They must pay before migrating.
                      </p>
                    </div>
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Reason for Revert (Optional)
                </label>
                <input
                  type="text"
                  value={revertReason}
                  onChange={(e) => setRevertReason(e.target.value)}
                  placeholder="e.g., Client requested, Not enough deals, etc."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={closeRevertModal}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
                disabled={isReverting}
              >
                Cancel
              </button>
              <button
                onClick={handleRevertSubmit}
                disabled={isReverting}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isReverting ? 'Reverting...' : 'Revert to Subscription'}
              </button>
            </div>
          </div>
        </div>
      )}
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