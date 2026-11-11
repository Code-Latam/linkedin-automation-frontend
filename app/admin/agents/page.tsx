// app/admin/agents/page.tsx
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { adminApi } from '@/lib/admin-api';
import { useAdminRefresh } from '@/hooks/useAdminRefresh';
import { Search, ChevronDown, ChevronUp, Users, ExternalLink, Activity } from 'lucide-react';

interface Agent {
  agentId: string;
  name: string;
  role: string;
  clientId: string;
  clientName: string;
  clientPlan: string;
  metrics: {
    personsAssigned: number;
    convertedCount: number;
    conversionRate: string | number;
    activeConversations: number;
    funnel: {
      open: number;
      'pending-connection': number;
      connected: number;
      'in-conversation': number;
      converted: number;
    };
    todayActions: {
      total: number;
      invitations: number;
      messages: number;
      startChats: number;
    };
    last7Days: {
      invitations: number;
      messages: number;
      startChats: number;
      failures: number;
    };
  };
}

interface ClientSummary {
  clientId: string;
  clientName: string;
  clientPlan: string;
  totalAgents: number;
  totalLeads: number;
  totalConverted: number;
  overallRate: string;
}

export default function AgentsPage() {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [clientSummaries, setClientSummaries] = useState<ClientSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  
  // Filter states
  const [selectedClientId, setSelectedClientId] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [sortField, setSortField] = useState<keyof Agent['metrics']>('conversionRate');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  // Handle mounted state for hydration
  useEffect(() => {
    setMounted(true);
  }, []);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await adminApi.getAgentsPerformance();
      const agentsData = response.data.data || [];
      setAgents(agentsData);
      
      // Build client summaries from agents data
      const clientMap = new Map<string, ClientSummary>();
      agentsData.forEach((agent: Agent) => {
        if (!clientMap.has(agent.clientId)) {
          clientMap.set(agent.clientId, {
            clientId: agent.clientId,
            clientName: agent.clientName || 'Unknown',
            clientPlan: agent.clientPlan || 'free',
            totalAgents: 0,
            totalLeads: 0,
            totalConverted: 0,
            overallRate: '0'
          });
        }
        const summary = clientMap.get(agent.clientId)!;
        summary.totalAgents++;
        summary.totalLeads += agent.metrics?.personsAssigned || 0;
        summary.totalConverted += agent.metrics?.convertedCount || 0;
      });
      
      // Calculate rates
      const summaries = Array.from(clientMap.values()).map(summary => ({
        ...summary,
        overallRate: summary.totalLeads > 0 
          ? ((summary.totalConverted / summary.totalLeads) * 100).toFixed(1)
          : '0'
      }));
      
      // Sort by total leads descending
      summaries.sort((a, b) => b.totalLeads - a.totalLeads);
      setClientSummaries(summaries);
      
    } catch (err: any) {
      console.error('Fetch error:', err);
      setError(err.message || 'Failed to load agents data');
    } finally {
      setLoading(false);
    }
  };

  useAdminRefresh(fetchData);

  useEffect(() => {
    fetchData();
  }, []);

  // Filter agents
  const filteredAgents = agents.filter(agent => {
    const matchesClient = selectedClientId === 'all' || agent.clientId === selectedClientId;
    const matchesSearch = (agent.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (agent.role || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === 'all' || agent.role === roleFilter;
    return matchesClient && matchesSearch && matchesRole;
  });

  // Sort agents
  const sortedAgents = [...filteredAgents].sort((a, b) => {
    let aVal: number = 0;
    let bVal: number = 0;
    
    switch (sortField) {
      case 'conversionRate':
        aVal = parseFloat(String(a.metrics?.conversionRate || '0'));
        bVal = parseFloat(String(b.metrics?.conversionRate || '0'));
        break;
      case 'personsAssigned':
        aVal = a.metrics?.personsAssigned || 0;
        bVal = b.metrics?.personsAssigned || 0;
        break;
      case 'convertedCount':
        aVal = a.metrics?.convertedCount || 0;
        bVal = b.metrics?.convertedCount || 0;
        break;
      case 'activeConversations':
        aVal = a.metrics?.activeConversations || 0;
        bVal = b.metrics?.activeConversations || 0;
        break;
      default:
        aVal = (a.metrics as any)?.[sortField] || 0;
        bVal = (b.metrics as any)?.[sortField] || 0;
    }
    
    if (sortDirection === 'asc') {
      return aVal > bVal ? 1 : -1;
    } else {
      return aVal < bVal ? 1 : -1;
    }
  });

  // Get unique roles for filter
  const roles = ['all', ...new Set(agents.map(a => a.role).filter(Boolean))];

  // Get selected client name
  const selectedClientName = selectedClientId === 'all' 
    ? 'All Clients' 
    : clientSummaries.find(c => c.clientId === selectedClientId)?.clientName || 'Unknown';

  // Toggle sort
  const handleSort = (field: keyof Agent['metrics']) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const SortIcon = ({ field }: { field: keyof Agent['metrics'] }) => {
    if (sortField !== field) return null;
    return sortDirection === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />;
  };

  const formatRate = (rate: string | number | undefined): string => {
    if (rate === undefined || rate === null) return '0';
    const num = typeof rate === 'string' ? parseFloat(rate) : rate;
    return isNaN(num) ? '0' : num.toFixed(1);
  };

  // Don't render on server
  if (!mounted) {
    return <div className="p-6"><div className="h-8 w-48 bg-gray-200 rounded animate-pulse"></div></div>;
  }

  if (loading) {
    return <AgentsSkeleton />;
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
        <h1 className="text-2xl font-bold text-gray-900">Agents</h1>
        <p className="text-gray-500 mt-1">Manage and monitor AI agents across all clients</p>
      </div>

      {/* Client Summary Cards */}
      {clientSummaries.length > 0 && (
        <div className="mb-6">
          <h2 className="text-sm font-semibold text-gray-500 mb-3 uppercase tracking-wider">Clients ({clientSummaries.length})</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {/* All Clients Summary Card */}
            <div 
              className={`border rounded-lg p-4 cursor-pointer transition-all ${
                selectedClientId === 'all' 
                  ? 'border-blue-500 bg-blue-50' 
                  : 'border-gray-200 bg-white hover:border-gray-300'
              }`}
              onClick={() => setSelectedClientId('all')}
            >
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-semibold text-gray-900">All Clients</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{agents.length} agents</p>
                </div>
                <Users size={20} className="text-gray-400" />
              </div>
              <div className="mt-2 text-sm text-gray-500">
                {clientSummaries.reduce((sum, c) => sum + c.totalLeads, 0)} total leads
              </div>
            </div>
            
            {/* Individual Client Cards */}
            {clientSummaries.slice(0, 6).map(client => {
              const rate = parseFloat(client.overallRate);
              return (
                <div 
                  key={client.clientId}
                  className={`border rounded-lg p-4 cursor-pointer transition-all ${
                    selectedClientId === client.clientId 
                      ? 'border-blue-500 bg-blue-50' 
                      : 'border-gray-200 bg-white hover:border-gray-300'
                  }`}
                  onClick={() => setSelectedClientId(client.clientId)}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-semibold text-gray-900 truncate max-w-[180px]">{client.clientName}</p>
                      <p className="text-xs text-gray-500 mt-0.5">{client.clientPlan} • {client.totalAgents} agents</p>
                    </div>
                    <span className={`text-xs px-1.5 py-0.5 rounded ${
                      rate === 0 ? 'bg-gray-100 text-gray-600' :
                      rate > 10 ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                    }`}>
                      {client.overallRate}% conv
                    </span>
                  </div>
                  <div className="mt-2 flex justify-between text-sm">
                    <span className="text-gray-600">{client.totalLeads} leads</span>
                    <span className="text-green-600">{client.totalConverted} converted</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Selected Client Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">
            Agents {selectedClientId !== 'all' && `for ${selectedClientName}`}
          </h2>
          <p className="text-sm text-gray-500">{filteredAgents.length} agents found</p>
        </div>
        {selectedClientId !== 'all' && (
          <button 
            onClick={() => setSelectedClientId('all')}
            className="text-sm text-blue-600 hover:text-blue-800"
          >
            Show all clients →
          </button>
        )}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 mb-6">
        <div className="flex-1 min-w-[200px]">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
            <input
              type="text"
              placeholder="Search agents by name or role..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          className="px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {roles.map(role => (
            <option key={role} value={role}>{role === 'all' ? 'All Roles' : role}</option>
          ))}
        </select>
      </div>

      {/* Agents Table */}
      <div className="border border-gray-200 rounded-lg bg-white shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left text-gray-700 font-semibold whitespace-nowrap">Agent</th>
                <th className="px-4 py-3 text-left text-gray-700 font-semibold whitespace-nowrap">Client</th>
                <th className="px-4 py-3 text-center text-gray-700 font-semibold cursor-pointer whitespace-nowrap" onClick={() => handleSort('personsAssigned')}>
                  <div className="flex items-center justify-center gap-1">
                    Total Leads <SortIcon field="personsAssigned" />
                  </div>
                </th>
                
                {/* Funnel Breakdown */}
                <th className="px-4 py-3 text-center text-gray-700 font-semibold whitespace-nowrap" title="Open Leads">Open</th>
                <th className="px-4 py-3 text-center text-gray-700 font-semibold whitespace-nowrap" title="Pending Invites">Pending</th>
                <th className="px-4 py-3 text-center text-gray-700 font-semibold whitespace-nowrap" title="In Conversation">In Convo</th>
                
                <th className="px-4 py-3 text-center text-gray-700 font-semibold cursor-pointer whitespace-nowrap" onClick={() => handleSort('convertedCount')}>
                  <div className="flex items-center justify-center gap-1">
                    Converted <SortIcon field="convertedCount" />
                  </div>
                </th>
                
                <th className="px-4 py-3 text-center text-gray-700 font-semibold cursor-pointer whitespace-nowrap" onClick={() => handleSort('activeConversations')}>
                  <div className="flex items-center justify-center gap-1">
                    Conv % <SortIcon field="conversionRate" />
                  </div>
                </th>

                {/* Today's Activity */}
                <th className="px-4 py-3 text-center text-gray-700 font-semibold whitespace-nowrap" title="Total Actions Today">
                  <div className="flex items-center justify-center gap-1 text-blue-700">
                    <Activity size={14} /> Today
                  </div>
                </th>

                <th className="px-4 py-3 text-center text-gray-700 font-semibold whitespace-nowrap">7d Errors</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {sortedAgents.map((agent) => {
                const conversionRate = formatRate(agent.metrics?.conversionRate);
                const rateNum = parseFloat(conversionRate);
                const funnel = agent.metrics?.funnel || { open: 0, 'pending-connection': 0, 'in-conversation': 0 };
                
                return (
                  <tr key={agent.agentId} className="border-t border-gray-100 hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <div>
                        <p className="font-semibold text-gray-800">{agent.name || 'Unnamed'}</p>
                        <p className="text-xs text-gray-500">{agent.role || 'No role'}</p>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <Link href={`/admin/clients/${agent.clientId}`} className="group">
                        <p className="text-gray-700 group-hover:text-blue-600 transition-colors">{agent.clientName || 'Unknown'}</p>
                        <p className="text-xs text-gray-400">{agent.clientPlan || 'free'}</p>
                      </Link>
                    </td>
                    <td className="px-4 py-3 text-center font-medium text-gray-800">{agent.metrics?.personsAssigned || 0}</td>
                    
                    {/* Funnel Cells */}
                    <td className="px-4 py-3 text-center text-gray-500 text-xs">{funnel.open || '-'}</td>
                    <td className="px-4 py-3 text-center text-yellow-600 text-xs">{funnel['pending-connection'] || '-'}</td>
                    <td className="px-4 py-3 text-center text-indigo-600 text-xs font-medium">{funnel['in-conversation'] || '-'}</td>
                    
                    <td className="px-4 py-3 text-center font-medium text-green-700">{agent.metrics?.convertedCount || 0}</td>
                    <td className="px-4 py-3 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <span className={`font-semibold ${rateNum > 10 ? 'text-green-700' : 'text-gray-700'}`}>
                          {conversionRate}%
                        </span>
                      </div>
                    </td>
                    
                    {/* Today Actions */}
                    <td className="px-4 py-3 text-center">
                      <span className="inline-flex items-center justify-center px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 font-medium text-xs">
                        {agent.metrics?.todayActions?.total || 0} actions
                      </span>
                    </td>

                    <td className="px-4 py-3 text-center">
                      {(agent.metrics?.last7Days?.failures || 0) > 0 ? (
                        <span className="text-red-600 font-medium">{agent.metrics?.last7Days?.failures || 0}</span>
                      ) : (
                        <span className="text-green-600">0</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <Link href={`/admin/clients/${agent.clientId}`} className="text-blue-600 hover:text-blue-800" title="View Client Details">
                        <ExternalLink size={16} />
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {filteredAgents.length === 0 && (
          <div className="text-center py-12 text-gray-500">No agents found</div>
        )}
      </div>
    </div>
  );
}

function AgentsSkeleton() {
  return (
    <div className="p-6">
      <div className="mb-6">
        <div className="h-8 w-48 bg-gray-200 rounded animate-pulse"></div>
        <div className="h-4 w-64 bg-gray-200 rounded mt-2 animate-pulse"></div>
      </div>
      <div className="grid grid-cols-3 gap-3 mb-6">
        {[1, 2, 3].map(i => <div key={i} className="h-28 bg-gray-200 rounded animate-pulse"></div>)}
      </div>
      <div className="h-10 bg-gray-200 rounded animate-pulse mb-4"></div>
      <div className="h-96 bg-gray-200 rounded animate-pulse"></div>
    </div>
  );
}