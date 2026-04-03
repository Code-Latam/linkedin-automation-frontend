// components/admin/TrendsChart.tsx
'use client';

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

interface ChartDataPoint {
  date: string;
  persons?: number;
  meetings?: number;
  send_invitation?: number;
  send_message?: number;
  start_chat?: number;
}

interface TrendsChartProps {
  data: {
    personsByDay?: Array<{ _id: string; count: number }>;
    meetingsByDay?: Array<{ _id: string; count: number }>;
    actionsByDay?: Array<{ date: string; send_invitation: number; send_message: number; start_chat: number }>;
  };
}

export function TrendsChart({ data }: TrendsChartProps) {
  // Handle missing or empty data
  if (!data) {
    return (
      <div className="rounded-lg border border-gray-200 bg-white shadow-sm">
            <div className="px-4 py-3 border-b border-gray-200 bg-gray-50">
                <h3 className="font-semibold text-gray-800">Trends (Last 30 Days)</h3>
            </div>
            <div className="p-4">
                {/* Chart content */}
            </div>
            </div>
    );
  }

  // Explicitly type chartData as an array of ChartDataPoint
  let chartData: ChartDataPoint[] = [];
  
  if (data.actionsByDay && data.actionsByDay.length > 0) {
    // Use actions data if available
    chartData = data.actionsByDay;
  } else {
    // Build from personsByDay and meetingsByDay
    const personsMap = new Map<string, number>();
    const meetingsMap = new Map<string, number>();
    
    if (data.personsByDay) {
      data.personsByDay.forEach(d => personsMap.set(d._id, d.count));
    }
    if (data.meetingsByDay) {
      data.meetingsByDay.forEach(d => meetingsMap.set(d._id, d.count));
    }
    
    const allDates = new Set<string>([
      ...(data.personsByDay?.map(d => d._id) || []),
      ...(data.meetingsByDay?.map(d => d._id) || []),
    ]);
    
    chartData = Array.from(allDates).sort().map(date => ({
      date,
      persons: personsMap.get(date) || 0,
      meetings: meetingsMap.get(date) || 0,
    }));
  }

  if (chartData.length === 0) {
    return (
      <div className="rounded-lg border bg-white dark:bg-gray-800 p-4">
        <h3 className="font-semibold mb-4">Trends (Last 30 Days)</h3>
        <div className="h-80 flex items-center justify-center text-muted-foreground">
          No trend data available yet
        </div>
      </div>
    );
  }

  // Determine which keys to show in the chart
  const hasPersons = chartData.some(item => 'persons' in item);
  const hasMeetings = chartData.some(item => 'meetings' in item);
  const hasActions = chartData.some(item => 'send_invitation' in item);

  return (
    <div className="rounded-lg border bg-white dark:bg-gray-800 p-4">
      <h3 className="font-semibold mb-4">Trends (Last 30 Days)</h3>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            {hasPersons && (
              <Line
                type="monotone"
                dataKey="persons"
                stroke="#3b82f6"
                name="New Leads"
                strokeWidth={2}
              />
            )}
            {hasMeetings && (
              <Line
                type="monotone"
                dataKey="meetings"
                stroke="#10b981"
                name="Meetings Booked"
                strokeWidth={2}
              />
            )}
            {hasActions && (
              <>
                <Line
                  type="monotone"
                  dataKey="send_invitation"
                  stroke="#8b5cf6"
                  name="Invitations Sent"
                  strokeWidth={2}
                />
                <Line
                  type="monotone"
                  dataKey="send_message"
                  stroke="#f59e0b"
                  name="Messages Sent"
                  strokeWidth={2}
                />
              </>
            )}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}