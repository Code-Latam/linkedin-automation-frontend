// components/admin/ConversionTrendsChart.tsx
'use client';

import {
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ComposedChart,
  Bar,
} from 'recharts';

interface ConversionTrendsChartProps {
  data: {
    personsByDay?: Array<{ _id: string; count: number }>;
    conversionsByDay?: Array<{ _id: string; count: number }>;
    dateRange?: { from: Date; to: Date; days: number };
  };
}

export function ConversionTrendsChart({ data }: ConversionTrendsChartProps) {
  if (!data || (!data.personsByDay?.length && !data.conversionsByDay?.length)) {
    return (
      <div className="border border-gray-200 rounded-lg bg-white p-4">
        <h3 className="font-semibold text-gray-900 mb-4">Conversion Trends</h3>
        <div className="h-80 flex items-center justify-center text-gray-500">
          No conversion data available yet
        </div>
      </div>
    );
  }

  // Combine leads and conversions data
  const leadsMap = new Map();
  const conversionsMap = new Map();
  
  data.personsByDay?.forEach(d => leadsMap.set(d._id, d.count));
  data.conversionsByDay?.forEach(d => conversionsMap.set(d._id, d.count));
  
  const allDates = new Set([
    ...(data.personsByDay?.map(d => d._id) || []),
    ...(data.conversionsByDay?.map(d => d._id) || []),
  ]);
  
  const chartData = Array.from(allDates).sort().map(date => ({
    date,
    leads: leadsMap.get(date) || 0,
    conversions: conversionsMap.get(date) || 0,
  }));
  
  // Calculate cumulative conversion rate
  let totalLeads = 0;
  let totalConversions = 0;
  const chartDataWithRate = chartData.map(item => {
    totalLeads += item.leads;
    totalConversions += item.conversions;
    const conversionRate = totalLeads > 0 ? (totalConversions / totalLeads * 100).toFixed(1) : '0';
    return {
      ...item,
      cumulativeConversionRate: parseFloat(conversionRate),
    };
  });

  // Custom tooltip
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-3">
          <p className="text-sm font-semibold text-gray-900 mb-2">{label}</p>
          {payload.map((p: any, idx: number) => (
            <p key={idx} className="text-sm" style={{ color: p.color }}>
              {p.name}: {p.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="border border-gray-200 rounded-lg bg-white shadow-sm">
      <div className="px-6 py-4 border-b border-gray-100 bg-gray-50">
        <h3 className="font-semibold text-gray-900">Conversion Trends (Last 30 Days)</h3>
        <p className="text-sm text-gray-500 mt-1">Leads created vs. conversions over time</p>
      </div>
      <div className="p-4">
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={chartDataWithRate}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="date" stroke="#6b7280" fontSize={12} />
              <YAxis yAxisId="left" stroke="#6b7280" fontSize={12} label={{ value: 'Count', angle: -90, position: 'insideLeft', style: { fill: '#6b7280' } }} />
              <YAxis yAxisId="right" orientation="right" stroke="#10b981" fontSize={12} label={{ value: 'Conversion Rate %', angle: 90, position: 'insideRight', style: { fill: '#10b981' } }} />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Bar
                yAxisId="left"
                dataKey="leads"
                fill="#3b82f6"
                name="New Leads"
                opacity={0.7}
                radius={[4, 4, 0, 0]}
              />
              <Bar
                yAxisId="left"
                dataKey="conversions"
                fill="#10b981"
                name="Conversions"
                opacity={0.7}
                radius={[4, 4, 0, 0]}
              />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="cumulativeConversionRate"
                stroke="#f59e0b"
                name="Cumulative Conversion Rate %"
                strokeWidth={2}
                dot={{ r: 3, fill: "#f59e0b" }}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-4 text-center text-xs text-gray-400">
          <p>Bars show daily leads (blue) and conversions (green). Line shows cumulative conversion rate.</p>
        </div>
      </div>
    </div>
  );
}